import { createServer } from "http";
import express, { Request, Response } from "express";
import next from "next";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  Move,
  Room,
  ServerToClientEvents,
} from "@/common/types/socketTypes";
import { socket } from "@/common/lib/socket";

const PORT = parseInt(process.env.PORT || "5000", 10);
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextApiHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
  const app = express();
  const server = createServer(app);

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server);

  app.get("/health", async (_, res) => {
    res.send("Healthy");
  });

  const rooms = new Map<string, Room>();

  const addMove = (roomId: string, socketId: string, move: Move) => {
    const room = rooms?.get(roomId);

    if (!room?.users?.has(socketId)) {
      room?.users?.set(socketId, [move]);
    }

    room?.users?.get(socketId)!.push(move);
  };

  const undoMove = (roomId: string, socketId: string) => {
    const room = rooms?.get(roomId);

    room?.users?.get(socketId)?.pop();
  };

  const leavRoom = (roomId: string, socketId: string) => {
    const room = rooms.get(roomId);
    const userMoves = room?.users.get(socketId);
    if (userMoves) room?.drawed.push(...userMoves);
    room?.users.delete(socketId);
    console.log(room);
  };

  io.on("connection", (socket) => {
    console.log("connection");

    const getRoomId = () => {
      const joinedRoom = [...socket?.rooms].find((room) => room !== socket.id);
      if (!joinedRoom) return socket.id;

      return joinedRoom;
    };

    socket.on("create_room", () => {
      let roomId: string;

      do {
        roomId = Math.random().toString(36).substring(2, 6);
      } while (rooms.has(roomId));

      socket.join(roomId);

      rooms.set(roomId, { users: new Map(), drawed: [] });
      rooms.get(roomId)?.users.set(socket.id, []);

      io.to(socket.id).emit("created", roomId);
    });

    socket.on("join_room", (roomId: string) => {
      if (rooms.has(roomId)) {
        socket.join(roomId);

        io.to(socket.id).emit("joined", roomId);
      } else io.to(socket.id).emit("joined", "", true);
    });

    socket.on("joined_room", () => {
      console.log("joined room");

      const roomId = getRoomId();

      const room = rooms.get(roomId);
      if (room) {
        room.users?.set(socket.id, []);

        io.to(socket.id).emit("room", room, JSON.stringify([...room.users]));

        socket.broadcast.to(roomId).emit("new_user", socket.id);
      }
    });

    socket.on("leave_room", () => {
      const roomId = getRoomId();
      leavRoom(roomId, socket.id);
      io.to(roomId).emit("user_disconnected", socket.id);
    });

    socket.on("draw", (move) => {
      console.log("drawing");
      const roomId = getRoomId();

      addMove(roomId, socket.id, move);
      socket.broadcast.to(roomId).emit("user_draw", move, socket.id);
    });

    socket.on("undo", () => {
      const roomId = getRoomId();

      console.log("undo");
      undoMove(roomId, socket.id);
      socket.broadcast.to(roomId).emit("user_undo", socket.id);
    });

    socket.on("mouse_move", (x, y) => {
      console.log("mouse_move");
      const roomId = getRoomId();

      socket.broadcast.to(roomId).emit("mouse_moved", x, y, socket.id);
    });

    socket.on("disconnecting", () => {
      const roomId = getRoomId();
      leavRoom(roomId, socket.id)
      io.to(roomId).emit("user_disconnected", socket.id);
    });
    
  });
  app.all("*", (req: Request, res: Response) => {
    return nextApiHandler(req, res);
  });

  server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});

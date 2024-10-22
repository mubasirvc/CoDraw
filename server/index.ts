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
      room?.usersMoves?.set(socketId, [move]);
    }

    room?.usersMoves?.get(socketId)!.push(move);
  };

  const undoMove = (roomId: string, socketId: string) => {
    const room = rooms?.get(roomId);

    room?.usersMoves?.get(socketId)?.pop();
  };

  const leavRoom = (roomId: string, socketId: string) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const userMoves = room?.usersMoves.get(socketId);
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

    socket.on("create_room", (username) => {
      let roomId: string;

      do {
        roomId = Math.random().toString(36).substring(2, 6);
      } while (rooms.has(roomId));

      socket.join(roomId);

      rooms.set(roomId, {
        users: new Map([[socket.id, username]]),
        drawed: [],
        usersMoves: new Map([[socket.id, []]]),
      });

      io.to(socket.id).emit("created", roomId);
    });

    socket.on("join_room", (roomId, username) => {
      const room = rooms.get(roomId);
      if (room) {
        socket.join(roomId);

        room.users.set(socket.id, username);
        room.usersMoves.set(socket.id, []);

        io.to(socket.id).emit("joined", roomId);
      } else io.to(socket.id).emit("joined", "", true);
    });

    socket.on("check_room", (roomId) => {
      if (rooms.has(roomId)) socket.emit("room_exists", true);
      else socket.emit("room_exists", false);
    });

    socket.on("joined_room", () => {
      console.log("joined room");

      const roomId = getRoomId();

      const room = rooms.get(roomId);
      if (!room) return;

      io.to(socket.id).emit(
        "room",
        room,
        JSON.stringify([...room.usersMoves]),
        JSON.stringify([...room.users])
      );

      socket.broadcast
        .to(roomId)
        .emit("new_user", socket.id, room.users.get(socket.id) || "Anonymous");
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
      const roomId = getRoomId();

      socket.broadcast.to(roomId).emit("mouse_moved", x, y, socket.id);
    });

    socket.on("disconnecting", () => {
      const roomId = getRoomId();
      leavRoom(roomId, socket.id);
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

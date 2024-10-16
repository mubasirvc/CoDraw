import { createServer } from "http";
import express, { Request, Response } from "express";
import next from "next";
import { Server } from "socket.io";
import { ClientToServerEvents, Move, Room, ServerToClientEvents } from "@/common/types/socketTypes";
import { socket } from "@/common/lib/socket";

const PORT = parseInt(process.env.PORT || "5000", 10);
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextApiHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
  const app = express();
  const server = createServer(app);

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server)

  app.get("/health", async(_, res) => {
    res.send("Healthy")
  })

  const rooms = new Map<string, Room>()
  rooms.set("global", new Map())

  const addMove = (roomId: string, socketId: string, move: Move) => {
    const room = rooms?.get(roomId)

    if(!room?.has(socketId)){
      room?.set(socketId, [move])
    }

    room?.get(socketId)?.push(move)
  }

  const undoMove = (roomId: string, socketId: string,) => {
    const room = rooms?.get(roomId)

    room?.get(socketId)?.pop()
  }

  io.on("connection", (socket) => {
    console.log('connection');

    socket.join("global")
    rooms.get("global")?.set(socket.id, [])

    io.to(socket.id).emit("joined", JSON.stringify([...rooms.get("global")!]))

    const allUsers = io.sockets.adapter.rooms.get("global")
    if(allUsers) io.to("global").emit("users_in_room", [...allUsers])

    socket.on("draw", (move) => {
      console.log('drawing');
      addMove("global", socket.id, move)
      socket.broadcast.emit("user_draw", move, socket.id)
    })

    socket.on("undo", () => {
      console.log("undo");
      undoMove("global", socket.id)
      socket.broadcast.emit("user_undo", socket.id)
    })

    socket.on("mouse_move", (x, y) => {
      console.log('mouse_move');
      socket.broadcast.emit("mouse_moved", x, y, socket.id)
    })

    socket.on("disconnect",() => {
      console.log('client disconnected');
    })
    
  })
  app.all("*", (req: Request, res: Response) => {
    return nextApiHandler(req, res);
  });

  server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});

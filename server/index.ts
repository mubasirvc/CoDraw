import { createServer } from "http";
import express, { Request, Response } from "express";
import next from "next";
import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "@/common/types/socketTypes";

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

  io.on("connection", (socket) => {
    console.log('connection');

    socket.join("global")

    const allUsers = io.sockets.adapter.rooms.get("global")
    if(allUsers) io.to("global").emit("users_in_room", [...allUsers])

    socket.on("draw", (move) => {
      console.log('drawing');
      socket.broadcast.emit("user_draw", move, socket.id)
    })

    socket.on("undo", () => {
      console.log("undo");
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

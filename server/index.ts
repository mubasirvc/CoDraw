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

    socket.on("draw", (move, option) => {
      console.log('drawing');
      socket.broadcast.emit("socket_draw", move, option)
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

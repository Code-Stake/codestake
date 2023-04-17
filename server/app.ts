import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import routes from "./routes";
import socketController from "./controllers/socketController";

export const app = express();
export const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use("/api", routes);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

socketController(io)


app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING ON PORT 3001");
});

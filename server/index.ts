import express from "express";
const app = express();
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
const fs = require("fs");

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  const roomCapacity = {};

  socket.on("join_room", (data) => {
    const room = data;
    let numUsers = io.sockets.adapter.rooms.get(room)?.size || 0;

    if (numUsers < 2) {
      socket.join(room);

      numUsers = io.sockets.adapter.rooms.get(room)?.size;

      //emit to all users in the room
      io.to(room).emit("room_joined", {
        message: `User joined room ${room}`,
        room: room,
        capacity: `${numUsers}`,
      });
      roomCapacity[room] = numUsers;
    } else {
      socket.emit("room_full", { message: "Room is already full!" });
    }
  });

  socket.on("send_message", (data) => {
    socket.to(data.roomEntered).emit("receive_message", data);
  });

  // Listen to the 'disconnect' event on the socket
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    // You can remove the socket from any rooms it's joined
    const rooms = Object.keys(socket.rooms);
    rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
        // Decrement the room capacity when the socket leaves the room
        roomCapacity[room] -= 1;
        // Emit the room capacity to all sockets in the room
        // io.to(room).emit("room_capacity", { capacity: `${roomCapacity[room]}/2` })
      }
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/questionContents", (req, res) => {
  try {
    const fileContents = fs.readFileSync("questionContent.txt", "utf-8");
    const sectionPlaceholders = [
      {
        start: "# <section1>",
        end: "# </section1>",
        name: "preProcessingCode",
      },
      {
        start: "# <section2>",
        end: "# </section2>",
        name: "starterCode",
      },
      {
        start: "# <section3>",
        end: "# </section3>",
        name: "executionCode",
      },
      {
        start: "# <section4>",
        end: "# </section4>",
        name: "testCaseInput1",
      },
      {
        start: "# <section5>",
        end: "# </section5>",
        name: "testCaseOutput1",
      },
      {
        start: "# <section6>",
        end: "# </section6>",
        name: "testCaseInput2",
      },
      {
        start: "# <section7>",
        end: "# </section7>",
        name: "testCaseOutput2",
      },
      {
        start: "# <section8>",
        end: "# </section8>",
        name: "testCaseInput3",
      },
      {
        start: "# <section9>",
        end: "# </section9>",
        name: "testCaseOutput3",
      },
    ];
    const result = {};
    for (const placeholder of sectionPlaceholders) {
      const regex = new RegExp(
        `${placeholder.start}([\\s\\S]*?)${placeholder.end}`,
        "s"
      );
      const match = fileContents.match(regex);
      const contents = match ? match[1] : "";
      result[placeholder.name] = contents;
    }
    return res.send(result);
  } catch (error) {
    res.send(error);
  }
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING ON PORT 3001");
});

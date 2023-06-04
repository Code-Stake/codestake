import { Server } from "socket.io";
import { app, server } from "../app";

export default function socketController(io: Server) {
  const roomCapacity = {};

  io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);

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

    socket.on("winner", (data) => {
      // close the room
      const room = data.room;
      io.to(room).emit("room_closed", { message: `Room ${room} is closed` });
      // remove the room from the roomCapacity object
      delete roomCapacity[room];
    });

    socket.on("get_room_capacity", (data) => {
      console.log(roomCapacity);
      socket.emit("room_capacity", roomCapacity);
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
}

import React, { useState, useEffect } from "react";
import "./App.css";
import io from "socket.io-client";
import { CodeEditor } from "./pages/codeEditor";

const socket = io("http://localhost:3001");

function App() {
  const [roomEntered, setRoomEntered] = useState("");
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [roomCapacity, setRoomCapacity] = useState(0);
  const [roomToEnter, setRoomToEnter] = useState("");
  const [isRoomFull, setIsRoomFull] = useState(false);
  const [rooms, setRooms] = useState<Number[]>([]); // {room1: {capacity: 1, room: "room1"}, room2: {capacity: 2, room: "room2"}}

  const joinRoom = () => {
    console.log("join room");
    socket.emit("get_room_capacity");

    socket.on("room_capacity", (data) => {
      let rooms = data;
      console.log(rooms);
      let i = 0;
      while (true) {
        if (rooms.hasOwnProperty(i) && rooms[i] === 2) {
          i += 1;
        } else {
          break;
        }
      }
      setIsRoomFull(false);
      socket.emit("join_room", i);
    });
  };

  const sendMessage = () => {
    socket.emit("send_message", { message, roomEntered });
  };

  const disconnectConnection = () => {
    socket.disconnect();

    setJoinedRoom(false);
    setRoomCapacity(0);
    setRoomEntered("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    });

    socket.on("room_joined", (data) => {
      console.log(data);
      setRoomCapacity(data.capacity);
      setRoomEntered(data.room);
      setJoinedRoom(true);
      if (data.capacity === "2") {
        setIsRoomFull(true);
      }
    });

    socket.on("room_full", (data) => {
      alert(data.message);
    });

    socket.on("disconnect", (data) => {
      console.log("disconnected");
    });

    return () => {
      socket.off("receive_message");
      socket.off("room_joined");
      socket.off("room_full");
      socket.off("disconnect");
    };
  }, [rooms]);

  const InfoComponent = () => {
    return (
      <div className="w-full h-56 flex flex-col items-center  justify-center">
        {joinedRoom ? (
          <></>
        ) : (
          <button
            className={
              "mt-4 border-2 border-black z-10 text-4xl rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-12 py-8 hover:shadow transition duration-200 bg-white flex-shrink-0 "
            }
            onClick={joinRoom}
          >
            {" "}
            Join Room
          </button>
        )}

        {joinedRoom ? (
          <div className="">
            <h1>You have joined room {roomEntered}</h1>
            <h2>Capacity: {roomCapacity}/2</h2>
          </div>
        ) : null}

        <div className="w-fit border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0">
          <button onClick={disconnectConnection}>Disconnect Connection</button>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <div
        className={`items-center justify-center flex flex-col ${
          isRoomFull ? "hidden" : "h-screen"
        }`}
      >
        <div className="h-16 w-full absolute top-0 bg-codestake flex items-center justify-center ">
          <h1 className=" text-4xl text-white font-bold text-center">
            CodeStake
          </h1>
        </div>
        <InfoComponent />
      </div>
      <div>
        {isRoomFull ? (
          <div>
            <CodeEditor roomId={roomEntered} />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default App;

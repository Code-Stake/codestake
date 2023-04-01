import React, { useState, useEffect } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

function App() {
  const [roomEntered, setRoomEntered] = useState("");
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [roomCapacity, setRoomCapacity] = useState(0);
  const [roomToEnter, setRoomToEnter] = useState("");
  const [isRoomFull, setIsRoomFull] = useState(false);

  const joinRoom = () => {
    if (roomToEnter !== "") {
      setIsRoomFull(false);
      socket.emit("join_room", roomToEnter);
    }
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
  }, []);

  return (
    <div className="App">
      <h1>HELLO WORLD</h1>
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoomToEnter(event.target.value);
        }}
      />
      <button onClick={joinRoom}> Join Room</button>
      <input
        placeholder="Message..."
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}> Send Message</button>
      {joinedRoom ? (
        <div>
          <h1>You have joined room {roomEntered}</h1>
          <h2>Capacity: {roomCapacity}/2</h2>
        </div>
      ) : null}
      <div>
        <h1>Message Received: {messageReceived}</h1>
      </div>

      <div>
        <button onClick={disconnectConnection}>Disconnect Connection</button>
      </div>

      <div>
        {isRoomFull ? (
          <div>
            <button>Start Challenge</button>
          </div>
        ) : (
          <div>Waiting for other player to join...</div>
        )}
      </div>
    </div>
  );
}

export default App;

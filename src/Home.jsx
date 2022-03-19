import React, { useEffect, useState, useRef } from "react";
import QRCode from "react-qr-code";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { searchvalue } from "./actions/index";
import io from "socket.io-client";
function Home() {
  const [roomid, setroomid] = useState("");
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const link = useRef();

  useEffect(() => {
    roomID();
    try {
      const newSocket = io(`https://socket.ankitzxi05.repl.co`, {
        transports: ["websocket", "polling", "flashsocket"],
      });
      setSocket(newSocket);
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  }, []);

  function roomID(min = 10000, max = 99999) {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor(rand * difference);
    rand = rand + min;
    localStorage.setItem("roomID", rand);
    setroomid(rand);
  }

  socket &&
    socket.on("roomJoined", (data) => {
      if (Number(data.id) === Number(localStorage.getItem("roomID"))) {
        joinRoom();
        dispatch(searchvalue(socket));
        link && link.current.click();
      }
    });

  const joinRoom = async () => {
    const val = { id: roomid };
    socket && socket.emit("joinRoom", val);
  };

  return (
    <>
      <div className="app">
        <p className="title">ShareX</p>
        <p>Enter The Code</p>

        <button className="code-btn">{roomid}</button>

        <div className="line-container">
          <div className="line"></div>
          <p>OR</p>
          <div className="line line-2"></div>
        </div>
        <QRCode size={150} value={`${roomid}`} />
        <p>Scan the QR Code</p>
        <Link ref={link} className="link" to="/change"></Link>
      </div>
    </>
  );
}

export default Home;

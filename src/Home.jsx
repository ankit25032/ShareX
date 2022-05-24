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
  const connected=localStorage.getItem('connected');
  function roomID(min = 10000, max = 99999) {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor(rand * difference);
    rand = rand + min;
    localStorage.setItem("roomID", rand);
    setroomid(rand);
    return rand;
  }
  useEffect(() => {
    console.log(!connected);
    if(connected=='false'||connected==undefined||connected==null||connected==false){
      console.log(connected);
   const roomidd= roomID();
    
    try {
      const newSocket = io(`https://socket.ankitzxi05.repl.co`, {
        transports: ["websocket", "polling", "flashsocket"],
      });
      setSocket(newSocket);
      const val = { id: roomidd,message:"from2"};
      console.log(val);
      newSocket && newSocket.emit("joinRoom", val);
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  }
  else{
    console.log("gettinggg....");
    const newSocket = io(`https://socket.ankitzxi05.repl.co`, {
      transports: ["websocket", "polling", "flashsocket"],
    });
    setSocket(newSocket);
    dispatch(searchvalue(newSocket));
    const rand=Number(localStorage.getItem('roomID'))
    console.log(rand);
    setroomid(rand);
    const val = { id: rand,message:"from1" };
    console.log(val);
    newSocket.emit("joinRoom", val);
      link && link.current.click();
  }
  }, []);

  

  socket &&
    socket.on("roomJoined",async (data) => {
      if (Number(data.id) === Number(localStorage.getItem("roomID"))) {
     console.log(data);
        localStorage.setItem('connected',true);
        dispatch(searchvalue(socket));
        link && link.current.click();
      }

      
    });

  // const joinRoom = async () => {
    
  // };

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

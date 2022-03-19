import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";
import { IoFileTrayOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import File from "./File";

function Main() {
  let buff = [];
  let history = useNavigate();

  const [data, setdata] = useState("");
  const [file, setfile] = useState("");
  const [totalSize, settotalSize] = useState();
  const [transmitted, settransmitted] = useState(1);
  const [buffer, setbuffer] = useState([]);

  const [messages, setmessages] = useState([]);
  const socket = useSelector((state) => state.setsearch);
  const [filebase, setfilebase] = useState([]);
  const [loading, setloading] = useState(true);
  const value = useRef();
  const sendtxt = useRef();
  const fileinput = useRef();
  const link = useRef();

  const content = useRef();

  useEffect(() => {
    let total_size = 0;
    socket.on("sent-message", (data) => {
      handleAllMessages(data);
    });
    socket.on("clientDisconnect", (data) => {
      link && link.current.click();
    });
    socket.on("send-file", (data) => {
      const ele = <File data={data} />;
      setmessages([...messages, ele]);
    });

    socket.on("metadata", (data) => {
      console.log(data.meta);
      settotalSize(data.meta);
      socket.emit("fs-start", {});
    });
    socket.on("fs-share", (data) => {
      // settransmitted((transmitted) => transmitted + data.buffer.bytesLength);
      // console.log("====================================");
      // console.log(totalSize);
      // console.log("====================================");
      if (data.length >= 0) {
        console.log(data);
        setbuffer((buffer) => [...buffer, ...new Uint8Array(data.buffer)]);
        socket.emit("fs-start", {});
      } else {
        console.log("sent");
      }
    });

    return () => {
      socket.close();
    };
  }, []);

  setTimeout(() => {
    setloading(false);
  }, 2000);

  function handleAllMessages(data) {
    const roomid = localStorage.getItem("roomID");
    console.log(data);
    const ele = (
      <>
        <div key={roomid + data} className="outgoing">
          <p key={roomid + data + "1000"}>{data}</p>
        </div>
      </>
    );
    console.log("====================================");
    console.log(messages);
    console.log("====================================");
    setmessages((messages) => [...messages, ele]);
  }

  function handleIncoming() {
    const roomid = localStorage.getItem("roomID");
    const ele = (
      <>
        <div key={roomid + data} className="incoming">
          <p>{sendtxt.current.value}</p>
        </div>
      </>
    );

    setmessages([...messages, ele]);

    const val = { id: roomid, message: sendtxt.current.value };
    socket.emit("message", val);
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    console.log(file);
    setfile(file);
  }
  async function handleFile() {
    const blob = new Blob(new Uint8Array(buffer));
    var url = URL.createObjectURL(blob);
    console.log(url);
    const ele = <File blob={url} />;
    setmessages([...messages, ele]);

    // fileinput.current.click();
  }

  return (
    <>
      <div className="container">
        {loading ? (
          <div className="app">
            <InfinitySpin color="dodgerblue" />
          </div>
        ) : (
          <>
            <div className="back-btn">
              <img
                onClick={() => history(-1)}
                alt="back-btn"
                src="https://img.icons8.com/ios-glyphs/30/000000/arrow-pointing-left--v2.png"
              />
              <button
                onClick={() => {
                  socket.close();
                  link && link.current.click();
                }}
                className="disconnect"
              >
                Disconnect
              </button>
            </div>
            <div ref={content} className="content">
              {messages.map((ele) => {
                return ele;
              })}
            </div>
            <div className="input">
              <div className="send">
                <input
                  ref={fileinput}
                  onChange={(e) => handleFileChange(e)}
                  className="fileinput"
                  type="file"
                />
                <IoFileTrayOutline onClick={handleFile} />
              </div>
              <input
                ref={sendtxt}
                autoFocus
                placeholder="Paste or type Something"
                type="text"
                className="send-txt"
              />
              <div onClick={handleIncoming} className="send">
                <img
                  className="send-btn"
                  src="https://img.icons8.com/external-kmg-design-glyph-kmg-design/32/000000/external-send-user-interface-kmg-design-glyph-kmg-design.png"
                  alt="send"
                />
              </div>
            </div>
          </>
        )}
      </div>
      <Link ref={link} className="link" to="/"></Link>
    </>
  );
}

export default Main;

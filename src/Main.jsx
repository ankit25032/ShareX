import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InfinitySpin, TailSpin } from "react-loader-spinner";
import { IoFileTrayOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BsDownload } from "react-icons/bs";
import { FileIcon, defaultStyles } from "react-file-icon";
import storage from "./firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

function Main() {
  let buff = [];
  let history = useNavigate();
  const loader =
    "<svg class='spinner' viewBox='0 0 50 50'><circle class='path' cx='25' cy='25' r='20' fill='none' stroke-width='5'></circle></svg>";
  const tick =
    "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'/></svg>";

  const [data, setdata] = useState("");
  const [id, setid] = useState();
  const [downloading, setdownloading] = useState(false);
const [change,setchange]=useState(1);
  const [messages, setmessages] = useState([]);
  const socket = useSelector((state) => state.setsearch);
  const [filebase, setfilebase] = useState([]);
  const [loading, setloading] = useState(true);
  const value = useRef();
  const sendtxt = useRef();
  const fileinput = useRef();
  const link = useRef();

  const content = useRef();
  useEffect(()=>{
    setid(localStorage.getItem('roomID'))
    let premessage=localStorage.getItem('messages');
    console.log(premessage);
      console.log(content.current);
      content.current.innerHTML=premessage
      setloading(false)
  },[])

  useEffect(()=>{
    console.log("calling useefgf");
      const data= content.current.innerHTML
        localStorage.setItem('messages',data);
  
  },[messages,change])

 

  function bytesToSize(bytes) {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Byte";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  }

  function handleDownload(e, data) {
    const svg = e.target.innerHTML;
    e.target.innerHTML = "";
    console.log(e.target);
    e.target.innerHTML = loader;
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      console.log("complete");
    };
    xhr.addEventListener("progress", function (z) {
      var percent_complete = (z.loaded / z.total) * 100;
      if (percent_complete === 100) {
        console.log(e);
        console.log("complete");
        e.target.innerHTML = "";
        e.target.innerHTML = svg;
      }
      console.log(percent_complete);
    });

    xhr.responseType = "blob";
    xhr.onload = (event) => {
      const blob = xhr.response;
      const uri = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = uri;
      a.download = data.name;
      a.click();
      a.remove();
    };
    xhr.open("GET", data.durl);
    xhr.send();
  }

  useEffect(() => {
    let total_size = 0;
    socket.on("sent-message", (data) => {
      handleAllMessages(data);
    });

    socket.on("clientDisconnect", (data) => {
      link && link.current.click();
    });

    socket.on("send-file", (data) => {
      console.log(data );
      const ele = (
        <>
          <div className="outgoing file-outgoing ">
            <FileIcon
              className="file-icon-incoming"
              extension={
                data &&
                data.name.substring(
                  data.name.lastIndexOf(".") + 1,
                  data.name.length
                )
              }
              {...defaultStyles.docx}
            />
            <p>
              {data &&
                data.name.substring(0, 10) +
                  "..." +
                  data.name.substring(
                    data.name.lastIndexOf(".") + 1,
                    data.name.length
                  )}
            </p>

            <div className="download-btn">
              <a target="_blank" href={data.durl}>
                <BsDownload size={12} />
              </a>

              <p>{bytesToSize(data.size)}</p>
            </div>
          </div>
        </>
      );
      setmessages((messages) => [...messages, ele]);
    });



    return () => {
      // socket.close();
    };
  }, []);


    
  

  function handleAllMessages(data) {
    console.log(data);
    const roomid = localStorage.getItem("roomID");
    const ele = (
      <>
        <div key={roomid + data} className="outgoing">
          <p key={roomid + data + "1000"}>{data}</p>
        </div>
      </>
    );

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
  function random(min = 1, max = 999999) {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor(rand * difference);
    rand = rand + min;

    return rand;
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    const name = file.name;
    const size = file.size;
    const rand = random();
    const ele = (
      <>
        <div className=" incoming file-incoming ">
          <FileIcon
            className="file-icon-incoming"
            extension={
              name && name.substring(name.lastIndexOf(".") + 1, name.length)
            }
            {...defaultStyles.docx}
          />
          <p>
            {name &&
              name.substring(0, 10) +
                "..." +
                name.substring(name.lastIndexOf(".") + 1, name.length)}
          </p>

          <div className="download-btn">
            <a className={rand.toString()}>
              <TailSpin />
            </a>

            <p>{bytesToSize(size)}</p>
          </div>
        </div>
      </>
    );

    setmessages((messages) => [...messages, ele]);

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result);
      const spaceRef = ref(storage, name + random());
      uploadString(spaceRef, reader.result, "data_url").then((snapshot) => {
        const tag = document.getElementsByClassName(rand.toString());
        console.log(tag[0].innerHTML);
        tag[0].innerHTML = "";
        tag[0].innerHTML = tick;
        console.log("Uploaded a base64 string!");

        getDownloadURL(spaceRef).then((url) => {
          console.log(url);
          const file = {
            durl: url,
            name: name,
            size: size,
            id:id
          };
          socket.emit("file", file);
        });
        const data=change+1;

        
        setchange(data)
      });
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }
  async function handleFile() {
    fileinput.current.click();
  }

  return (
    <>
      <div className="container">
        {loading ? (
          <div className="app2">
            <InfinitySpin color="dodgerblue" />
          </div>
        ) :null}
          <>
            <div className="back-btn">
              <img
                onClick={() => {
                  socket.emit('client-Diss',{id})
                  socket.close();
                  localStorage.setItem('connected',false)
                  localStorage.removeItem('messages')
                  
                  history(-1)
                }}
                alt="back-btn"
                src="https://img.icons8.com/ios-glyphs/30/000000/arrow-pointing-left--v2.png"
              />
              <button
                onClick={() => {
                  socket.emit('client-Diss',{id})
                  socket.close();                
                  localStorage.setItem('connected',false)
                  localStorage.removeItem('messages')
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
        
      </div>
      <Link ref={link} className="link" to="/"></Link>
    </>
  );
}

export default Main;
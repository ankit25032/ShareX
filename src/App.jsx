import logo from "./logo.svg";
import "./App.css";
import React from "react";
import Home from "./Home";
import Main from "./Main";
import { Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";

import configureStore from "./store";

function App() {
  return (
    <div className="MApp">
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/change" element={<Main />} />
      </Routes>
    </div>
  );
}

export default App;

import React, { useState, useReducer } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// My Components
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import Axios from "axios";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";
import myContext from "./contexts/myContext";
import stateContext from "./contexts/stateContext";
import dispatchContext from "./contexts/dispatchContext";

Axios.defaults.baseURL = "http://localhost:8888";

function Main() {
  const initialState = {
    isLoggedIn: Boolean(localStorage.getItem("token")),
    flashMessages: [],
  };
  const reducer = (state, action) => {
    // action to setIsLoggedIn or setFlashMessages
    // and return new states
    switch (action.type) {
      case "login":
        return { isLoggedIn: true, flashMessages: state.flashMessages };
      case "logout":
        return { isLoggedIn: false, flashMessages: state.flashMessages };
      case "flashMessage":
        return {
          isLoggedIn: state.isLoggedIn,
          flashMessages: [...state.flashMessages, action.value],
        };
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <stateContext.Provider value={state}>
      <dispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Routes>
            <Route
              path="/"
              element={state.isLoggedIn ? <Home /> : <HomeGuest />}
            />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/posts/:id" element={<ViewSinglePost />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </dispatchContext.Provider>
    </stateContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<Main />);

if (module.hot) {
  module.hot.accept();
}

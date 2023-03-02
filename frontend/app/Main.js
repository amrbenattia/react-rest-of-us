import React, { useReducer, useEffect } from "react";
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
import Profile from "./components/Profile";

Axios.defaults.baseURL = "http://localhost:8888";

function Main() {
  const initialState = {
    isLoggedIn: Boolean(localStorage.getItem("token")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("token"),
      username: localStorage.getItem("username"),
      avatar: localStorage.getItem("avatar"),
    },
  };
  const reducer = (state, action) => {
    // action to setIsLoggedIn or setFlashMessages
    // and return new states
    switch (action.type) {
      case "login":
        return {
          isLoggedIn: true,
          user: action.data, // setState from response
          flashMessages: state.flashMessages,
        };
      case "logout":
        return {
          isLoggedIn: false,
          user: state.user,
          flashMessages: state.flashMessages,
        };
      case "flashMessage":
        return {
          isLoggedIn: state.isLoggedIn,
          user: state.user,
          flashMessages: [...state.flashMessages, action.value],
        };
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.isLoggedIn) {
      localStorage.setItem("token", state.user.token);
      localStorage.setItem("username", state.user.username);
      localStorage.setItem("avatar", state.user.avatar);
    } else {
      localStorage.clear();
    }
  }, [state.isLoggedIn]);
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
            <Route path="/profile/:username" element={<Profile />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </dispatchContext.Provider>
    </stateContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Main />);

if (module.hot) {
  module.hot.accept();
}

import React, { useContext, useState } from "react";
import Axios from "axios";
import dispatchContext from "../contexts/dispatchContext";

const LoggedOut = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useContext(dispatchContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post("/login", {
        username,
        password,
      });
      if (response.data) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("avatar", response.data.avatar);
        dispatch({ type: "login" });
      }
    } catch (error) {
      console.log("problem happened");
    }
  };
  return (
    <form className="mb-0 pt-2 pt-md-0" onSubmit={(e) => handleSubmit(e)}>
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control form-control-sm input-dark"
            type="text"
            placeholder="Username"
            autoComplete="off"
          />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control form-control-sm input-dark"
            type="password"
            placeholder="Password"
          />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  );
};

export default LoggedOut;

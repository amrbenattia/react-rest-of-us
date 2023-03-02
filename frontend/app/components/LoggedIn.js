import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import dispatchContext from "../contexts/dispatchContext";
import stateContext from "../contexts/stateContext";

const LoggedIn = () => {
  const dispatch = useContext(dispatchContext);
  const state = useContext(stateContext);
  const navigate = useNavigate();
  return (
    <div className="flex-row my-3 my-md-0">
      <a href="#" className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </a>
      <span className="mr-2 header-chat-icon text-white">
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <Link to={`/profile/${state.user.username}`} className="mr-2">
        <img className="small-header-avatar" src={state.user.avatar} />
      </Link>
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>
      <button
        onClick={() => {
          dispatch({ type: "logout" });
          navigate("/");
        }}
        className="btn btn-sm btn-secondary"
      >
        Sign Out
      </button>
    </div>
  );
};

export default LoggedIn;

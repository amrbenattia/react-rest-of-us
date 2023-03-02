import React, { useContext, useState } from "react";
import Page from "./Page";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import dispatchContext from "../contexts/dispatchContext";
import stateContext from "../contexts/stateContext";
const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const dispatch = useContext(dispatchContext);
  const navigate = useNavigate();
  const state = useContext(stateContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post("/create-post", {
        title,
        body,
        token: state.user.token,
      });
      dispatch({
        type: "flashMessage",
        value: "Congrats, you successfully created a post.",
      });
      navigate(`/posts/${response.data}`);
    } catch (error) {
      console.log("something went wrong while posting");
    }
  };
  return (
    <Page>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
          ></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  );
};

export default CreatePost;

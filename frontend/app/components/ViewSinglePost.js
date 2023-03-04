import Axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import LoadingDots from "./LoadingDots";
import Page from "./Page";
import ReactMarkdown from "react-markdown";
import NotFound from "./NotFound";
import stateContext from "../contexts/stateContext";
import dispatchContext from "../contexts/dispatchContext";

const ViewSinglePost = () => {
  const [post, setPost] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const appState = useContext(stateContext);
  const appDispatch = useContext(dispatchContext);

  const navigate = useNavigate();
  const { id } = useParams();

  // request depend on id when search and select a post among search
  useEffect(() => {
    const request = Axios.CancelToken.source();
    const fetchPost = async () => {
      try {
        const response = await Axios.get(`/post/${id}`, {
          cancelToken: request.token,
        });
        setPost(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log("Encounter an Error while fetching a post" + error);
      }
    };
    fetchPost();
    //clean if request got canceled
    return () => request.cancel();
  }, [id]);

  if (!isLoading && !post) {
    return <NotFound />;
  }
  if (isLoading) {
    return <LoadingDots />;
  }
  const date = new Date(post.createdDate);
  const formattedDate = `${
    date.getMonth() + 1
  }/${date.getDay()}/${date.getFullYear()}`;

  const isOwner = () => {
    if (appState.isLoggedIn) {
      return appState.user.username === post.author.username;
    }
    return false;
  };

  const handleDelete = async () => {
    const sureToDelete = window.confirm(
      "Are you sure you want to progress the the post deletion"
    );
    if (sureToDelete) {
      try {
        const response = await Axios.delete(`/post/${id}`, {
          data: { token: appState.user.token },
        });
        if ((response.data = "success")) {
          appDispatch({
            type: "flashMessage",
            value: "Congrats, you successfully created a post.",
          });
          navigate(`/profile/${appState.user.username}`);
        }
      } catch (error) {
        console.log("Error encounter while deletion" + error);
      }
    }
  };
  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link
              to={`/posts/${post._id}/edit`}
              className="text-primary mr-2"
              title="Edit"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <a
              onClick={handleDelete}
              className="delete-post-button text-danger"
              title="Delete"
            >
              <i className="fas fa-trash"></i>
            </a>
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{" "}
        on {formattedDate}
      </p>

      <div className="body-content">
        <ReactMarkdown
          children={post.body}
          allowElements={[
            "p",
            "br",
            "strong",
            "h1",
            "h2",
            "h3",
            "h3",
            "h4",
            "h5",
            "h6",
            "em",
            "ul",
            "ol",
            "li",
          ]}
        />
      </div>
    </Page>
  );
};

export default ViewSinglePost;

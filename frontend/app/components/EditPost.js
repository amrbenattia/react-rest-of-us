import Axios from "axios";
import React, { useEffect, useContext, useReducer } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import stateContext from "../contexts/stateContext";
import LoadingDots from "./LoadingDots";
import dispatchContext from "../contexts/dispatchContext";
import Page from "./Page";
import NotFound from "./NotFound";

const EditPost = () => {
  const initialState = {
    title: {
      value: "",
      hasError: false,
      message: "",
    },
    body: {
      value: "",
      hasError: false,
      message: "",
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    updateButtonDisabled: true,
    notFound: false,
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case "fetchDataComplete":
        return {
          ...state,
          title: { ...state.title, value: action.value.title },
          body: { ...state.body, value: action.value.title },
          isFetching: false,
        };
      case "changeTitle":
        return {
          ...state,
          title: { ...state.title, value: action.value, hasError: false },
          updateButtonDisabled: false,
        };
      case "changeBody":
        return {
          ...state,
          body: { ...state.body, value: action.value, hasError: false },
          updateButtonDisabled: false,
        };
      case "savingStarted":
        return {
          ...state,
          isSaving: true,
        };
      case "savingFinished":
        return {
          ...state,
          isSaving: false,
        };
      case "titleRule":
        if (!action.value.trim()) {
          return {
            ...state,
            title: {
              ...state.title,
              hasError: true,
              message: "You must provide a title",
            },
          };
        } else {
          return {
            ...state,
          };
        }
      case "bodyRule":
        if (!action.value.trim()) {
          return {
            ...state,
            body: {
              ...state.body,
              hasError: true,
              message: "You must provide a body",
            },
          };
        } else {
          return {
            ...state,
          };
        }
      case "notFound":
        return {
          ...state,
          notFound: true,
        };
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const appState = useContext(stateContext);
  const appDispatch = useContext(dispatchContext);
  const navigate = useNavigate();
  useEffect(() => {
    const request = Axios.CancelToken.source();
    const fetchPost = async () => {
      try {
        const response = await Axios.get(`/post/${state.id}`, {
          cancelToken: request.token,
        });
        if (response.data) {
          dispatch({ type: "fetchDataComplete", value: response.data });
          if (appState.user.username !== response.data.author.username) {
            appDispatch({
              type: "flashMessage",
              value: "Don't have permissions to edit this post.",
            });
            navigate("/");
          }
        } else {
          dispatch({ type: "notFound" });
        }
      } catch (error) {
        console.log("Encounter an Error while fetching a post" + error);
      }
    };
    fetchPost();
    //clean if request got canceled
    return () => request.cancel();
  }, []);

  if (state.notFound) {
    return <NotFound />;
  }
  if (state.isFetching) {
    return <LoadingDots />;
  }

  const updatePost = async () => {
    dispatch({ type: "savingStarted" });
    try {
      await Axios.post(`/post/${state.id}/edit`, {
        title: state.title.value,
        body: state.body.value,
        token: appState.user.token,
      });
      dispatch({ type: "savingFinished" });
      appDispatch({
        type: "flashMessage",
        value: "Congrats, you successfully updated a post.",
      });
    } catch (error) {
      console.log("Encounter an Error while updating the post" + error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!state.title.hasError && !state.body.hasError) {
      updatePost();
    }
  };

  return (
    <Page title="Edit post">
      <Link className="small font-weight-bold" to={`/posts/${state.id}`}>
        &laquo; Back to post
      </Link>
      <form className="mt-3" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            value={state.title.value}
            onChange={(e) => {
              dispatch({ type: "changeTitle", value: e.target.value });
              dispatch({ type: "titleRule", value: e.target.value });
            }}
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
          />
          {state.title.hasError && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.title.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            value={state.body.value}
            onChange={(e) => {
              dispatch({ type: "changeBody", value: e.target.value });
              dispatch({ type: "bodyRule", value: e.target.value });
            }}
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
          ></textarea>
          {state.body.hasError && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.body.message}
            </div>
          )}
        </div>

        <button
          className="btn btn-primary"
          disabled={state.updateButtonDisabled || state.isSaving}
        >
          Save Updates
        </button>
      </form>
    </Page>
  );
};

export default EditPost;

import Axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import dispatchContext from "../contexts/dispatchContext";
import { Link } from "react-router-dom";

const Search = () => {
  const dispatch = useContext(dispatchContext);
  const [searchState, setSearchState] = useState({
    searchTerm: "",
    results: [],
    show: "",
    requestCount: 0,
  });
  const handleClose = () => {
    dispatch({ type: "closeSearch" });
  };

  console.log(searchState);
  const handleSearch = (e) => {
    setSearchState((oldSearchState) => ({
      ...oldSearchState,
      searchTerm: e.target.value,
    }));
  };
  // very elegant to wait 3seconds after typing and clean function
  // to clean the result after each type in search and so send request once not with every type
  useEffect(() => {
    if (searchState.searchTerm.trim()) {
      setSearchState((old) => ({
        ...old,
        show: "loading",
      }));
      // set 2 seconds delay after typing to catch typing
      const delay = setTimeout(() => {
        // send request in different useEffect based on set request count
        setSearchState((old) => ({
          ...old,
          requestCount: old.requestCount + 1,
        }));
      }, 700);
      return () => clearTimeout(delay);
    } else {
      setSearchState((old) => ({
        ...old,
        show: "",
      }));
    }
    // to clean the result after each type in search
    // so catch only the last typing not with each letter
  }, [searchState.searchTerm]);

  useEffect(() => {
    if (searchState.requestCount) {
      //   send request after 2 seconds of stop typing
      const request = Axios.CancelToken.source();
      const ourRequest = async () => {
        try {
          const response = await Axios.post("/search", {
            searchTerm: searchState.searchTerm,
            cancelToken: request.token,
          });
          setSearchState((old) => ({
            ...old,
            results: response.data,
            show: "results",
          }));
        } catch (error) {
          setSearchState((old) => ({
            ...old,
            show: "results",
          }));
          console.log("Failed to search request");
        }
      };
      ourRequest();
      return () => request.cancel();
    }
  }, [searchState.requestCount]);

  // close search also on escape
  const pressEscape = (e) => {
    if (e.keyCode == 27) {
      dispatch({ type: "closeSearch" });
    }
  };
  useEffect(() => {
    document.addEventListener("keyup", pressEscape);
    return () => {
      document.removeEventListener("keyup", pressEscape);
    };
  }, []);
  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input
            autoFocus
            onChange={handleSearch}
            type="text"
            autoComplete="off"
            id="live-search-field"
            className="live-search-field"
            placeholder="What are you interested in?"
          />
          <span onClick={handleClose} className="close-live-search">
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          {/* Loader Div */}
          <div
            className={
              "circle-loader " +
              (searchState.show == "loading" ? "circle-loader--visible" : "")
            }
          ></div>
          <div
            className={
              "live-search-results " +
              (searchState.show == "results"
                ? "live-search-results--visible"
                : "")
            }
          >
            {searchState.results.length ? (
              <div className="list-group shadow-sm">
                <div className="list-group-item active">
                  <strong>Search Results</strong> ({searchState.results.length}{" "}
                  items found)
                </div>
                {searchState.results.map((post) => {
                  const date = new Date(post.createdDate);
                  const formattedDate = `${
                    date.getMonth() + 1
                  }/${date.getDay()}/${date.getFullYear()}`;
                  return (
                    <div key={post._id}>
                      <Link
                        onClick={() => dispatch({ type: "closeSearch" })}
                        key={post._id}
                        to={`/posts/${post._id}`}
                        className="list-group-item list-group-item-action"
                      >
                        <img className="avatar-tiny" src={post.author.avatar} />{" "}
                        <strong>{post.title}</strong>
                        <span className="text-muted small">
                          by {post.author.username} on {formattedDate}{" "}
                        </span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="alert alert-danger text-center shadow-sm">
                Sorry can not find results for this search
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;

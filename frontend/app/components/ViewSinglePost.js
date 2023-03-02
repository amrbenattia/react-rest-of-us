import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingDots from "./LoadingDots";
import Page from "./Page";

const ViewSinglePost = () => {
  const [post, setPost] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
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

    return () => request.cancel();
  }, []);

  if (isLoading) {
    return <LoadingDots />;
  }
  const date = new Date(post.createdDate);
  const formattedDate = `${
    date.getMonth() + 1
  }/${date.getDay()}/${date.getFullYear()}`;
  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <a href="#" className="text-primary mr-2" title="Edit">
            <i className="fas fa-edit"></i>
          </a>
          <a className="delete-post-button text-danger" title="Delete">
            <i className="fas fa-trash"></i>
          </a>
        </span>
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

      <div className="body-content">{post.body}</div>
    </Page>
  );
};

export default ViewSinglePost;

import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingDots from "./LoadingDots";

const ProfilePosts = ({ avatar }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { username } = useParams();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await Axios.get(`/profile/${username}/posts`);
        setPosts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log("Encounter an Error" + error);
      }
    };
    fetchPosts();
  }, []);

  if (isLoading) {
    return <LoadingDots />;
  }
  return (
    <div className="list-group">
      {posts.map((post) => {
        const date = new Date(post.createdDate);
        const formattedDate = `${
          date.getMonth() + 1
        }/${date.getDay()}/${date.getFullYear()}`;
        return (
          <Link
            key={post._id}
            to={`/posts/${post._id}`}
            className="list-group-item list-group-item-action"
          >
            <img className="avatar-tiny" src={post.author.avatar} />{" "}
            <strong>{post.title}</strong>{" "}
            <span className="text-muted small">on {formattedDate} </span>
          </Link>
        );
      })}
    </div>
  );
};

export default ProfilePosts;

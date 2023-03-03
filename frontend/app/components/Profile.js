import Axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dispatchContext from "../contexts/dispatchContext";
import stateContext from "../contexts/stateContext";
import NotFound from "./NotFound";
import Page from "./Page";
import ProfilePosts from "./ProfilePosts";

const Profile = () => {
  const state = useContext(stateContext);
  const dispatch = useContext(dispatchContext);
  const { username } = useParams();
  const [profileData, setProfileData] = useState({
    profileUsername: "...",
    profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
    isFollowing: false,
    counts: { postCount: "", followerCount: "", followingCount: "" },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.post(`/profile/${username}`, {
          token: state.user.token,
        });
        if (response.data) {
          setProfileData(response.data);
        } else {
        }
      } catch (error) {
        console.log("found an error" + error);
      }
    };

    fetchData();
  }, []);

  return (
    <Page title="Profile">
      <h2>
        <img className="avatar-small" src={profileData.profileAvatar} />{" "}
        {profileData.profileUsername}
        <button className="btn btn-primary btn-sm ml-2">
          Follow <i className="fas fa-user-plus"></i>
        </button>
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: 101
        </a>
        <a href="#" className="nav-item nav-link">
          Following: 40
        </a>
      </div>
      <ProfilePosts avatar={profileData.profileAvatar} />
    </Page>
  );
};

export default Profile;

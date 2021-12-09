import React from "react";
import { useHistory } from "react-router";
import slugify from "slugify";
import "./styles.css";

const ProfileListItem = (props) => {
  const { profile, clickProfile, deleteProfile } = props;
  const history = useHistory();

  const handleClickProfile = (profile) => {
    const slug = slugify(profile.characterName, { lower: true });

    clickProfile(profile);
    history.push(`/profile/${slug}`);
  };

  return (
    <div>
      <div
        className="profileListItem"
        onClick={() => handleClickProfile(profile)}
      >
        <h1>{profile.characterName} </h1>
        <div>
          <p>
            class : {profile.playerClass} , Level : {profile.characterLevel} ,
            server : {profile.server}
          </p>
          <p>{profile.bio}</p>
        </div>
      </div>
      <div className="postControls">
        <button onClick={() => deleteProfile(profile)}>Delete</button>
      </div>
    </div>
  );
};

export default ProfileListItem;

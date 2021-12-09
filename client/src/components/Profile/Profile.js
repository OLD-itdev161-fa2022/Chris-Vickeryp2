import React from "react";

const Profile = (props) => {
  const { profile } = props;
  return (
    <div>
      <h1>{profile.characterName} </h1>
      <div>
        <p>
          class : {profile.playerClass} , Level : {profile.characterLevel} ,
          server : {profile.server}
        </p>
        <p>{profile.bio}</p>
      </div>
    </div>
  );
};

export default Profile;

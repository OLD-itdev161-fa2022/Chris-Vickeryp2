import React from "react";
import ProfileListItem from "./ProfileListItem";

const ProfileList = (props) => {
  const { profiles, clickProfile, deleteProfile } = props;
  return profiles.map((profile) => (
    <ProfileListItem
      key={profile._id}
      profile={profile}
      clickProfile={clickProfile}
      deleteProfile={deleteProfile}
    />
  ));
};

export default ProfileList;

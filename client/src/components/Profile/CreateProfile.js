import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./styles.css";

const CreateProfile = ({ token, onProfileCreated }) => {
  let history = useHistory();
  const [profileData, setProfileData] = useState({
    characterName: "",
    characterLevel: "",
    playerClass: "",
    server: "",
    bio: "",
  });

  const { characterName, characterLevel, playerClass, server, bio } =
    profileData;

  const onChange = (e) => {
    const { name, value } = e.target;

    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const create = async () => {
    if (!characterLevel || !characterName || !playerClass || !server || !bio) {
      console.log("all feild must be filled");
    } else {
      const newProfile = {
        characterName: characterName,
        characterLevel: characterLevel,
        playerClass: playerClass,
        server: server,
        bio: bio,
      };

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        };
        //create the propfile
        const body = JSON.stringify(newProfile);
        const res = await axios.post(
          "http://localhost:5000/api/posts",
          body,
          config
        );

        onProfileCreated(res.data);
        history.push("/");
      } catch (error) {
        console.error(`error createing post : ${error.response.data}`);
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Please enter your new characters information</h2>
      <input
        name="characterName"
        type="text"
        placeholder="character name"
        value={characterName}
        onChange={(e) => onChange(e)}
      />
      <input
        name="characterLevel"
        type="text"
        placeholder="Character Level"
        value={characterLevel}
        onChange={(e) => onChange(e)}
      />
      <input
        name="playerClass"
        type="text"
        placeholder="class"
        value={playerClass}
        onChange={(e) => onChange(e)}
      />
      <input
        name="server"
        type="text"
        placeholder="server"
        value={server}
        onChange={(e) => onChange(e)}
      />
      <textarea
        name="bio"
        cols="40"
        rows="20"
        value={bio}
        onChange={(e) => onchange(e)}
      ></textarea>

      <button onClick={() => create()}>Submit</button>
    </div>
  );
};

export default CreateProfile;

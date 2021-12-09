import mongosse from "mongoose";

const ProfileSchema = new mongosse.Schema({
  user: {
    type: "ObjectId",
    ref: "User",
  },
  characterName: {
    type: String,
    required: true,
  },
  characterLevel: {
    type: String,
    required: true,
  },
  playerClass: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  server: {
    type: String,
    required: true,
  },
});

const Profile = mongosse.model("profile", ProfileSchema);

export default Profile;

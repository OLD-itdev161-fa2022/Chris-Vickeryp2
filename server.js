import express from "express";
import connectDatabase from "./config/db";
import { check, validationResult } from "express-validator";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";
import User from "./models/User";
import Profile from "./models/Profile";
import auth from "./middleware/auth";

// Initialize express application
const app = express();

// Connect database
connectDatabase();

// Configure Middleware
app.use(express.json({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// API endpoints
/**
 * @route GET /
 * @desc Test endpoint
 */
app.get("/", (req, res) =>
  res.send("http get request sent to root api endpoint")
);

app.get("/api/", (req, res) => res.send("http get request sent to api"));

/**
 * @route POST api/users
 * @desc Register user
 */
app.post(
  "/api/users",
  [
    check("name", "Please enter your name").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      const { name, email, password } = req.body;
      try {
        // Check if user exists
        let user = await User.findOne({ email: email });
        if (user) {
          return res
            .status(400)
            .json({ errors: [{ msg: "User already exists" }] });
        }

        // Create a new user
        user = new User({
          name: name,
          email: email,
          password: password,
        });

        // Encrypt the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save to the db and return
        await user.save();

        //get and turn a jwt token
        returnToken(user, res);
      } catch (error) {
        res.status(500).send("Server error");
      }
    }
  }
);
/**
 * @route Get api/auth
 * @desc authenticate user
 */
app.get("/api/auth", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send("unknown server error");
  }
});

/**
 * @route Post api/login
 * @dec login user
 */

app.post(
  "/api/login",
  [
    check("email", "please enter a valid email").isEmail(),
    check("password", "a password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      const { email, password } = req.body;

      try {
        // check if user exists
        let user = await User.findOne({ email: email });
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid email or password" }] });
        }

        //check password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid password" }] });
        }

        //gen and return jwt toeken

        returnToken(user, res);
      } catch (error) {
        res.status(500).send("server error");
      }
    }
  }
);
/**
 *
 * @route Post api/profile
 * @desc create a profile
 */

app.post(
  "/api/profile",
  auth,
  [
    check("characterName", "a name is required").not().isEmpty(),
    check(
      "characterLevel",
      "the level of your character is requried for matching reasons"
    )
      .not()
      .isEmpty(),
    check("server", "Your server is required for matching reasons")
      .not()
      .isEmpty(),
    check("playerClass", "You must list your class").not().isEmpty(),
    check(
      "bio",
      "If you do not enter a small biogorphay how will your roleplay partner know anything about you?"
    )
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      let thing;
      const { characterName, characterLevel, playerClass, bio, server } =
        req.body;

      try {
        const user = await User.findById(req.user.id);

        // make the profile
        thing = "gothere";
        const profile = new Profile({
          user: user.id,
          characterName: characterName,
          characterLevel: characterLevel,
          playerClass: playerClass,
          bio: bio,
          server: server,
        });
        thing = "gothere2";
        //save to the db return data
        await profile.save();
        thing = "gothere3";
        res.json(profile);
      } catch (error) {
        console.log(error);
        res.status(500).send("server error" + thing);
      }
    }
  }
);

/**
 * @route get api/profiles
 * @desc get profiles
 */

app.get("/api/profiles", auth, async (req, res) => {
  try {
    const profiles = await Profile.find().sort({});
    res.json(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).send("server error");
  }
});

/**
 * @route get/profiles/:id
 * @desc get post by id
 */

app.get("/api/profiles/:id", auth, async (req, res) => {
  try {
    let thing;
    const profile = await Profile.findById(req.params.id);

    // see if the post was really found
    if (!profile) {
      return res.status(404).json({ msg: "post not found" });
      thing = "no post";
    }
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error" + "   " + thing);
  }
});

/**
 * @route delete api/profiles/:id
 * @desc delete a profile
 */

app.delete("/api/profiles/:id", auth, async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ msg: "profile not found" });
    }

    // chekc fi the user made the profile

    if (profile.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await profile.remove();
    res.json({ msg: "post removed" });
  } catch (error) {
    console.error(error);
    res.status(500).send("server error");
  }
});

// return token method

const returnToken = (user, res) => {
  const payload = {
    user: {
      id: user.id,
    },
  };

  jwt.sign(
    payload,
    config.get("jwtSecret"),
    { expiresIn: "10hr" },
    (err, token) => {
      if (err) throw err;
      res.json({ token: token });
    }
  );
};

// Connection listener
const port = 5000;
app.listen(port, () => console.log(`Express server running on port ${port}`));

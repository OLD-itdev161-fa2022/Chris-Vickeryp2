import express from "express";
import connectDatabase from "./config/db";
import { check, validationResult } from "express-validator";
import cors from "cors";

// init express
const app = express();

//connect database
connectDatabase();

//config middleware
app.use(express.json({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

//api endpoints
/**
 * @route Get
 * @desc test end point
 */
app.get("/", (req, res) =>
  res.send("http get request send to root api endoint")
);

/**
 * @route Post api/user
 * @desc Register user
 */
app.post(
  "/api/users",
  [
    check("name", "Pls enter your name").not().isEmpty(),
    check("email", "Please enter a valid email adress").isEmail(),
    check(
      "password",
      "Please enter a password with 1 or more charcters"
    ).isLength({ min: 5 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      return res.send(req.body);
    }
  }
);

//lissenter
let port = 5000;
app.listen(port, () => console.log(`express running on port ${port}`));

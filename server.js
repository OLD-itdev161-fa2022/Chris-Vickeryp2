import express from "express";
import connectDatabase from "./config/db";

// init express
const app = express();

//connect database
connectDatabase();

//api endpoints
app.get("/", (req, res) =>
  res.send("http get request send to root api endoint")
);

//lissenter
let port = 3000;
app.listen(3000, () => console.log(`express running on port ${port}`));

const express = require("express");
const App = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 3000;
const URI = process.env.URI;
const userRouter = require("./Routes/user.route");
App.use("/user", userRouter);

App.get("/*", (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});
App.use(express.static("./build"));
App.use(express.urlencoded({ extended: true, limit: "50mb" }));
App.use(express.json({ limit: "50mb" }));
App.use(cors());

App.listen(port, () => {
  console.log("Server is running on port " + port);
});

mongoose.connect(URI, (err) => {
  if (err) {
    console.log("Mongoose did not connect");
  } else {
    console.log("mongoose connected successfully");
  }
});

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const auth_route = require("./routes/auth");
const likes_route = require("./routes/likes");
const post_route = require("./routes/post");
const user_route = require("./routes/user");
const comment_route = require("./routes/comment");

const cors = require("cors");
const Post = require("./models/post");
const axios = require("axios");
const User = require("./models/user");

// ! FOR TESTING ONLY
require("./cronjob");

const host = "0.0.0.0";
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("uploads"));

const dbURI =
  "mongodb+srv://admin:admin123@cluster0.4h1l4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(port, host, () => {
      console.log("Server is up and running on Port:", port);
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.get("/", async (req, res) => {
  res.send("server live!");
});

app.use("/auth", auth_route.router);
app.use("/likes", likes_route.router);
app.use("/posts", post_route.router);
app.use("/users", user_route.router);
app.use("/comment", comment_route.router);

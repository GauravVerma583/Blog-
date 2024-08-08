const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Post Schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model("Post", postSchema);

// Routes
app.get("/", async (req, res) => {
  try {
    const posts = await Post.find({});
    res.render("index", { posts: posts });
  } catch (err) {
    console.log(err);
  }
});

app.get("/new-post", (req, res) => {
  res.render("new-post");
});

app.post("/new-post", async (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  try {
    await newPost.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.get("/posts/:postId", async (req, res) => {
  const requestedPostId = req.params.postId;

  try {
    const post = await Post.findOne({ _id: requestedPostId });
    res.render("post", { post: post });
  } catch (err) {
    console.log(err);
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

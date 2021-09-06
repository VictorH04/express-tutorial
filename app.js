const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
});

const PORT = 3000;

const users = [
  {
    name: "Victor",
    age: 17,
  },
  {
    name: "Edvard",
    age: 17,
  },
  {
    name: "Jesper",
    age: 18,
  },
];

const posts = [
  {
    id: 1,
    title: "Pizza",
  },
  {
    id: 2,
    title: "Kebab",
  },
  {
    id: 3,
    title: "Mmmm",
  },
];

// Routing and query

app.get("/", (req, res) => {
  res.send({
    message: "Hello",
    user: {},
  });
});

app.get("/users/:name", (req, res) => {
  const { name } = req.params;
  const user = users.find((user) => user.name === name);
  user ? res.status(200).send(user) : res.status(404).send("Not found");
});

app.get("/users", (req, res) => {
  res.status(200).send(users);
});

app.get("/posts", (req, res) => {
  res.status(200).send(posts);
  // const {
  //     title
  // } = req.query;

  // if (title) {
  //     const post = posts.find((post) => post.title === title);
  //     post ? res.status(200).send(post) : res.status(404).send('Not found');
  //     console.log(req.query);
  // }
});

// POST requests
app.post("/", (req, res) => {
  console.log(req.body);
  const user = req.body;
  users.push(user);
  res.status(201).send(`Created user ${req.body.name}`);
});

function validateAuthToken(req, res, next) {
  console.log("Inside validate auth token");
  const { authorization } = req.headers;
  if (authorization && authorization === "123") {
    next();
  } else {
    res.status(403).send({ msg: "Forbidden. Incorrect Credentials" });
  }
}

app.post("/posts", validateAuthToken, (req, res) => {
  console.log(req.headers);
  const post = req.body;
  console.log(post);
  posts.push(post);
  res.status(201).send(post);
});

function validateCookie(req, res, next) {
  const { cookies } = req;
  if ("session_id" in cookies) {
    console.log("Session ID exists");
    if (cookies.session_id === "123456") {
      next();
    } else {
      res.status(403).send({ msg: "Not Authenticated" });
    }
  } else {
    res.status(403).send({ msg: "Not Authenticated" });
  }
  console.log(cookies);
  next();
}

app.get("/signin", (req, res) => {
  res.cookie("session_id", "123456");
  res.status(200).json({ msg: "Logged in" });
});

app.get("/protected", validateCookie, (req, res) => {
  res.status(200).json({ msg: "You are authorized" });
});

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});

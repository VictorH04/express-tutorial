const express = require("express");
const app = express();
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
const PORT = 3000;


const users = [{
        name: "Victor",
        age: 17
    },
    {
        name: "Edvard",
        age: 17
    },
    {
        name: "Jesper",
        age: 18
    },
];

const posts = [{
        id: 1,
        title: 'Pizza'
    },
    {
        id: 2,
        title: 'Kebab'
    },
    {
        id: 3,
        title: 'Mmmm'
    },
];

// Routing and query

app.get("/", (req, res) => {
    res.send({
        message: 'Hello',
        user: {}
    });
});

app.get("/users/:name", (req, res) => {
    const {
        name
    } = req.params;
    const user = users.find((user) => user.name === name);
    user ? res.status(200).send(user) : res.status(404).send("Not found");
})

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

app.post("/posts", (req, res) => {
    console.log(req.headers);
    const { authorization } = req.headers;
    if (authorization && authorization === '123') {
        const post = req.body;
        console.log(post);
        posts.push(post);
        res.status(201).send(post);
    } else {
        res.status(403).send("Forbidden");
    }
});



app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});
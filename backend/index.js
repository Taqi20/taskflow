const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectToDB = require('./db');

connectToDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(
    cors({
        origin: `${process.env.FRONTEND_URL}`,
        credentials: true
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/todolist", require("./routes/todoList"));
app.use("/todo", require("./routes/todo"));
// app.use("/edit", require("./routes/edit"));
// app.use("/deleteuser", require("./routes/deleteUser"));

app.listen(port, () => {
    console.log(`backend is up at port ${port}...`);
})
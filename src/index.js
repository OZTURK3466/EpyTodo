const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const pool = require("./config/db");
const authRoutes = require("./routes/auth/auth");
const userRoutes = require("./routes/user/user");
const todosRoutes = require("./routes/todos/todos");
const authenticateToken = require("./middleware/auth");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10;

app.use(bodyParser.json());

app.post("/register", authRoutes.register);
app.post("/login", authRoutes.login);

app.get("/user", authenticateToken, userRoutes.getUser);
app.get("/user/todos", authenticateToken, userRoutes.getUserTodos);
app.get("/users/:id_or_email", authenticateToken, userRoutes.getUserByIdOrEmail);
app.put("/users/:id", authenticateToken, userRoutes.updateUser);
app.delete("/users/:id", authenticateToken, userRoutes.deleteUser);

app.get("/todos", authenticateToken, todosRoutes.getTodos);
app.post("/todos", authenticateToken, todosRoutes.createTodo);
app.get("/todos/:id", authenticateToken, todosRoutes.getTodoById);
app.put("/todos/:id", authenticateToken, todosRoutes.updateTodo);
app.delete("/todos/:id", authenticateToken, todosRoutes.deleteTodo);

app.listen(port ,() => {
    console.log(`Example app listening at http://localhost:${port}`);
});
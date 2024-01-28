const express = require("express");
const cors = require("cors");
const knex = require("./lib/knex");

const PORT = process.env.PORT || 3333;
const HOSTNAME = process.env.HOSTNAME || "http://localhost";

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res, _next) => {
    res.send({ msg: "Server running!" });
});


/**
 * Route to get all tasks
 * @param {Object} req - Request object from Express.
 * @param {Object} res - Response object from Express.
 * @param {Function} _next - Middleware funtion from Express
 * @returns {JSON}
 */
app.get("/tasks", async (req, res, _next) => {
    var tasks = await knex.select("id", "name", "description").from("tasks");

    res.json({
        tasks: tasks
    });
    return _next();
});

/**
 * Route to create a new task
 * @param {Object} req - Request object from Express.
 * @param {Object} res - Response object from Express.
 * @param {Function} _next - Middleware funtion from Express
 * @returns {JSON}
 */
app.post("/tasks", async (req, res, _next) => {
    var data = req.body;

    if (!data.name || !data.description) {
        res.json({
            error: true,
            msg: "Some values are required!"
        });
        return;
    }

    knex("tasks").insert({
        name: data.name,
        description: data.description
    }).then(async () => {
        res.json({
            msg: "Task created successfully!"
        });
        return;
    })
});

/**
 * Route to delete a task by ID
 * @param {Object} req - Request object from Express.
 * @param {Object} res - Response object from Express.
 * @param {Function} _next - Middleware funtion from Express
 * @returns {JSON}
 */
app.delete("/tasks/:id", async (req, res, _next) => {
    var taskId = req.params.id;
  
    if (!taskId) {
        res.json({
            error: true,
            msg: "Task ID is required!",
        });
        return;
    }
  
    knex("tasks")
        .where("id", taskId)
        .del()
        .then(async (deletedCount) => {
        if (deletedCount > 0) {
            res.json({
                msg: `Task with ID ${taskId} deleted successfully!`,
            });
        } else {
            res.json({
                error: true,
                msg: `Task with ID ${taskId} not found or could not be deleted.`,
            });
        }
        return;
    });
});

app.use((_req, res) => {
    res.status(404);
});


app.listen(PORT, () => {
    console.log(`Server running at ${HOSTNAME}:${PORT}`);
});
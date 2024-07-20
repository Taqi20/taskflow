const express = require("express");
const { body, param, validationResult } = require("express-validator");

const tokenAuth = require("../middlewares/auth");
const { todolists } = require("../models/TodoList");
const { todo } = require("../models/Todo");
const mongoose = require("mongoose");
const { isValidObjectId } = mongoose;

const router = express.Router();

//post new todolist
router.post("/new", tokenAuth, async (req, res) => {
    try {
        const newList = await todolists.create({
            user: req.user.id,
            title: req.body.title
        });
        res.status(200).json(newList);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

//get the lists of user
router.get("/lists", tokenAuth, async (req, res) => {
    try {
        const todoLists = await todolists.find({
            user: req.user.id,
            isDefaultTasksList: false
        });
        if (todoLists === null) {
            res.status(500).json({ message: "Internal Server Error" });
        }
        res.json(todoLists);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})

//get all the info of default list
router.get("/tasks", tokenAuth, async (req, res) => {
    try {
        const defaultList = await todolists.findOne({
            isDefaultTasksList: true,
            user: req.user.id
        });
        if (!defaultList) {
            return res.status(404).json({ message: "List not Found" });
        }

        res.json(defaultList);
    } catch (error) {
        res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
    }
})

//get all info of list
router.get("/:id", [ param("id").exists().withMessage("Id parameter is missing") ], tokenAuth, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Bad Request" });
    }

    try {
        const todoList = await todolists.findById(req.param.id);
        if (todoList === null) {
            return res.status(404).json({ message: "List not Found" });
        }
        if (todoList.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }
        res.json(todoList);
    } catch (error) {
        res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
    }
})

//to delete a list 
router.delete("/delete/:id", tokenAuth, async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing 'todolist' parameter" });
    }
    const listId = req.params.id;

    if (!isValidObjectId(listId)) {
        return res.status(400).json({ error: "Invalid listId" });
    }
    try {
        //concept of tranction is in action
        const session = await mongoose.startSession();
        session.startTransaction();

        const list = await todolists.findById(listId);

        if (!list) {
            return res.status(404).json({ error: "List not found" });
        }
        if (list.isDefaultTasksList) {
            return res.status(403).json({ error: "Forbidden, list is default" });
        }

        if (list.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await todo.deleteMany({ _id: { $in: list.todos } });

        const deletedList = await todolists.findByIdAndDelete(listId);

        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ message: "Deleted Successfully.", deletedList });

    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: error.message, message: "Internal Server Error" });
    }
})

//update the list title 
router.patch("/updatetitle/:id", [ param("id").exists().withMessage("Id is missing"),
body("title").exists().withMessage("No Title to update is added.") ], tokenAuth, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json({ message: "Missing Parameter(s).", errors: errors.array() });
    }

    const listId = req.params.id;
    const newTitle = req.body.title;

    if (!isValidObjectId(listId)) {
        return res.status(400).json({ error: "Invalid listId" });
    }

    try {
        const list = await todolists.findById(listId);
        if (!list) {
            return res.status(404).json({ error: "List not found" });
        }
        if (list.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        list.title = newTitle;
        await list.save();

        res
            .status(200)
            .json({ message: "Title Updated Successfully.", newTitle });
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: error.message, message: "Internal Server Error" });
    }
})

module.exports = router;
const express = require("express");
const tokenAuth = require("../middlewares/tokenAuth");
const mongoose = require("mongoose");
const User = require("../models/User");
const { todolists } = require("../models/TodoList");
const { todo } = require("../models/Todo");

const router = express.Router();

router.delete("/", tokenAuth, async (req, res) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        const userLists = await todolists.find({
            user: req.user.id
        })
        const userTodos = todo.find({
            uers: req.user.id
        })

        await todo.deleteMany({ _id: { $in: userTodos } });
        await todolists.deleteMany({ _id: { $in: userLists } });
        await User.findByIdAndDelete(req.user.id);

        await session.commitTransaction();
        session.endSession();

        res
            .status(200)
            .json({ message: "Account Deleted Successfully.", success: true });

    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({
                error: error.message,
                message: "Internal Server Error",
                success: false,
            });
    }
});

module.exports = router;

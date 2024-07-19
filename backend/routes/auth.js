const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const { todolists } = require("../models/TodoList");
const tokenAuth = require("../middlewares/auth");

const assignToken = (user) => {
    const data = {
        user: {
            id: user.id,
        }
    };

    const authtoken = jwt.sign(data, process.env.AUTH_SECRET_KEY, {
        expiresIn: "10h",
    });
    return authtoken;
}

router.post('/createuser',
    [
        body("name").isLength({ min: 3 }),
        body("email").isEmail().withMessage("Please enter a valid email"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long")
            .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&!])[A-Za-z\d@#$%^&!]*$/)
            .withMessage(
                "Password must contain at least one letter, one numbers, and one special character"
            ),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //Storing password using bcryptjs. Generatind Salt first and then hashing the password+salt 
        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.password, salt);

        try {
            const user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPassword
            })

            const defaultTodoList = new todolists({
                title: `Default Task List for user ${user._id}`,
                user: user._id, // Link the list to the new user
                isDefaultTasksList: true
            })

            await defaultTodoList.save();
            const authToken = assignToken(user);
            const userResponse = {
                _id: user._id,
                name: user.name,
                email: user.email,
            };

            res.cookie("authToken", authToken, {
                expires: new Date(Date.now() + 10 * 60 * 60 * 1000), //10 hrs * 60 mins * 60 sec * 1000 milisec
                httpOnly: true,
            }).json({
                success: true, user: userResponse
            });

        } catch (error) {
            if (error.name === "MongoServerError" && error.code === 11000) {
                // Mongoose duplicate key error (code 11000) for unique constraint violation
                return res.status(400).json({
                    message: "Email already exists. Please enter a different email.",
                    error: error.message,
                    success: false,
                });
            } else {
                console.error(error);
                res
                    .status(500)
                    .json({
                        message: "Internal server error",
                        error: error.message,
                        success: false,
                    });
            }
        }
    }
)

router.post("/login", [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").exists(),
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(404).json({ error: errors.array(), success: false });
        }

        try {
            const user = await User.findOne({
                email: req.body.email
            });
            if (user) {
                try {
                    const passwordMatch = await bcrypt.compare(
                        req.body.password,
                        user.password
                    );


                    if (passwordMatch) {
                        const authToken = assignToken(user);
                        const userResponse = {
                            _id: user._id,
                            name: user.name,
                            email: user.email
                        };
                        return res.cookie("authToken", authToken, {
                            expires: new Date(Date.now() + 10 * 60 * 60 * 1000),
                            httpOnly: true
                        }).json({
                            success: true, user: userResponse
                        })
                    } else {
                        return res.status(500).json({
                            msg: "please enter valid credentials",
                            success: false
                        })
                    }
                } catch (error) {
                    res
                        .status(401)
                        .json({
                            message: "Please Enter Valid Credentials.",
                            success: false,
                        });
                }
            }
            else {
                res
                    .status(401)
                    .json({ message: "Please Enter Valid Credentials.", success: false });
            }
        } catch (error) {
            res
                .status(500)
                .json({ message: "Internal Server Error.", success: false });
        }
    }
);

router.get("/logout", tokenAuth, (req, res) => {
    try {
        res.clearCookie("authToken");
        res.status(200).json({
            msg: "logged out successfully", success: true
        });
    } catch (error) {
        res.status(500).json({
            msg: "Internal servor error", success: false
        });
    }
});

module.exports = router;
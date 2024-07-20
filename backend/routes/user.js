const express = require("express");
const User = require('../models/User');
const router = express.Router();

const tokenAuth = require('../middlewares/auth');

router.get('/', tokenAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message, success: false });
    }
})

module.exports = router;
const jwt = require("jsonwebtoken");

const tokenAuth = (req, res, next) => {
    const token = req.cookies.authToken;

    if (token) {
        jwt.verify(token, process.env.AUTH_SECRET_KEY, (err, data) => {
            if (err) {
                return res.sendStatus(403).json({
                    msg: "Authorization refused"
                });
            } else {
                req.user = data.user;
                next();
            }
        })
    } else {
        res.sendStatus(786).json({
            msg: "invalid authentication"
        })
    }
}

module.exports = tokenAuth;
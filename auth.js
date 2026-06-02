const jwt = require("jsonwebtoken");

const JWT_SECRET = "abajdnjndindknsnkfdn";

function auth(req, res, next) {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        req.USER_ID = decoded.userId;

        next();
    } catch (err) {
        console.log("Auth Error:", err.message);

        return res.status(401).json({
            message: "no access"
        });
    }
}

module.exports = {
    auth:auth 
};
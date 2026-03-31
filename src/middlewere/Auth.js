const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("User authentication error:", error.message);
        res.status(500).json({ message: error.message });
    }
}

module.exports = auth;
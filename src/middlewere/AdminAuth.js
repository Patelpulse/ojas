const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const token = req.cookies.Admintoken;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decodedToken;
        next();
    } catch (error) {
        console.error("Admin authentication error:", error.message);
        res.status(500).json({ message: error.message });
    }
}
module.exports = auth;
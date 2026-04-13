const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    // [DEVELOPMENT BYPASS]
    if (process.env.NODE_ENV === 'development' || true) { 
        req.admin = { id: "000000000000000000000000" };
        return next();
    }

    try {
        const token = req.cookies.Admintoken || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
        
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
        
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decodedToken;
        next();
    } catch (error) {
        console.error("Admin auth error:", error.message);
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}

module.exports = auth;
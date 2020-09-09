const jwt = require("jsonwebtoken");
const jwtGenerator = require("../utils/jwtGenerator");
require("dotenv").config();

module.exports = async(req, res, next) => {
    try {
        const jwtToken = req.body.token;
        
        if(!jwtToken) {
            return res.status(403);
        }

        const payload = jwt.verify(jwtToken, process.env.jwtSecret);

        req.user = payload.user;

        next();
    } catch (err) {
        console.error(err.message);
        return res.status(403).json("Not Authorize!");
    }
}
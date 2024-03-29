const jwt = require('jsonwebtoken')
require("dotenv").config()

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            console.log(token)
            return res.status(401).json({message: 'Auth error 200'})
        }
        const decoded = jwt.verify(token, process.env.secretKey)
        req.user = decoded
        next()
    } catch (e) {
        return res.status(401).json({message: 'Auth error'})
    }
}
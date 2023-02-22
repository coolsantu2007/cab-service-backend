const jwt = require('jsonwebtoken')
const Helper = require('../configuration/helper');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET

module.exports = {
  verifyToken: (req, res, next) => {
    const { authorization } = req.headers

    if (authorization) {
      jwt.verify(authorization, JWT_SECRET, (error, decoded) => {
        if (error) {
          return Helper.response(res, 401, "Invalid token");
        } else {
          next();
        }
      })
    } else {
      return Helper.response(res, 401, "Access denied! Unauthorized user");
    }
  }
}
const jwt = require('jsonwebtoken')
const Helper = require('../configuration/helper');
require('dotenv').config();
const adminUserModel = require('../model/adminUserModel');
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
  },

  verifyAdminToken: (req, res, next) => {
    const {authorization} = req.headers

    if (!authorization) {
        return Helper.response(res, 401, "you must be logged in");
    }
    const token = authorization

    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            return Helper.response(res, 401, "you must be logged in");
        }
        const {_id} = payload
        adminUserModel.findById(_id).lean().then(admindata => {
            if (admindata === null) {
                return Helper.response(res, 401, "Token is invalid");
            }
            //if(token == userdata.JWT_Token){
            if (admindata.JWT_Token.includes(token)) {
                admindata.JWT_Token = [token];
                req.admin = admindata
                next()
            } else {
                return Helper.response(res, 401, "Token is invalid");
            }
        })

    })
}
}
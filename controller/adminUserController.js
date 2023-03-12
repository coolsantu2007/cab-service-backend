const adminUserModel = require('../model/adminUserModel');
const Helper = require('../configuration/helper');
const { validationResult } = require("express-validator");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;
const bcrypt = require('bcryptjs');
const checkValidations = require('../middleware/validation');

module.exports = {
    createAdminUser: async (req, res) => {
        try {
            const { user_name, user_mobile, user_email, password } = req.body

            const checkMobile = await adminUserModel.findOne({ Mobile: user_mobile })
            const checkEmail = await adminUserModel.findOne({ Email: user_email })
            if (checkMobile) {
                return Helper.response(res, 200, "Error", "Mobile already exists");
            } else if (checkEmail) {
                if (checkEmail.Email !== "" && checkEmail.Email == user_email) {
                    return Helper.response(res, 200, "Error", "Email already exists");
                }
            } else {
                const userData = new adminUserModel({
                    Name: user_name,
                    Mobile: user_mobile,
                    Email: user_email,
                    Password: password
                })
                userData.save()

                if (userData) {
                    return Helper.response(res, 200, "Success", "Admin user added successfully");
                }
            }
        } catch (error) {
            console.log(error)
            return Helper.response(res, 500, error.message);
        }
    },

    adminLogin: async (req, res) => {
        try {
            const { email, password } = req.body;

            let validationStatus = {}
            //check validation for check blank
            validationStatus = await checkValidations.checkBlank(email)
            if (validationStatus && validationStatus.error) {
                return res.status(400).send({ status: "error", message: validationStatus.errorMsg, fieldname: "email" })
            }

            validationStatus = await checkValidations.checkBlank(password)
            if (validationStatus && validationStatus.error) {
                return res.status(400).send({ status: "error", message: validationStatus.errorMsg, fieldname: "password" })
            }

            const errors = validationResult(req.body);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    message: 'Parameter missing.', code: 422, errors: errors.array()
                })
            }

            adminUserModel.findOne({
                Email: email
            }).then(savedUser => {
                if (!savedUser) {
                    return Helper.response(res, 422, 'error', "Invalid Email or password.");
                }
                bcrypt.compare(password, savedUser.Password)
                    .then(doMatch => {
                        if (doMatch) {
                            const token = jwt.sign({ _id: savedUser._id }, SECRET_KEY, { expiresIn: "24h" })
                            adminUserModel.findOneAndUpdate({ _id: savedUser._id }, { $push: { JWT_Token: token } }, { new: true }).exec(function (err, savedAdmin) {
                                if (err) {
                                    return Helper.response(res, 422, 'error', "Something went wrong.");
                                }
                                const { _id, Name, Email } = savedAdmin

                                return res.status(200).json({ code: 200, status: 'success', message: "Login Successful.", admindata: { _id, Name, Email, token } })
                            })
                        } else {
                            return Helper.response(res, 422, "Invalid Email or password.");
                        }
                    })
                    .catch(err => {
                        return Helper.response(res, 500, "Server error.")
                    })
            })
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },

    adminLogout: async  (req, res) =>{
        try {
            var {_id} = req.admin;
            const {authorization} = req.headers;

            var token = authorization;
            adminUserModel.findOneAndUpdate({_id: new mongoose.Types.ObjectId(_id)}, {$pull: {JWT_Token: token}}, {new: true}).exec(function (err, userResult) {
              if (err) {
                return Helper.response(res, 422, "Something went wrong.")
              } else {
                return Helper.response(res, 200, "Logout successfully.")
              }
            });
          } catch (error) {
            console.log(error)
            return Helper.response(res, 500, "Server error.")
          }
    },

    resetAdminPassword: async (req, res) =>{
        try {
            const { user_id, old_password, new_password } = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return Helper.response(res, 422, errors.array()[0].msg);
            }

            const user = await adminUserModel.findById(user_id);
            const matched = await user.comparePassword(new_password);
            const oldMatched = await user.comparePassword(old_password);
            if (matched) {
                return Helper.response(res, 400, "The new password must be different from the old one!")
            } else if (oldMatched) {
                user.Password = new_password;
                await user.save();
            } else {
                return Helper.response(res, 400, "Can not change the password due to bad request!")
            }
            return Helper.response(res, 200, "Password changed successfully!");
        } catch (error) {
            return Helper.response(res, 500, "Server error.")
        }
    }
}
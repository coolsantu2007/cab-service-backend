const adminUserModel = require('../model/adminUserModel');
const Helper = require('../configuration/helper');
const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');

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
                            adminUserModel.findOneAndUpdate({ _id: savedUser._id }, { new: true }).exec(function (err, savedAdmin) {
                                if (err) {
                                    return Helper.response(res, 422, 'error', "Something went wrong.");
                                }
                                const { _id, Name, Email } = savedAdmin

                                return res.status(200).json({ code: 200, status: 'success', message: "Login Successful.", admindata: { _id, Name, Email } })
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
}
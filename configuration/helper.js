const helper = {};
var path = require('path');
var _ = require('lodash');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

helper.generate_jwt = (userId) => {
  var token = jwt.sign({ id: userId }, SECRET_KEY, {
    expiresIn: '30d'
  });
  return token;
};

helper.response = function (response, status_code, status_name, message, data) {
	var ret = {
		code: status_code,
    status: status_name,
		message: message,
	};
	if (data) {
		Object.assign(ret, data);
	}
	response.status(status_code).json(ret);
};

helper.generateRandNo = () => {
	let num = Math.floor(100000 + Math.random() * 900000)
	return num; //6 digit random number
};

module.exports = helper;
'use strict'
const md5 = require('md5');

exports.encript = (password) => {
	return md5(password + global.SALT_KEY)
}
const Users = require("../../models/usernew.js");

async function find(filter, projection, options) {
	return Users.find(filter, projection, options);
}

module.exports = find;

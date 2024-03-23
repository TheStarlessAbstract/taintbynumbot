const BaseCommand = require("../classes/base-command");

class BotCommand extends BaseCommand {
	constructor(getCommand, versions) {
		super(getCommand, versions);
		this.users = {};
	}

	getUsers() {
		return this.users;
	}

	getUser(channelId) {
		return this.users[channelId];
	}

	// getTimer() {
	// 	return this.timer;
	// }

	setUsers(users) {
		this.users = users;
	}

	addUser(channelId, user) {
		this.users[channelId] = user;
	}

	// setTimer(timer) {
	// 	if (timer instanceof Date) {
	// 		this.timer = timer;
	// 	} else if (typeof timer == "number") {
	// 		this.timer = new Date(timer);
	// 	}
	// }
}

module.exports = BotCommand;

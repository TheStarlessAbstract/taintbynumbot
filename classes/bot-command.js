const BaseCommand = require("../classes/base-command");

class BotCommand extends BaseCommand {
	constructor(getCommand, versions, users) {
		super(getCommand, versions);
		this.users = users;
	}

	getUsers() {
		return this.users;
	}

	// getTimer() {
	// 	return this.timer;
	// }

	setUsers(users) {
		this.users = users;
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

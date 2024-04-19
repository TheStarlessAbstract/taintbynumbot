const BaseCommand = require("./base-command.js");

class BotCommand extends BaseCommand {
	constructor(getCommand) {
		super(getCommand);
		this.timer = new Date(0);
	}

	getTimer() {
		return this.timer;
	}

	setTimer(timer) {
		if (timer instanceof Date) {
			this.timer = timer;
		} else if (typeof timer == "number") {
			this.timer = new Date(timer);
		}
	}
}

module.exports = BotCommand;

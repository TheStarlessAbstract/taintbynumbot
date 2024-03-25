const BaseCommand = require("../classes/base-command.js");

class BotCommand extends BaseCommand {
	constructor(getCommand) {
		super(getCommand);
	}

	// getTimer() {
	// 	return this.timer;
	// }

	// setTimer(timer) {
	// 	if (timer instanceof Date) {
	// 		this.timer = timer;
	// 	} else if (typeof timer == "number") {
	// 		this.timer = new Date(timer);
	// 	}
	// }
}

module.exports = BotCommand;

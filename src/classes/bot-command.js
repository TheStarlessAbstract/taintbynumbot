const BaseCommand = require("../../classes/base-command.js");

class BotCommand extends BaseCommand {
	constructor(getCommand, cooldown) {
		super(getCommand);
		this.cooldown = cooldown;
		this.timer = new Date(0);
	}

	getCooldown() {
		return this.cooldown;
	}

	getTimer() {
		return this.timer;
	}

	setCooldown(cooldown) {
		this.cooldown = cooldown;
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

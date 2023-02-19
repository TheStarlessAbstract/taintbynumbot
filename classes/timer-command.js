const BaseCommand = require("../classes/base-command");

class TimerCommand extends BaseCommand {
	constructor(getCommand, versions, cooldown) {
		super(getCommand, versions);
		this.COOLDOWN = cooldown;
		this.timer = 0;
	}

	getCooldown() {
		return this.COOLDOWN;
	}

	getTimer() {
		return this.timer;
	}

	setCooldown(cooldown) {
		this.COOLDOWN = cooldown;
	}

	setTimer(timer) {
		if (timer instanceof Date) {
			this.timer = timer;
		} else if (typeof timer == "number") {
			this.timer = new Date(timer);
		}
	}
}

module.exports = TimerCommand;

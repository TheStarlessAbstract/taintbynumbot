class BaseCommand {
	constructor(command, versions) {
		this.command = command;
		this.versions = versions;
	}

	getCommand() {
		return this.command;
	}

	getVersions() {
		return this.versions;
	}

	setVersionActive(element) {
		if (typeof element == "number" && this.versions[element]) {
			this.versions[element].active = !this.versions[element].active;
		}
	}

	getVersionActivity(element) {
		return this.versions[element].active;
	}
}

module.exports = BaseCommand;

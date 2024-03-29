class BaseCommand {
	constructor(getCommand, versions) {
		this.getCommand = getCommand;
		this.versions = versions;
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

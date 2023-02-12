class Helper {
	constructor() {}

	isValuePresentAndString(value) {
		return value != undefined && typeof value === "string" && value != "";
	}

	isValuePresentAndNumber(value) {
		return value != undefined && typeof value === "number" && value != "";
	}

	isVersionActive(versionPack, index) {
		if (versionPack != undefined && versionPack.length > 0) {
			return versionPack[index]?.active ?? false;
		}
		return false;
	}

	isValidModeratorOrStreamer(config) {
		return config.isBroadcaster || config.isModUp;
	}

	getCommandArgumentKey(config, index) {
		if (this.isValuePresentAndString(config.argument)) {
			let splitData = config.argument.split(/\s(.+)/);
			if (index == 0) {
				return splitData[index];
			} else if (splitData[index] != undefined) {
				return splitData[index];
			}
		}
		return "";
	}
}

module.exports = Helper;

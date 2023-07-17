class Helper {
	constructor() {}

	isTest() {
		return process.env.JEST_WORKER_ID != undefined;
	}

	isValuePresentAndString(value) {
		return value != undefined && typeof value === "string" && value != "";
	}

	isValuePresentAndNumber(value) {
		return value != undefined && typeof value === "number";
	}

	isStreamer(userInfo) {
		return userInfo.isBroadcaster;
	}

	isValidModeratorOrStreamer(userInfo) {
		return userInfo.isBroadcaster || userInfo.isMod;
	}

	isVersionActive(array, index) {
		if (array != undefined && array.length > 0) {
			return array[index]?.active ?? false;
		}
		return false;
	}

	isCooldownPassed(currentTime, lastTimeSet, currentCooldown) {
		if (
			currentTime instanceof Date &&
			lastTimeSet instanceof Date &&
			this.isValuePresentAndNumber(currentCooldown) &&
			currentCooldown >= 0
		) {
			return currentTime - lastTimeSet > currentCooldown;
		}

		return "";
	}

	getCommandArgumentKey(argument, index) {
		if (this.isValuePresentAndString(argument)) {
			let splitData = argument.split(/\s(.+)/);

			if (this.isValuePresentAndString(splitData[index])) {
				if (!isNaN(splitData[index])) {
					return Number(splitData[index]);
				}
				return splitData[index];
			} else if (this.isValuePresentAndNumber(splitData[index])) {
				return splitData[index];
			}
		} else if (argument == undefined) {
			return null;
		}

		return "";
	}

	getRandomisedAudioFileUrl(array) {
		if (array != undefined && array.length > 0) {
			let index = this.getRandomBetweenExclusiveMax(0, array.length);
			let value = array[index]?.url ?? "";

			if (!value.startsWith("http") && value != "") {
				value = "";
			}
			return value;
		}
		return "";
	}

	getRandomBetweenExclusiveMax(min, max) {
		if (
			this.isValuePresentAndNumber(min) &&
			this.isValuePresentAndNumber(max) &&
			min < max
		) {
			return Math.floor(Math.random() * (max - min)) + min;
		}
		return "";
	}

	getRandomBetweenInclusiveMax(min, max) {
		if (
			this.isValuePresentAndNumber(min) &&
			this.isValuePresentAndNumber(max) &&
			min <= max
		) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
		return "";
	}

	getNextIndex(array) {
		let index = Math.max.apply(
			Math,
			array.map(function (o) {
				return o.index;
			})
		);
		return index + 1;
	}

	shuffle(array) {
		let m = array.length,
			t,
			i;

		while (m) {
			i = Math.floor(Math.random() * m--);

			t = array[m];
			array[m] = array[i];
			array[i] = t;
		}

		return array;
	}

	startsWithCaseInsensitive(string, subString) {
		let stringLowercase = string.toLowerCase();
		let subStringLowercase = subString.toLowerCase();

		return stringLowercase.startsWith(subStringLowercase);
	}
}

module.exports = Helper;

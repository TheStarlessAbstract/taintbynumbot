const CommandNew = require("../models/commandnew");

class Helper {
	constructor() {}

	sleep = require("util").promisify(setTimeout);

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

	isStreamer(config) {
		return config.isBroadcaster;
	}

	isTest() {
		return process.env.JEST_WORKER_ID != undefined;
	}

	isValidModeratorOrStreamer(userInfo) {
		return userInfo.isBroadcaster || userInfo.isMod;
	}

	isValuePresentAndNumber(value) {
		return value != undefined && typeof value === "number";
	}

	isValuePresentAndString(value) {
		return value != undefined && typeof value === "string" && value != "";
	}

	isVersionActive(array, index) {
		if (array != undefined && array.length > 0) {
			return array[index]?.active ?? false;
		}
		return false;
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

	getNextIndex(array) {
		if (Array.isArray(array) && array.length > 0) {
			let index = Math.max.apply(
				Math,
				array.map(function (o) {
					return o.index;
				})
			);
			return index + 1;
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

	shuffle(array) {
		if (Array.isArray(array) && array.length > 0) {
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
		return "";
	}

	startsWithCaseInsensitive(string, subString) {
		let stringLowercase = string.toLowerCase();
		let subStringLowercase = subString.toLowerCase();

		return stringLowercase.startsWith(subStringLowercase);
	}

	getOutput(user, prop) {
		let output = "";

		if (!user.output.get(prop).active) return null;

		output = user.output.get(prop).message;

		return output;
	}

	async getCommandUsers(name) {
		let users = {};

		let commandUsers = await CommandNew.find({ name: name });

		for (let i = 0; i < commandUsers.length; i++) {
			users[commandUsers[i].streamerId] = { output: commandUsers[i].output };
		}

		return users;
	}

	getUserIds(users) {
		let userIds = [];

		for (let user of users) {
			userIds.push(user.twitchId);
		}

		return userIds;
	}

	processOutputString(outputString, map) {
		const regex = /\{[^}]*\}/g;
		const keysInOutputString = outputString.match(regex);
		if (!keysInOutputString) return outputString;

		const uniqueKeysInOutputString = [...new Set(keysInOutputString)];
		const cleanedArrayOfKeys = removeFirstAndLastCharacterStringArray(
			uniqueKeysInOutputString
		);

		for (let i = 0; i < cleanedArrayOfKeys.length; i++) {
			outputString = outputString.replaceAll(
				`{${cleanedArrayOfKeys[i]}}`,
				map.get(cleanedArrayOfKeys[i])
			);
		}

		return outputString;
	}

	removeFirstAndLastCharacterStringArray(arrayOfStrings) {
		return arrayOfStrings.map((string) =>
			string.substring(1, string.length - 1)
		);
	}

	getCommandConfigMap(config) {
		const map = new Map([
			["displayName", ""],
			["channelId", ""],
			["isBroadcaster", ""],
		]);

		for (const key of map.keys()) {
			map.set(key, config[key]);
		}

		return map;
	}
}

module.exports = Helper;

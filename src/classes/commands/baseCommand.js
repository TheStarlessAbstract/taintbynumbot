const { isValueNumber, isNonEmptyString } = require("../../utils/valueChecks");
const commandActions = require("../../config/commandActions");
const actionTypes = commandActions();

class BaseCommand {
	constructor(channelId, name, { type, output, versions }) {
		this.channelId = channelId;
		this.name = name;
		this.type = type;
		this.actions = {};
		this.versions = versions;
		this.output = output;
	}

	getChannelId() {
		return this.channelId;
	}

	getName() {
		return this.name;
	}

	setName(name) {
		this.name = name;
	}

	getType() {
		return this.type;
	}

	getOutput(key) {
		const string = this.output.get(key);
		if (!string || !string.active || typeof string.message !== "string")
			return undefined;
		return string.message;
	}

	setOutput(key, value) {
		this.output.set(key, value);
	}

	deleteOutput(key) {
		this.output.delete(key);
	}

	getVersion(key) {
		return this.versions.get(key);
	}

	setVersion(key, value) {
		this.versions.set(key, value);
	}

	deleteVersion(key) {
		this.versions.delete(key);
	}

	getVersionAction(versionKey) {
		if (!this.versions.has(versionKey)) return;
		if (!this.actions?.[versionKey]) this.addVersionAction(versionKey);

		return this.actions[versionKey];
	}

	addVersionAction(versionKey) {
		this.actions[versionKey] = actionTypes[this.type][versionKey].bind(this);
	}

	getOutputString(outputKey, stringMap) {
		const outputMessage = this.getOutput(outputKey);
		if (!outputMessage) return undefined;
		return this.processOutputString(outputMessage, stringMap);
	}

	processOutputString(message, map) {
		const regex = /\{([^}]+)\}/g;
		if (!regex.test(message)) return message;
		const updatedMessage = message.replace(regex, (match) =>
			map.has(match.slice(1, -1)) ? map.get(match.slice(1, -1)) : match
		);
		return updatedMessage;
	}

	getCommandVersion(config) {
		let hasArgument = false;
		let isNumber = false;
		let argument = config.argument;
		if (argument) {
			hasArgument = true;
			isNumber = isValueNumber(argument);
		}

		for (let [key, value] of this.versions) {
			if (!value.active) continue;
			if (
				!value.isArgumentOptional &&
				(value.hasArgument !== hasArgument ||
					value.isArgumentNumber !== isNumber)
			)
				continue;

			if (
				value.isArgumentOptional &&
				hasArgument &&
				value.isArgumentNumber &&
				!isNumber
			)
				continue;

			return { versionKey: key, version: value };
		}
		return { versionKey: null, version: null };
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
}

module.exports = BaseCommand;

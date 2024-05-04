const { isValueNumber, isNonEmptyString } = require("../../utils/valueChecks");

class BaseCommand {
	constructor(channelId, name, { type, output, versions }) {
		this.channelId = channelId;
		this.name = name;
		this.type = type;
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
		return this.output.get(key);
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

	getAction() {
		return this.action;
	}

	getProcessedOutputString(output, variableMap) {
		const message = output.message;
		const processedMessage = this.processOutputString(message, variableMap);

		return processedMessage;
	}

	processOutputString(outputString, map) {
		if (
			typeof outputString !== "string" ||
			!(map instanceof Map) ||
			!outputString
		)
			return;

		const regex = /\{([^}]+)\}/g;
		if (!regex.test(outputString)) return outputString;

		const updatedString = outputString.replace(regex, (match) =>
			map.has(match.slice(1, -1)) ? map.get(match.slice(1, -1)) : match
		);

		return updatedString;
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
		return null;
	}

	getArgumentParams(argument) {
		if (!isNonEmptyString(argument)) return;
		const splitArgs = argument.split(/\s(.+)/);
		const parmas = {
			a: "",
			b: "",
		};

		for (let i = 0; i < splitArgs.length; i++) {
			if (isValueNumber(splitArgs[i])) splitArgs[i] = Number(splitArgs[i]);
		}

		parmas.a = splitArgs[0];
		params.b = splitArgs[1] || undefined;

		return parmas;
	}
}

module.exports = BaseCommand;

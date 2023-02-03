const BaseCommand = require("../classes/base-command");

const Tinder = require("../models/tinder");

let commandResponse = () => {
	return {
		response: async (config) => {
			let result = [];

			if (config.isModUp && config.argument) {
				config.argument = config.argument.split(" ");
				let index = config.argument[0];
				let user = config.argument[1];

				if (isNaN(index) || !user.startsWith("@")) {
					result.push([
						"To user this command, !edittinderauthor 1 @thestarlessabstract",
					]);
				} else {
					user = user.substring(1);
					let quote = await Tinder.findOne({ index: index });

					if (quote) {
						quote.user = user;
						quote.save();
						result.push(["Tinder bio updated"]);
					} else {
						result.push(["No Tinder bio found for that number"]);
					}
				}
			} else if (!config.isModUp) {
				result.push(["!edittinderauthor command is for Mods only"]);
			} else if (!config.argument) {
				result.push([
					"To use this command, !edittinderauthor 1 @thestarlessabstract",
				]);
			}
			return result;
		},
	};
};

let versions = [
	{
		description:
			"Updates the author of a Tinder bio, using the bio number and @user",
		usage: "!edittinderauthor 69 @design_by_rose",
		usableBy: "mods",
		active: true,
	},
];

const tinderEditAuthor = new BaseCommand(commandResponse, versions);

exports.command = tinderEditAuthor;

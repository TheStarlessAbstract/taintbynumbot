const Tinder = require("../models/tinder");

const getCommand = () => {
	return {
		response: async (config) => {
			let result = [];

			if (config.isModUp && config.argument) {
				let entries = await Tinder.find({});
				let index = entries.length ? getNextIndex(entries) : 1;
				let message;
				let user;

				if (config.argument.includes("@")) {
					config.argument = config.argument.split("@");
					message = config.argument[0];
					user = config.argument[1];
				} else {
					message = config.argument;
					user = "";
				}

				try {
					await Tinder.create({
						index: index,
						user: user,
						text: message,
						addedBy: config.userInfo.displayName,
					});
					result.push(["Added new Tinder bio"]);

					if (!user) {
						result.push([
							"To add the name of the author of this Tinder bio, use the command: !edittinderauthor " +
								index +
								" @USERNAME",
						]);
					}
				} catch (err) {
					if (err.code == 11000) {
						result.push("This Tinder bio has already been added");
					} else {
						console.log(err);
						result.push(
							"There was some problem adding this Tinder bio, and Starless should really sort this shit out."
						);
					}
				}
			} else if (!config.isModUp) {
				result.push(["!addTinder command is for Mods only"]);
			} else if (!config.argument) {
				result.push([
					"To add a Tinder quote, you must include the quote after the command: '!addtinder Never mind about carpe diem, carpe taint @design_by_rose'",
				]);
			}

			return result;
		},
		versions: [
			{
				description: "To save Starless' new Tinder bio",
				usage:
					"!addtinder As long as my face is around, you will always have some place to sit",
				usableBy: "mods",
			},
		],
	};
};

function getNextIndex(array) {
	return array[array.length - 1].index + 1;
}

exports.getCommand = getCommand;

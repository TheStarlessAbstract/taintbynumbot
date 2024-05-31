const commandTypes = () => {
	return {
		game: require("../classes/commands/game/class"),
		song: require("../classes/commands/song/class"),
		steam: require("../classes/commands/steam/class"),
		list: require("../classes/commands/list/class"),
		listadd: require("../classes/commands/listAdd/class"),
		listedit: require("../classes/commands/listEdit/class"),
		listdelete: require("../classes/commands/listDelete/class"),
		text: require("../classes/commands/text/class"),
		title: require("../classes/commands/title/class"),
		points: require("../classes/commands/points/class"),
		hydrate: require("../classes/commands/hydrate/class"),
		shoutout: require("../classes/commands/shoutout/class"),
		followage: require("../classes/commands/followage/class"),
		messageadd: require("../classes/commands/messageAdd/class"),
	};
};

module.exports = commandTypes;

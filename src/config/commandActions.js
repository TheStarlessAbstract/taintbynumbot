const commandActions = () => {
	return {
		game: require("../classes/commands/game"),
		song: require("../classes/commands/song"),
		steam: require("../classes/commands/steam"),
		list: require("../classes/commands/list"),
		listadd: require("../classes/commands/listAdd"),
		listedit: require("../classes/commands/listEdit"),
		listdelete: require("../classes/commands/listDelete"),
		text: require("../classes/commands/text"),
		title: require("../classes/commands/title"),
		points: require("../classes/commands/points"),
		hydrate: require("../classes/commands/hydrate"),
		shoutout: require("../classes/commands/shoutout"),
		followage: require("../classes/commands/followage"),
	};
};

module.exports = commandActions;

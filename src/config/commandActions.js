const commandActions = () => {
	return {
		commandadd: require("../classes/commands/commandAdd"),
		commanddelete: require("../classes/commands/commandDelete"),
		commandedit: require("../classes/commands/commandEdit"),
		counter: require("../classes/commands/counter"),
		counterdecrease: require("../classes/commands/counterDecrease"),
		counterincrease: require("../classes/commands/counterIncrease"),
		counterset: require("../classes/commands/counterSet"),
		followage: require("../classes/commands/followage"),
		game: require("../classes/commands/game"),
		hydrate: require("../classes/commands/hydrate"),
		list: require("../classes/commands/list"),
		listadd: require("../classes/commands/listAdd"),
		listdelete: require("../classes/commands/listDelete"),
		listedit: require("../classes/commands/listEdit"),
		messageadd: require("../classes/commands/messageAdd"),
		messagedelete: require("../classes/commands/messageDelete"),
		messageedit: require("../classes/commands/messageEdit"),
		points: require("../classes/commands/points"),
		shoutout: require("../classes/commands/shoutout"),
		song: require("../classes/commands/song"),
		steam: require("../classes/commands/steam"),
		text: require("../classes/commands/text"),
		title: require("../classes/commands/title"),
		cardgame: require("../classes/commands/cardGameNew"),
		cardgamereset: require("../classes/commands/cardGameReset"),
		cardgameremain: require("../classes/commands/cardGameRemain"),
	};
};

module.exports = commandActions;

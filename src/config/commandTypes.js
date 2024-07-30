const commandTypes = () => {
	return {
		commandadd: require("../classes/commands/commandAdd/class"),
		commanddelete: require("../classes/commands/commandDelete/class"),
		commandedit: require("../classes/commands/commandEdit/class"),
		counter: require("../classes/commands/counter/class"),
		counterdecrease: require("../classes/commands/counterDecrease/class"),
		counterincrease: require("../classes/commands/counterIncrease/class"),
		counterset: require("../classes/commands/counterSet/class"),
		followage: require("../classes/commands/followage/class"),
		game: require("../classes/commands/game/class"),
		hydrate: require("../classes/commands/hydrate/class"),
		list: require("../classes/commands/list/class"),
		listadd: require("../classes/commands/listAdd/class"),
		listdelete: require("../classes/commands/listDelete/class"),
		listedit: require("../classes/commands/listEdit/class"),
		messageadd: require("../classes/commands/messageAdd/class"),
		messagedelete: require("../classes/commands/messageDelete/class"),
		messageedit: require("../classes/commands/messageEdit/class"),
		points: require("../classes/commands/points/class"),
		shoutout: require("../classes/commands/shoutout/class"),
		song: require("../classes/commands/song/class"),
		steam: require("../classes/commands/steam/class"),
		text: require("../classes/commands/text/class"),
		title: require("../classes/commands/title/class"),
		cardgame: require("../classes/commands/cardGameNew/class"),
		cardgamereset: require("../classes/commands/cardGameReset/class"),
		cardgameremain: require("../classes/commands/cardGameRemain/class"),
	};
};

module.exports = commandTypes;

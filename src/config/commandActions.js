const commandActions = {
	commandadd: "../classes/commands/commandAdd",
	commanddelete: "../classes/commands/commandDelete",
	commandedit: "../classes/commands/commandEdit",
	counter: "../classes/commands/counter",
	counterdecrease: "../classes/commands/counterDecrease",
	counterincrease: "../classes/commands/counterIncrease",
	counterset: "../classes/commands/counterSet",
	followage: "../classes/commands/followage",
	game: "../classes/commands/game",
	hydrate: "../classes/commands/hydrate",
	list: "../classes/commands/list",
	listadd: "../classes/commands/listAdd",
	listdelete: "../classes/commands/listDelete",
	listedit: "../classes/commands/listEdit",

	cardgame: "../classes/commands/cardGameNew",
	cardgamereset: "../classes/commands/cardGameReset",
	cardgameremain: "../classes/commands/cardGameRemain",

	messageadd: "../commandActions/messageAdd",
	messagedelete: "../commandActions/messageDelete",
	messageedit: "../commandActions/messageEdit",
	points: "../commandActions/points",
	shoutout: "../commandActions/shoutout",
	song: "../commandActions/song",
	steam: "../commandActions/steam",
	text: "../commandActions/text",
	title: "../commandActions/title",
};

function getCommandAction(name) {
	const action = require(commandActions[name]);
	return action;
}

module.exports = { getCommandAction };

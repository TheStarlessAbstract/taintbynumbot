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
	messageadd: "../classes/commands/messageAdd",
	messagedelete: "../classes/commands/messageDelete",
	messageedit: "../classes/commands/messageEdit",
	points: "../classes/commands/points",
	shoutout: "../classes/commands/shoutout",
	song: "../classes/commands/song",
	steam: "../classes/commands/steam",
	text: "../classes/commands/text",
	title: "../classes/commands/title",
	cardgame: "../classes/commands/cardGameNew",
	cardgamereset: "../classes/commands/cardGameReset",
	cardgameremain: "../classes/commands/cardGameRemain",
};

function getCommandAction(name) {
	const action = require(commandActions[name]);
	return action;
}

module.exports = { getCommandAction };

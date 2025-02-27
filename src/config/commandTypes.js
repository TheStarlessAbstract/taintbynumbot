const commandTypes = {
	commandadd: "../classes/commands/commandAdd/class",
	commanddelete: "../classes/commands/commandDelete/class",
	commandedit: "../classes/commands/commandEdit/class",
	counter: "../classes/commands/counter/class",
	counterdecrease: "../classes/commands/counterDecrease/class",
	counterincrease: "../classes/commands/counterIncrease/class",
	counterset: "../classes/commands/counterSet/class",
	followage: "../classes/commands/followage/class",
	game: "../classes/commands/game/class",
	hydrate: "../classes/commands/hydrate/class",
	list: "../classes/commands/list/class",
	listadd: "../classes/commands/listAdd/class",
	listdelete: "../classes/commands/listDelete/class",
	listedit: "../classes/commands/listEdit/class",

	cardgame: "../classes/commands/cardGameNew/class",
	cardgamereset: "../classes/commands/cardGameReset/class",
	cardgameremain: "../classes/commands/cardGameRemain/class",

	messageadd: "../classes/commands/messageAdd",
	messagedelete: "../classes/commands/messageDelete",
	messageedit: "../classes/commands/messageEdit",
	points: "../classes/commands/points",
	shoutout: "../classes/commands/shoutout",
	song: "../classes/commands/song",
	steam: "../classes/commands/steam",
	text: "../classes/commands/text",
	title: "../classes/commands/title",
};

function getCommandType(name) {
	const Type = require(commandTypes[name]);
	return Type;
}

module.exports = { getCommandType };

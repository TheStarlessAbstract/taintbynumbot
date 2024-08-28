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
	messageadd: "../classes/commands/messageAdd/class",
	messagedelete: "../classes/commands/messageDelete/class",
	messageedit: "../classes/commands/messageEdit/class",
	points: "../classes/commands/points/class",
	shoutout: "../classes/commands/shoutout/class",
	song: "../classes/commands/song/class",
	steam: "../classes/commands/steam/class",
	text: "../classes/commands/text/class",
	title: "../classes/commands/title/class",
	cardgame: "../classes/commands/cardGameNew/class",
	cardgamereset: "../classes/commands/cardGameReset/class",
	cardgameremain: "../classes/commands/cardGameRemain/class",
};

function getCommandType(name) {
	const Type = require(commandTypes[name]);
	return Type;
}

module.exports = { getCommandType };

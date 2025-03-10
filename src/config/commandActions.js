const commandActions = {
	cardgame: "../commandActions/cardGameNew", // working
	cardgameremain: "../commandActions/cardGameRemain", // working
	cardgamereset: "../commandActions/cardGameReset", // working
	commandadd: "../commandActions/commandAdd", // working
	commanddelete: "../commandActions/commandDelete", // working
	commandedit: "../commandActions/commandEdit", // working
	counter: "../commandActions/counter", // working
	counterdecrease: "../commandActions/counterDecrease", // working
	counterincrease: "../commandActions/counterIncrease", // working
	counterset: "../commandActions/counterSet", // working
	followage: "../commandActions/followage", // working
	game: "../commandActions/game", // working
	hydrate: "../commandActions/hydrate", // working
	list: "../commandActions/list", // working
	listadd: "../commandActions/listAdd", // working
	listdelete: "../commandActions/listDelete", // working
	listedit: "../commandActions/listEdit", // working
	messageadd: "../commandActions/messageAdd", // working
	messagedelete: "../commandActions/messageDelete", // working
	messageedit: "../commandActions/messageEdit", // working
	points: "../commandActions/points", // working
	shoutout: "../commandActions/shoutout", // working
	song: "../commandActions/song", // working
	steam: "../commandActions/steam", // working
	text: "../commandActions/text", // working
	title: "../commandActions/title", // working
};

function getCommandAction(name) {
	const action = require(commandActions[name]);
	return action;
}

module.exports = { getCommandAction };

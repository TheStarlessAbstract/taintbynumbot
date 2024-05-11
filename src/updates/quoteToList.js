const Quote = require("../../models/quote.js");
const List = require("../models/list.js");

let twitchId = "100612361";

async function copyAndUpdate() {
	let comm = template();
	await comm.save();
}

async function copyAndUpdate() {
	let quotes = await Quote.find();

	let list = [];
	for (let i = 0; i < quotes.length; i++) {
		list.push({
			channelId: twitchId,
			name: "quote",
			index: quotes[i].index,
			text: quotes[i].text,
			createdBy: quotes[i].addedBy,
			createdOn: new Date(),
		});
	}
	await List.insertMany(list);
}

module.exports = copyAndUpdate;

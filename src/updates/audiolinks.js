const Original = require("../../models/audiolink.js");
const New = require("../models/audiolink.js");

let twitchId = "100612361";

async function copyAndUpdate() {
	let comm = template();
	await comm.save();
}

async function copyAndUpdate() {
	let links = await Original.find();

	let list = [];
	for (let i = 0; i < links.length; i++) {
		list.push({
			channelId: twitchId,
			name: links[i].name,
			url: links[i].url,
			channelPointRedeem: links[i]?.channelPointRedeem,
			command: links[i]?.command,
		});
	}
	await New.insertMany(list);
}

module.exports = copyAndUpdate;

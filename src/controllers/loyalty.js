const { getChattersPaginated } = require("../services/twitch/chat");

const intervals = new Map();

function start(channelId) {
	intervals.set(channelId, createInterval(channelId));
}
function stop(channelId) {
	const interval = intervals.get(channelId);
	interval.stop();
}

function createInterval(channelId) {
	return setInterval(async () => {
		let chat = await getChattersPaginated(channelId);
		const chatters = await listChatters(chat);
	}, 5 * 60 * 1000);
}

async function listChatters(chat) {
	let chatPage = await chat.getNext();
	if (chatPage.length == 0) return;
	const chatters = [];

	while (chatPage.length > 0) {
		chatters = chatters.concat(currentPageChatters);
		chatPage = await chat.getNext();
	}
}

module.exports = {
	start,
	stop,
};

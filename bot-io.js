const redemptions = require("./bot-redemptions");

function setup(io) {
	io.on("connection", (socket) => {
		console.log("a user connected");
		redemptions.audioImport();
		redemptions.setHydrateBooze();

		socket.on("disconnect", () => {
			console.log("user disconnected");
		});

		socket.on("ended", (msg) => {
			redemptions.setCanPlay();
		});
	});
}

exports.setup = setup;

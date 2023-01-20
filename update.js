require("dotenv").config();

const mongoose = require("mongoose");

const Message = require("./models/message");
const TempMessage = require("./models/tempmessage");
const Tinder = require("./models/tinder");
const TempTinder = require("./models/temptinder");
const Quote = require("./models/quote");
const TempQuote = require("./models/tempquote");

const uri = process.env.MONGO_URI;

init();

async function init() {
	await connectToMongoDB();
	await setup();
}

async function connectToMongoDB() {
	try {
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	} catch (error) {
		// Handle the error
	}
}

async function setup() {
	let thing = 1;
	let messages;
	let tinders;
	let quotes;

	if (thing == 1) {
		messages = await Message.find({});

		for (let i = 0; i < messages.length; i++) {
			await Message.deleteOne({ text: messages[i].text });

			try {
				await TempMessage.create({
					text: messages[i].text,
					addedBy: messages[i].addedBy,
				});
			} catch (err) {
				console.log("Duplicate found");
			}
		}

		tinders = await Tinder.find({});

		for (let i = 0; i < tinders.length; i++) {
			await Tinder.deleteOne({ text: tinders[i].text });

			try {
				await TempTinder.create({
					index: tinders[i].index,
					text: tinders[i].text,
					user: tinders[i].user,
					addedBy: tinders[i].addedBy,
				});
			} catch (err) {
				console.log("Duplicate found");
			}
		}

		quotes = await Quote.find({});

		for (let i = 0; i < quotes.length; i++) {
			await Quote.deleteOne({ text: quotes[i].text });

			try {
				await TempQuote.create({
					index: quotes[i].index,
					text: quotes[i].text,
					user: quotes[i].user,
					addedBy: quotes[i].addedBy,
				});
			} catch (err) {
				console.log("Duplicate found");
			}
		}
	} else {
		messages = await TempMessage.find({});

		for (let i = 0; i < messages.length; i++) {
			await TempMessage.deleteOne({ text: messages[i].text });

			try {
				await Message.create({
					text: messages[i].text,
					addedBy: messages[i].addedBy,
				});
			} catch (err) {
				console.log("Duplicate found");
			}
		}

		tinders = await TempTinder.find({});

		for (let i = 0; i < tinders.length; i++) {
			await TempTinder.deleteOne({ text: tinders[i].text });

			try {
				await Tinder.create({
					index: tinders[i].index,
					text: tinders[i].text,
					user: tinders[i].user,
					addedBy: tinders[i].addedBy,
				});
			} catch (err) {
				console.log("Duplicate found");
			}
		}

		quotes = await TempQuote.find({});

		for (let i = 0; i < quotes.length; i++) {
			await TempQuote.deleteOne({ text: quotes[i].text });

			try {
				await Quote.create({
					index: quotes[i].index,
					text: quotes[i].text,
					user: quotes[i].user,
					addedBy: quotes[i].addedBy,
				});
			} catch (err) {
				console.log("Duplicate found");
			}
		}
	}
}

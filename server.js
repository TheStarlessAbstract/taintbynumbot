require('dotenv').config();
const tmi = require('tmi.js');
const mongoose = require("mongoose");
const Tinder = require("./models/tinder");
const Title = require("./models/title");
const uri =
  "mongodb+srv://" +
  process.env.USER +
  ":" +
  process.env.PASS +
  "@cluster0.8pokz.mongodb.net/taint_bot?retryWrites=true&w=majority";

const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const commands = {
    upvote: {
        response: (argument) => `Successfully upvoted ${argument}`
    },
    tinderquote: {
        response: () => {
            console.log('tinderquote');
            return "tinderQuote";
        }
    },
    addtinder: {
        response: () => "addTinder"
    },
    titleharassment: {
        response: () => "titleHarassment"
    },
    addtitle: {
        response: () => "addTitle"
    },
    booty: {
        response: 'Who loves the booty?'
    }
}

console.log('hello, twitch');

const client = new tmi.Client({
    connection: {
        reconnect: true
    },
    channels: [
        'thestarlessabstract'
    ],
    identity: {
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_OAUTH_TOKEN
    }
});

client.connect();

client.on('message', async (channel, context, message) => {
    const isNotBot = context.username.toLowerCase() !== process.env.TWITCH_BOT_USERNAME.toLowerCase();
    if (!isNotBot) return;

    const [raw, command, argument] = message.match(regexpCommand) || [null, null, null];

    if (!command) return;

    const { response } = commands[command.toLowerCase()] || {};

    if (typeof response === 'function') {
        client.say(channel, response(argument));
    }
    else if (typeof response === 'string') {
        client.say(channel, response);
    }

});
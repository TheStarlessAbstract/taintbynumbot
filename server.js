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
        response: async () => {
            let tinderEntries = await Tinder.find({});
            if (tinderEntries.length > 0) {
                let tinder = getRandom(tinderEntries);

                client.say(target, `${tinder.text}`);
                if (tinder.title != "") {
                    client.say(
                    target,
                    `This Tinder bio was brought to you by the glorious, and taint-filled @${tinder.user}`
                );
                }
            }
            else {
                client.say(target, `Tinder bio? What Tinder bio?`)
            }
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

    const { response } = await commands[command.toLowerCase()] || {};

    if (typeof response === 'function') {
        // client.say(channel, await response);
        // console.log(await response)
        // client.say(channel, "sdads");
    }
    else if (typeof response === 'string') {
        client.say(channel, response);
    }

});
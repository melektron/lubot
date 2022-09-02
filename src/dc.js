/*
code for connecting to discord
*/


const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { token, botid } = require("./secrets.json");


let client
let channel


const run = () => {
    // Create a new client instance
    client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages
        ]
    });

    // When the client is ready, run this code (only once)
    client.once("ready", () => {
        console.log("Ready!");

        channel = client.channels.cache.get("1015394508554371103");
        channel.send("Hello, World!");
    });

    client.on("messageCreate", (message) => {
        if (message.author.id === botid) return;

        console.log(message);
    });

    // Login to Discord with your client's token
    client.login(token);
}

const sendMessage = (text) => {
    channel.send(text);
}

exports.run = run;
exports.sendMessage = sendMessage;
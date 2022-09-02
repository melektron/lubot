/*
ELEKTRON © 2022
Written by melektron, DarkMetalMouse
www.elektron.work
02.09.22, 23:23

*/


const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require("./token.json");

console.log(token);

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');

    const channel = client.channels.cache.get("1015375432373248021");
    channel.send("Hello, World!");
});

client.on("message", (message) => {
    console.log(message.content);
});

// Login to Discord with your client's token
client.login(token);

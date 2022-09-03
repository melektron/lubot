/*
code for connecting to discord
*/


const { Client, GatewayIntentBits, Partials } = require("discord.js")
const { token, botid, outputChannels, inputChannels } = require("./secrets.json")

let client
let channels = []

const run = () => {
    // Create a new client instance
    client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages
        ]
    })

    // When the client is ready, get the channel id to post 
    client.once("ready", () => {
        console.log("Discord ready!")
        
        // resolve all output channels
        outputChannels.forEach(channel_id => {
            const channel = client.channels.cache.get(channel_id)
            if (channel != undefined)
                channels.push(channel)
        })
    })

    client.on("messageCreate", (message) => {
        // ignore messages sent by the bot itself
        if (message.author.id === botid) return
        if (!inputChannels.includes(message.channelId)) return

        console.log("Discord message: ", message.content)
    })

    // Login to Discord with your client's token
    client.login(token)
}

const sendMessage = (text) => {
    // send message to all output channels
    channels.forEach(channel => channel.send(text))
}

exports.run = run
exports.sendMessage = sendMessage
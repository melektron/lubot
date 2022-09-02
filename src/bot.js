const mineflayer = require("mineflayer")
const { Vec3 } = require("vec3")
const { reportArea, reportBlockNames } = require("./minecraft.json");
const { connectionData } = require("./secrets.json")
const { sendMessage } = require("./dc.js")

let bot

let blocksBreaking = {}

let lastWhisperTime = 0
let lastReportTime = 0

const welcome = () => {
    bot.chat("I\'m watching you!")
    sendMessage("I'm watching you!")
}

function isInReportArea(position) {
    console.log
    return position.x >= reportArea.start.x && position.x <= reportArea.end.x &&
        position.y >= reportArea.start.y && position.y <= reportArea.end.y &&
        position.z >= reportArea.start.z && position.z <= reportArea.end.z
}

const logBreaking = (block, destroyStage, entity) => {

    if (isInReportArea(block.position) && reportBlockNames.includes(block.name)) {
        if (blocksBreaking[block.position] != entity.username) { // 
            blocksBreaking[block.position] = entity.username
            if (lastWhisperTime + 500 < Date.now()) {
                bot.whisper(entity.username, "Stop trying to break the beacon!")
                lastWhisperTime = Date.now()

            }
        }
    }
}

const checkBlock = (oldBlock, newBlock) => {
    if (blocksBreaking[oldBlock.position] && newBlock.name == "air") {
        if (lastReportTime + 500 < Date.now()) {
            bot.chat(`${blocksBreaking[oldBlock.position]} broke ${oldBlock.displayName} at the beacon!`)
            sendMessage(`@everyone ${blocksBreaking[oldBlock.position]} broke ${oldBlock.displayName} at the beacon!`)
            lastReportTime = Date.now()

        }

        delete blocksBreaking[oldBlock.position]
    }
}

const connect = () => {
    const instance = mineflayer.createBot(connectionData)

    instance.once("spawn", welcome)
    instance.on("blockBreakProgressObserved", logBreaking)
    instance.on("blockUpdate", checkBlock)

    // reconnect if the bot disconnects
    instance.once("end", () => setTimeout(connect, 5e3))
    return (bot = instance)
}

exports.connect = connect
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
    sendMessage("I'm watching the server!")
}

function isInReportArea(position) {
    const lower_x = Math.min(reportArea.start.x, reportArea.end.x)
    const lower_y = Math.min(reportArea.start.y, reportArea.end.y)
    const lower_z = Math.min(reportArea.start.z, reportArea.end.z)
    const higher_x = Math.max(reportArea.start.x, reportArea.end.x)
    const higher_y = Math.max(reportArea.start.y, reportArea.end.y)
    const higher_z = Math.max(reportArea.start.z, reportArea.end.z)
    return  position.x >= lower_x && position.x <= higher_x && 
            position.y >= lower_y && position.y <= higher_y && 
            position.z >= lower_z && position.z <= higher_z
}

const logBreaking = (block, destroyStage, entity) => {
    if (isInReportArea(block.position) && reportBlockNames.includes(block.name)) {
        if (blocksBreaking[block.position] != entity.username) { // 
            blocksBreaking[block.position] = entity.username
            if (lastWhisperTime + 500 < Date.now()) {
                bot.whisper(entity.username, "Stop trying to break the beacon!")
                sendMessage(`@warning ${entity.username} is trying to break ${block.displayName} at the beacon!`)
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
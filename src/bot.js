const mineflayer = require("mineflayer")
const { Vec3 } = require("vec3")
const { reportArea, reportBlockNames } = require("./minecraft.json");


var lastMessageTime = 0

function isInReportArea(position) {
    console.log
    return position.x >= reportArea.start.x && position.x <= reportArea.end.x &&
        position.y >= reportArea.start.y && position.y <= reportArea.end.y &&
        position.z >= reportArea.start.z && position.z <= reportArea.end.z
}

const bot = mineflayer.createBot({ host: "localhost", port: 25565 })

console.log("Bot started")

const welcome = () => {
    bot.chat("I'm watching you!")
}

var blocksBreaking = {}

const logBreaking = (block, destroyStage, entity) => {

    if (isInReportArea(block.position) && reportBlockNames.includes(block.name)) {
        if (blocksBreaking[block.position] != entity.username) { // 
            blocksBreaking[block.position] = entity.username
            if (lastMessageTime + 500 < Date.now()) {
                bot.whisper(entity.username, "Stop trying to break the beacon!")
            }
            lastMessageTime = Date.now()
        }
    }
}

const checkBlock = (oldBlock, newBlock) => {
    if (blocksBreaking[oldBlock.position] && newBlock.name == "air") {
        bot.chat(`${blocksBreaking[oldBlock.position]} broke ${oldBlock.displayName} at the beacon!`)
        delete blocksBreaking[oldBlock.position]
    }
}

bot.once("spawn", welcome)
bot.on("blockBreakProgressObserved", logBreaking)
bot.on("blockUpdate", checkBlock)
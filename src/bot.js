const mineflayer = require("mineflayer")
const { Vec3 } = require("vec3")
const { reportArea, reportBlockNames, friends, sendPublicMCMessages, playerAssosiationRadius } = require("./minecraft.json");
const { connectionData } = require("./secrets.json")
const { sendDiscordMessage } = require("./dc.js")

let bot

let blocksBreaking = {}

let lastWhisperTime = 0
let lastReportTime = 0

const sendChatMessage = (text) => {
    if (!sendPublicMCMessages) return
    bot?.chat(text);
}

const welcome = () => {
    sendChatMessage("I\'m watching you!")
    sendDiscordMessage("I'm watching the server!")
}

function isInReportArea(position) {
    const lower_x = Math.min(reportArea.start.x, reportArea.end.x)
    const lower_y = Math.min(reportArea.start.y, reportArea.end.y)
    const lower_z = Math.min(reportArea.start.z, reportArea.end.z)
    const higher_x = Math.max(reportArea.start.x, reportArea.end.x)
    const higher_y = Math.max(reportArea.start.y, reportArea.end.y)
    const higher_z = Math.max(reportArea.start.z, reportArea.end.z)
    return position.x >= lower_x && position.x <= higher_x &&
        position.y >= lower_y && position.y <= higher_y &&
        position.z >= lower_z && position.z <= higher_z
}

const logBreaking = (block, destroyStage, entity) => {
    if (isInReportArea(block.position) && reportBlockNames.includes(block.name)) {
        if (blocksBreaking[block.position] != entity.username) {
            blocksBreaking[block.position] = entity.username
            if (lastWhisperTime + 500 < Date.now()) {
                if (!friends.includes(entity.username)) bot.whisper(entity.username, "Stop trying to break the beacon!")
                sendDiscordMessage(`@attempt ${entity.username} is trying to break ${block.displayName} ${block.position} at the beacon!`)
                lastWhisperTime = Date.now()
            }
        }
    }
}

const checkBlock = (oldBlock, newBlock) => {
    if (newBlock.name == "air") {
        if (blocksBreaking[oldBlock.position]) {
            if (lastReportTime + 500 < Date.now()) {
                if (!friends.includes(blocksBreaking[oldBlock.position])) sendChatMessage(`${blocksBreaking[oldBlock.position]} broke ${oldBlock.displayName} at the beacon!`)
                sendDiscordMessage(`@break ${blocksBreaking[oldBlock.position]} broke ${oldBlock.displayName} ${oldBlock.position} at the beacon!`)
                lastReportTime = Date.now()
            }

            delete blocksBreaking[oldBlock.position]
        } else {
            // Block breaking animation is not sent over 32 blocks away, so we can't detect it with logBreaking
            // This method checks by distance
            if (isInReportArea(oldBlock.position) && reportBlockNames.includes(oldBlock.name)) {
                let possibleBreakers = []
                let publicReport = true;
                for (const playerKey in bot.players) {
                    const player = bot.players[playerKey]
                    if (player.entity != null && player.entity.position.distanceTo(oldBlock.position) < playerAssosiationRadius) {
                        possibleBreakers.push(player.username)
                        // don't send a public report in the chat if a friend was nearby
                        if (friends.includes(player.username)) publicReport = false;
                    }
                }
                if (possibleBreakers.length > 0) {
                    if (lastReportTime + 500 < Date.now()) {
                        // only send mc chat message when no friend was nearby
                        if (publicReport) sendChatMessage(`${possibleBreakers.join(" or ")} broke ${oldBlock.displayName} at the beacon!`)
                        // allways send discord chat messages
                        sendDiscordMessage(`@break ${possibleBreakers.join(" or ")} broke ${oldBlock.displayName} ${oldBlock.position} at the beacon!`)
                        lastReportTime = Date.now()
                    }
                } else {
                    // if no players could be detected close enough, still inform discord about the changes and all visible players
                    let playerPositions = ""
                    playerPositions = Object.keys(bot.players).reduce((output, currentPlayerKey) => {
                        const currentPlayer = bot.players[currentPlayerKey]
                        if (currentPlayer.entity == null) return output    // ignore players that are out of view distance
                        return output + `     - ${currentPlayer.username} ${friends.includes(currentPlayer.username) ? "(friend)" : ""}: (${currentPlayer.entity.position.x.toFixed(1)}, ${currentPlayer.entity.position.y.toFixed(0)}, ${currentPlayer.entity.position.z.toFixed(0)}\t Δ${currentPlayer.entity.position.distanceTo(oldBlock.position).toFixed(0)})\n`
                    }, playerPositions)
                    sendDiscordMessage(`@break ${oldBlock.displayName} was broken at ${oldBlock.position}, but I don't know who did it :(`)
                    sendDiscordMessage("Possible players:\n" + playerPositions)
                }
            }
        }
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
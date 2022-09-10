/*
code for greeting players
*/

const { selfJoinGreetings, playerJoinGreetings, selfJoinMessages } = require("../config/greetings.json")

// to select random array entry
function randomSample(array) {
    return array[Math.floor(Math.random() * array.length)]
}

// gets called for every player when bot itself joins 
// and every time a player joins while the bot is logged in
const onPlayerJoin = (player, inJoinPhase, chatFunction) => {
    if (player == null) return
    if (player.username == null) return

    // when the bot has joined, send selfJoinGreetings
    if (inJoinPhase) {
        if (selfJoinGreetings[player.username] != null) {
            chatFunction(randomSample(selfJoinGreetings[player.username]));
        }
    } else {
        if (playerJoinGreetings[player.username] != null) {
            chatFunction(randomSample(playerJoinGreetings[player.username]));
        }
    }
}

// gets called when the bot joins
const onSelfJoin = (chatFunction) => {
    chatFunction(randomSample(selfJoinMessages))
}

exports.onPlayerJoin = onPlayerJoin
exports.onSelfJoin = onSelfJoin
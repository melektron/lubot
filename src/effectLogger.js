const { bot } = require("./bot.js")


const effects = [
    "speed",
    "slowness",
    "haste",
    "mining_fatigue",
    "strength",
    "instant_health",
    "instant_damage",
    "jump_boost",
    "nausea",
    "regeneration",
    "resistance",
    "fire_resistance",
    "water_breathing",
    "invisibility",
    "blindness",
    "night_vision",
    "hunger",
    "weakness",
    "poison",
    "wither",
    "health_boost",
    "absorption",
    "saturation",
    "glowing",
    "levitation",
    "luck",
    "unluck",
    "slow_falling",
    "conduit_power",
    "dolphins_grace",
    "bad_omen",
    "hero_of_the_village",
]

const logEffectStart = (entity, effect) => {
    console.log("start", effects[effect.id - 1]);
}

const logEffectEnd = (entity, effect) => {
    console.log("end", effects[effect.id - 1]);
}

exports.logEffectStart = logEffectStart
exports.logEffectEnd = logEffectEnd

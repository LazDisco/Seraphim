import winston from 'winston'
import Discord from 'discord.js'

module.exports.run = async (msg, args, client, db, ID) => {
    let number = args[0];
    if(!number) return msg.reply("You must supply a valid number.")
    if(!parseInt(number)) msg.reply("You must supply a valid number.")
    if(number > 2000000000) msg.reply("Number cannot be over 2 million.")
    if(number < -2000000000) msg.reply("Numbers cannot be less than -2 million.")

    return msg.reply(
        `Number Generated:  ${(Math.floor(Math.random() * number) + 1)}`
    );
}

module.exports.help = {
    name: "random"
}
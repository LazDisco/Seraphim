import Discord from 'discord.js'
import winston from 'winston'

const images = require('../images.json')

let depression = images.depression;
let sadness = images.sadness;

function depressionFunction() {
    return sadness[Math.floor(Math.random() * sadness.length)];
}

function sadnessFunction() {
    return sadness[Math.floor(Math.random() * sadness.length)];
}

module.exports.run = async (msg, args, client, db, ID) => {

    if (args[0] == "finger") {
        var embed = new Discord.RichEmbed()
            .setTitle('Me right now:') // : }
            .setColor('#663399') // Brigand Royal Purple
            .setImage('https://i.imgur.com/lB7pLWt.png') // Our image
        msg.channel.send(embed)
        msg.delete() // No one will know who sent it now
    }

    if (args[0] == "say") {
        let one = args.shift()
        let message = args.join(' '); // Put our args back into a full string
        msg.delete().catch((err) => { // None may know my secret
            winston.error(err) // If they don't have permissions log the error
        })
        msg.channel.send(message)
    }

    if (args[0] == "umad") {
        var embed = new Discord.RichEmbed()
            .setTitle('Me right now:') // : }
            .setColor('#663399') // Brigand Royal Purple
            .setImage('https://i.imgur.com/tMizD7V.png') // Our image
        msg.channel.send(embed)
        msg.delete() // No one will know who sent it now

    }

    if (args[0] == "idc") {
        var embed = new Discord.RichEmbed()
            .setTitle('Me right now:') // : }
            .setColor('#663399') // Brigand Royal Purple
            .setImage('https://i.imgur.com/6pdGq6O.png') // Our image
        msg.channel.send(embed)
        msg.delete() // No one will know who sent it now

    }

    if (args[0] == "sad") {
        var embed = new Discord.RichEmbed()
            .setTitle('Me right now:') // : {
            .setColor('#663399') // Brigand Royal Purple
            .setImage(sadnessFunction()) // Our image
        msg.channel.send(embed)
        msg.delete() // No one will know who sent it now
    }

    if (args[0] == "depression") {
        var embed = new Discord.RichEmbed()
            .setTitle('Me right now:') // : {
            .setColor('#663399') // Brigand Royal Purple
            .setImage(depressionFunction()) // Our image
        msg.channel.send(embed)
        msg.delete() // No one will know who sent it now
    }

}

module.exports.help = {
    name: "laz"
}
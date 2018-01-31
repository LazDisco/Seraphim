import Discord from 'discord.js'
import winston from 'winston'

const images = require('../images.json')

let depression = images.depression;
//Open a function using the var sombraquotes that we can call later
function depression() {
    //Return, aka post, sombraquotes after picking one at random.
    return depression[Math.floor(Math.random() * depression.length)];
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
            .setImage('https://i.imgur.com/C8c9q2U.jpg') // Our image
        msg.channel.send(embed)
        msg.delete() // No one will know who sent it now
    }

    if (args[0] == "depression") {
        var embed = new Discord.RichEmbed()
            .setTitle('Me right now:') // : {
            .setColor('#663399') // Brigand Royal Purple
            .setImage(depression()) // Our image
        msg.channel.send(embed)
        msg.delete() // No one will know who sent it now
    }

}

module.exports.help = {
    name: "laz"
}
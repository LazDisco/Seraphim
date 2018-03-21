import Discord from 'discord.js';
import moment from 'moment';
import format from 'string-format';

module.exports.run = async (msg, args, client, db, ID) => {

    let date = Date.now()
    let utc = moment(date).utc()
    const dateFormat = "DD-MM-YY HH:mm Z";

    let embed = new Discord.RichEmbed()
        .setTimestamp()
        .setFooter(`Server Time: ${moment(utc).format(dateFormat)} | Your time: `)
        .setColor('#006DEC') // Discovery Blue

    msg.channel.send(embed)
}

module.exports.help = {
    name: "time"
}
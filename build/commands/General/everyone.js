import Discord from 'discord.js';

module.exports.run = async (msg, args, client, db, ID) => {

    let embed = new Discord.RichEmbed()
        .setImage("https://i.imgur.com/vxkkLRf.png")
        .setTitle("@EVERYONE !??!?!??!")
        .setTimestamp(new Date())
        .setColor("#4477FF");

        msg.channel.send(embed)

}

module.exports.help = {
    name: "everyone"
}
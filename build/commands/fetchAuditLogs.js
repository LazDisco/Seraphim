import secrets from '../settings/secrets.json'
import discord from 'discord.js'

module.exports.run = async (msg, args, client, db, ID) => {
    if (msg.author.id !== secrets.ownerID) return
    if (!args[0]) msg.channel.send("Server Information:" + client.guilds.map(guild => guild.id + "\n" + guild.name + "\n"))

    if (args[0] && !args[1]) {
        try {
            client.guilds.map(guild => {
                if (guild.id == args[0]) {
                    if (!guild.available) return msg.reply("ERR: Guild is suffering from server outage.");
                    //let invites = guild.fetchInvites()
                        ///.then(result => {
                            var embed = new discord.RichEmbed()
                                .setThumbnail(guild.iconURL)
                                .setColor('#663399')
                                .setTimestamp(new Date)
                                .addField("Name:", guild.name, true)
                                .addField("ID:", guild.id, true)
                                .addField("Guild Owner", guild.owner, true)
                                .addField("Member Count:", guild.memberCount, true)
                                .addField("Members:", guild.members.map(iter => iter.user + `(${iter.nickname})`), true)
                                .addField("Channels:", guild.channels.map(iter => iter.name), true)
                                .addField("Roles", guild.roles.map(iter => iter.name), true)
                                //.addField("Invite Info:", result.map(iter => `${iter.code} by ${iter.inviter} used ${iter.uses} times - Expire Flag[${iter.temporary}]`), true)

                            msg.channel.send(embed)
                        //})
                }
            })
        } catch (e) {
            throw e;
        }
    }
    if(args[0] && args[1])
    {
        try {
            client.guilds.map(guild => {
                if (guild.id == args[0]) {
                    
                    if (!guild.available) return msg.reply("ERR: Guild is suffering from server outage.");
                    let invites = guild.fetchAuditLogs({limit :args[1]})
                    .then(result => {
                    var embed = new discord.RichEmbed()
                        .setThumbnail(guild.iconURL)
                        .setColor('#663399')
                        .setTimestamp(new Date)
                        .addField("Name:", guild.name, true)
                        .addField("ID:", guild.id, true)
                        .addField("Audit Info:", result.map(iter => iter.entries), true)

                    msg.channel.send(embed)
                    })
                }
            })
        } catch (e) {
            throw e;
        }
    }
}

module.exports.help = {
    name: "fetchserveraudit"
}
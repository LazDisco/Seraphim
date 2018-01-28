import Discord from 'discord.js'

module.exports.run = async (msg, args, client, db, ID) => {
    db.r.table('guilds').get(ID).getField('prefix').run(function(err, result) {

        const helpText = `Hello. Welcome to the help menu for the Brigand bot. This bot is currently a work-in-progress, but there are some commands available.
(If you write a command as a second argument it will provide more information on it. All commands must be lowercase.)
Here are some that you can do:`

        const helpEmbed = new Discord.RichEmbed()
            .setColor("#663399")
            .setDescription("Command List:")
            .addField("Epiniac DB Commands:", `Epiniac\nInfo.epiniac\nCreate-epiniac`, true)
            .addField("Misc Commands:", `Help\nPing\nId\nPrefix`, true)
            .addField("Mod Commands:", "Purge", true)
            .addField("TBD:", "N/A", true)

        if (!args[0]) {
            msg.channel.send(helpText)
            msg.channel.send(helpEmbed)
        }

        if (args[0] == "epiniac") {
            const epiniacUsageImage = new Discord.RichEmbed()
                .setColor("#663399")
                .setDescription("DOs AND DON'Ts:")
                .setImage("https://i.imgur.com/LfDWUl6.png")
            msg.channel.send(epiniacUsageImage)
        }

        if (args[0] == "info.epiniac") {
            msg.channel.send(`info.epiniac has five different params that can be used. These are:
list, count, count.id, get, recent. Usage:

${result}info.epiniac count - This command will return the amount of reports in the database

${result}info.epiniac count.id 97625872525193216 - This command will return the amount of reports in the database, from Laz.
${result}info.epiniac get 6a5d7a00-e30e-4e7f-8676-f2c94b1e48b4 - Thi command will return the associated report.

${result}info.epiniac recent 3 - This command will return the three most recent reports.

${result}info.epiniac list id 97625872525193216 - This command will return the keys for all reports from Laz.
${result}info.epiniac list ship FB|M-Honest.Mistake - This command will return all the keys that involve the ship provided.
${result}info.epiniac list cargo Hull-Segments - This command will return all the keys that involve "Hull-Segments".`)
        }

        if (args[0] == "prefix") {
            msg.channel.send(`${result}prefix ! - This will change the prefix to \`!\`.
If you type "prefix" without any symbol before it, it will tell you what the current server prefix is.`)
        }

        if (args[0] == "purge") {
            msg.channel.send(`${result}purge 5 - This will delete the last five messages.
${result}purge 5 @Laz will purge the last five messages from Laz.`)
        }

        //Commands only VIPs can use
        /*  if (!message.member.roles.find("name", "VIP")) {
             return;
        } */
    })
}

module.exports.help = {
    name: "help"
}
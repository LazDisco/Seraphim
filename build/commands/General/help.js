import Discord from 'discord.js'

module.exports.run = async (msg, args, client, db, ID) => {
    db.r.table('guilds').get(ID).getField('prefix').run(function(err, result) {

        let command = args[0] // Looks a hell of a lot neater this way

        const helpText = `Hello. Welcome to the help menu for the Brigand bot. This bot is currently a work-in-progress, but there are some commands available. Writing ${result}help <command> will give your more information on an existing command.
Example: ${result}help get

Here are some that you can do:`

        const helpGrid = `
\`\`\`css
Format Information - [A] = Requires Admin Permissions - [O] = Requires Bot Owner Permissions - [M] = Requires a Specific Module to be Enabled - * = Some part of the command might require extra permissions.
All Commands should be inserted in lowercase.

General Commands: 

Help [ ]  | Iam [A*]  | Get [M*]  | Ping [ ] | Tag [O*]

Laz Commands:

Laz [O*A*]  | AddGuild [O]  | Fetch [O]  | Servermsg [O]

Epiniac Database Commands:

Create-Epiniac [O] | Epiniac.get [ ] | Epiniac [*]

Moderation Commands:

Reset [A] | Purge [*] | Prefix [*] | Modules [*]

Playerlist Commands: 

Reload [ ] | List [ ] | Shadow [O*]\`\`\` `

        if (!command) {
            msg.channel.send(helpText)
            msg.channel.send(helpGrid)
        }

        if (command == "epiniac") {
            const epiniacUsageImage = new Discord.RichEmbed()
                .setColor("#663399")
                .setDescription("DOs AND DON'Ts:")
                .setImage("https://i.imgur.com/LfDWUl6.png")
            msg.channel.send(epiniacUsageImage)
        }

        if (command == "info.epiniac") {
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

        if (command == "prefix") {
            msg.channel.send(`${result}prefix ! - This will change the prefix to \`!\`.
If you type "prefix" without any symbol before it, it will tell you what the current server prefix is.`)
        }

        if (command == "purge") {
            msg.channel.send(`${result}purge 5 - This will delete the last five messages.
${result}purge 5 @Laz will purge the last five messages from Laz.`)
        }

        if (command == "tag") {
            msg.channel.send(`${result}tag create Test Hello this is a test - This will create a tag/quote that can be called back to.
${result}tag delete Test - This will delete the tag Test (note this is case sensitive).
${result}tag get Test - This will display the message "Hello this is a test".
${result}tag list - This will list all the active tags on this server.
${result}tag count - This will return the total amount of tags in use on this server (number form).

Note: When creating tags, use # to indicate a line break.`)
        }

        if(command == "shadow") {
            msg.channel.send(`${result}shadow.enable will set the playerlist shadow tag to true.
${result}shadow.disable will set the the playerlist shadow tag to false.
${result}shadow.restore will restore the playerlist shadow tag if it has been deleted (default false).`)
        }

        if(command == "reload") {
            msg.channel.send(`${result}reload - This will reset the connection to the Disco API.`)
        }

        if(command == "reset") {
            msg.channel.send(`${result}reset - This will restore the core guild settings to when the bot was first added.`)
        }

        if(command == "get") {
            msg.channel.send(`${result}get cat - Will use the random.cats api to get you a cute kitty picture.
${result}get neko - Will use the neko.life api to get you a cute kitty picture.
${result}get headpat - Will use the neko.life api to get you an adorable headpat.
${result}get cuddle - Will use the neko.life api to get you an adorable cuddle.
${result}get lewd - Will get you a lewd neko. The Lewd module must be enabled in your guild for this to work.`)
        }

        if(command == "iam") {
            msg.channel.send(`${result}iam <role> - This will grant you the specified self-asignable role.
${result}iam not <role> - This will remove the specified self-asignable role.
${result}iam set <role> - This will set the specified self-asignable role. (Discord Admins Only)
${result}iam list - This will give you a  list of self-asignable roles.
${result}iam remove <role> - This will remove a self-asignable role. (Discord Admin Only)`)
        }

        if(command == "everyone") {
            msg.channel.send(`${result}everyone - This will display your annoyance at @everyone`)
        }

        if(command == "ping") {
            msg.channel.send(`${result}ping - This will display the current ping between the guild and the bot.`)
        }

        if(command == "module") {
            msg.channel.send(`The module command is done in the following format: ${result}module <module> <true/false>
A full list of modules can be found by using ${result}module status.
There are a number of identifiers that can be used to signal whether to enable or disable a module, these are as follows:
Identifiers for activation: 'true', 'on', 'enable', 'active'
Identifiers for deactivaton: 'false', 'off', 'disable', 'inactive'

Example: ${result}module discovery enable - This would activate the discovery module.`)
        }

    })
}

module.exports.help = {
    name: "help"
}
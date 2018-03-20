import Discord from 'discord.js'; // Discord for embeds
import { statusReport } from "../../processes/statusReport";
import { dbERR } from '../../processes/statusReport'

// The different ways people can enable/disable modules, which keywords it will accept.
const enable = ['on', 'active', 'true', 'enable'];
const disable = ['off', 'inactive', 'false', 'disable'];



module.exports.run = async (msg, args, client, db, ID) => {
    let module = args[0]
    let action = args[1]
    if(!args[0]) return msg.reply("ERR: You didn't select a module.")

    if(module == "status")
    {
        let format = await statusReport(ID)
        console.log(format)
        console.log(Object.keys(format).length)

        for (let index = 0; index < Object.keys(format).length; index++) {
            const element = format[Object.keys(format)[index]];
            console.log(element)

            if(Object.values(element) == false) format[Object.keys(format)[index]] = "Disabled"
            if(Object.values(element) == true) format[Object.keys(format)[index]] = "Enabled"            
        }

        console.log(format)
        let moduleNames = format.reduce((accumulator, set) => {
            var replaceSet = Object.keys(set)
            replaceSet = replaceSet.join('\n')
            return accumulator + replaceSet
        }, '')

        let moduleStatus = format.reduce((accumulator, set) => {
            var replaceSet = set[Object.keys(set)[0]]
            replaceSet = replaceSet.join('\n')
            return accumulator + replaceSet
        }, '')

        let embed = new Discord.RichEmbed()
            .setTitle(`${msg.guild.name}'s Modules:`)
            .addField("\u200B", `Module: `, true)
            .addField('\u200B', `Enabled/Disabled: `, true)
            .addBlankField(true)
            .addField("\u200B", moduleNames, true)
            .addField("\u200B", moduleStatus, true)
        return msg.channel.send(embed); // Make sure we're not then greeted with an error for not including a change.
    }

    if(!args[0] && !args[1]) return msg.reply("ERR: You didn't not specify whether to set it to active or inactive.")

///////////////////////////////////////////////////////////////////////////////////////////////////////////

if(module == "lewd") // The module we want to disable/enable
{
    if(enable.some(word => action.toLowerCase().includes(word))) // If the second argument contained one of our keywords
    {
        db.enableLewdCommands(ID) // Try and enable it in the database
        .then(() => { // So it worked, lets create a fancy embed for it
            let embed = new Discord.RichEmbed()
                .setColor('#00FF00')
                .setDescription("The lewd module has successfully been enabled.") // Degenercy may now begin.
            msg.channel.send(embed) // So yeah.
        })
        .catch(dbERR) // Throw a generic error at the problem. Oh wait.
    }
    if(disable.some(word => action.toLowerCase().includes(word))) // exact same as above, but in reverse.
    {
        db.disableLewdCommands(ID) 
        .then(() => {
            let embed = new Discord.RichEmbed()
                .setColor('#00FF00')
                .setDescription("The lewd module has successfully been enabled.")
            msg.channel.send(embed)
        })
        .catch(dbERR)
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

if(module == "discovery") // The module we want to disable/enable
{
    if(enable.some(word => action.toLowerCase().includes(word))) // If the second argument contained one of our keywords
    {
        db.enableDiscoCommands(ID) // Try and enable it in the database
        .then(() => { // So it worked, lets create a fancy embed for it
            let embed = new Discord.RichEmbed()
                .setColor('#00FF00')
                .setDescription("The Discovery module has successfully been enabled.")
            msg.channel.send(embed) // So yeah.
        })
        .catch(dbERR) // Throw a generic error at the problem. Oh wait.
    }
    if(disable.some(word => action.toLowerCase().includes(word))) // exact same as above, but in reverse.
    {
        db.disableDiscoCommands(ID) 
        .then(() => {
            let embed = new Discord.RichEmbed()
                .setColor('#00FF00')
                .setDescription("The Discovery module has successfully been enabled.")
            msg.channel.send(embed)
        })
        .catch(dbERR)
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
}
module.exports.help = {
    name: "module"
}
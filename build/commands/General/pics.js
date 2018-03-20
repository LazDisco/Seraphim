import Discord from 'discord.js'; // Discord.JS for embeds
import winston from 'winston'; // Have a guuesssssssssssssssssss?
import snekfetch from 'snekfetch'; // HTTP here we comes
import { statusReport } from '../../processes/statusReport.js'

module.exports.run = async (msg, args, client, db, ID) => {
    let command = args[0]; // It's neater.

    if(command == "neko")
    {
        let baseURL = "https://nekos.life/api/v2/img/neko";
        snekfetch.get(baseURL).then((res) => {
            let embed = new Discord.RichEmbed()
            .setTitle("Neko:")
            .setImage(res.body.url)
            .setColor("#663399")
        msg.channel.send(embed)
        })
    }

    if(command == "cat")
    {
        let baseURL = "http://aws.random.cat/meow";
        snekfetch.get(baseURL).then((res) => {
            if(!res.body.file) return msg.channel.send("There appears to currently be an issue with the random.cat API. Please check again later.")
            let embed = new Discord.RichEmbed()
            .setTitle("Meow Cat:")
            .setImage(res.body.file)
            .setColor("#6688FF")
        msg.channel.send(embed)
        })
    }

    if(command == "headpat")
    {
        let baseURL = "https://nekos.life/api/v2/img/pat";
        snekfetch.get(baseURL).then((res) => {
            let embed = new Discord.RichEmbed()
            .setTitle(`Look over here! Someone just gave out some headpats, maybe there will be more?`)
            .setImage(res.body.url)
            .setColor("#339966")
        msg.channel.send(embed)
        })
    }

    if(command == "cuddle")
    {
        let baseURL = "https://nekos.life/api/v2/img/cuddle";
        snekfetch.get(baseURL).then((res) => {
            let embed = new Discord.RichEmbed()
            .setTitle("A special someone really earned that cuddle! :heart:")
            .setImage(res.body.url)
            .setColor("#FF9944")
        msg.channel.send(embed)
        })
    }
    if(command == "lewd")
    {
        if(!msg.channel.nsfw) return msg.reply("This is not the channel for such things. Think of the children! You should know better.")
        let report = statusReport(ID);
        if(report.lewd == true)
        {
            let baseURL = "https://nekos.life/api/v2/img/lewd";
            snekfetch.get(baseURL).then((res) => {
            let embed = new Discord.RichEmbed()
                .setTitle("Lewd? It will be our secret.")
                .setImage(res.body.url)
                .setColor("#FF9944")
            msg.channel.send(embed)
            })
        }
    }
}

module.exports.help = {
    name: "get"
}
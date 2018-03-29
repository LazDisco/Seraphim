/*
    Discord hook for the Stardust API
    Both this and the API were originally created by @Corile
    While there have been significant changes in areas
    It is impossible to deny that this wouldn't exist without his work.

    User Link: https://gitlab.com/MrHudson
*/

import snekfetch from 'snekfetch';
import winston from 'winston';
import { genericError } from "../../processes/statusReport";

const API = "http://stardust.imperiumfl.com/stardust/ids"

module.exports.run = async (msg, args, client, db, ID) => {
  
    if(!args[0]) 
    {
        msg.channel.send("Specify an argument.")
    }

    let nick = args[0]

    snekfetch.get(API+"/nick/"+nick).then((res) => {
        nick = nick.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}); // Make it auto uppercase the name
        let id = res.body; // The JSON content of the nick we selected

        let idShips = id.ships.join(", ") // All the ships, joined onto one line.
        var idType = ""; // Type of ID, converted to a more eye pleasing name
        var idLines = ""; // ID Lines, converted for better readability.

        if(id.type == "lawful") idType = "Lawful ID"
        else if(id.type == "unlawful") idType = "Unlawful ID"
        else if(id.type == "quasi-lawful") idType = "Quasi-Lawful ID";

        for (var element of id.lines)
        {
            idLines += "• " + element + "\n"
        }

        let idOutput =
`${nick}:
__**${id.name} ID**__ - ${idType}
${id.desc}

${idLines}
**Zone of Influence:** ${id.zoi}
**Permitted ships:** ${idShips}`
    
        msg.channel.send(idOutput)
    })
    .catch((err) => {
        winston.error(err)
        let error = genericError();
        msg.channel.send(error)
    })
}

module.exports.help = {
    name: "id"
}

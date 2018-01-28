/*
    This code is taken from Corile's Discord bot, Eli.
    It has been adjusted in places and the API it references as been updated.
    The sourcecode, however, belongs to Corile and credit belongs to him.
*/

import request from 'request'

const API = "http://stardust.imperiumfl.com/stardust/ids"

module.exports.run = async (msg, args, client, db, ID) => {

    if (!args[0]) {
        message.channel.send("Specify an argument.")
    }

    if (args[0] == "search") {
        if (args[1] && args[2]) {
            let param = args[1]
            let value = args
            value.splice(0, 3)
            value = value.join(" ")

            request(`${API}/search/${param}/${value}`, (err, res, body) => {
                console.log(`${API}/search/${param}/${value}`)
                if (err) throw err
                body = JSON.parse(body)

                let names = []
                for (each of body) {
                    let element = `${each.name} (*${each.nick}*)`
                    names.push(element)
                }

                names = names.join("\n")

                let output =
                    `${param} : ${value}:
Factions with **${param}** containing **${value}** are:

${names}
`
                message.channel.send(output, {
                    split: true
                }).catch(console.error)

            })
        }
    }

    if (args[0] == "nick") {
        let nick = args[1]

        request(API + "/nick/" + nick, (err, res, body) => {
            if (err) throw err
            console.log(API + "/nick/" + nick)
            let id = JSON.parse(body)

            let type = ""
            if (id.type == "lawful") type = "Lawful ID"
            else if (id.type == "unlawful") type = "Unlawful ID"
            else if (id.type == "quasi-lawful") type = "Quasi-Lawful ID"

            let lines = ""
            for (el of id.lines) {
                lines += "• " + el + "\n"
            }

            let ships = id.ships.join(", ")

            let output =
                `${nick}:
__**${id.name} ID**__ - ${type}
${id.desc}

${lines}
**Zone of Influence:** ${id.zoi}
**Permitted ships:** ${ships}`

            message.channel.send(output)

        })
    }
}

module.exports.help = {
    name: "id"
}
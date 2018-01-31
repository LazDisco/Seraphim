import winston from 'winston' // Winston for Logging

module.exports.run = async (msg, args, client, db, ID) => {

    // brigands only plox
    if (ID !== "356491798228631552") return msg.reply("ERR: This command is server restricted.")

    let input = msg.content.split(/\n+/g) // // Split data via new line
    let userID = msg.author.id; // ID of peson posting report

    let timestamp = Date.now() // Unix timestamp

    let shipName = input[1].replace(new RegExp('.*' + "Ship: "), '') // Remove everything after provided text
    let cargoName = input[2].replace(new RegExp('.*' + "Cargo: "), '') // Remove everything after provided text
    let cargoAmount = input[3].replace(new RegExp('.*' + "Amount: "), '') // Remove everything after provided text
    let screenshots = input[4].replace(new RegExp('.*' + "Screenshots: "), '') // Remove everything after provided text
    screenshots = screenshots.replace(new RegExp('\`.*'), '') // remove left over ` marks from the code block
    // Screenshots will have left over stuff from the report format

    db.createEpiniacReport(userID, shipName, cargoName, cargoAmount, screenshots, timestamp)
        .then((res) => {
            const reportKey = res.generated_keys[0];
            winston.info(`Created report ${reportKey} for @${msg.author.username} in ${msg.guild.name}`);

            msg.channel.send(`:white_check_mark: Success. Report added to db with key: ${reportKey}`);
        })
        .catch((err) => {
            msg.channel.send(`:x:\n ERR: Failed to add to the database. See log for information.`)
            winston.error(err)
        })
}

module.exports.help = {
    name: "epiniac"
}
import winston from 'winston' // Winston for Logging

module.exports.run = async (msg, args, client, db, id) => {

    // brigands only plox
    if (id !== "372846495608602624") return msg.reply("ERR: This command is server restricted.")

    let input = msg.content.split(/\n+/g) // Our data
    let userID = msg.author.id; // ID of peson posting report

    let timestamp = Date.now()

    let shipName = input[1].replace(new RegExp('.*' + "Ship: "), '')
    let cargoName = input[2].replace(new RegExp('.*' + "Cargo: "), '')
    let cargoAmount = input[3].replace(new RegExp('.*' + "Amount: "), '')
    let screenshots = input[4].replace(new RegExp('.*' + "Screenshots: "), '')
    screenshots = screenshots.replace(new RegExp('\`.*'), '')
    // Screenshots will have left over stuff from the report format

    db.createEpiniacReport(userID, shipName, cargoName, cargoAmount, screenshots, timestamp)
        .then((res) => {
            const reportKey = res.generated_keys[0];
            winston.info(`Created report ${reportKey} for @${msg.author.username} in ${msg.guild.name}`);

            msg.channel.send(`:white_check_mark: Success. Report added to db with key: ${reportKey}`);
        })
    //.then(() => msg.channel.send(`:white_check_mark:\nInfo: Sucessfully added to the database.`))
    //.catch(() => msg.channel.send(`:x:\n ERR: Failed to add to the database. See log for information.`))
}

module.exports.help = {
    name: "epiniac"
}
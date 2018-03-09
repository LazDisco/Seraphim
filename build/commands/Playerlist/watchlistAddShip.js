import winston from 'winston'; // Winston for logging

module.exports.run = async (msg, args, client, db, ID) => {

    if (args.length < 2) return msg.reply("ERR: Too few parameters. Plase provide a valid tag and name (max three words).")

    let one = args.shift(); // Take args[1] and make it its own value
    let two = args.join(' '); // Take everything else (args[2-4]), make it its own value.

    db.addShipToWatchList(ID, one, two)
        .then((res) => {
            const reportKey = res.generated_keys[0];
            winston.info(`Created watchlist ${reportKey} for @${msg.author.username} in ${msg.guild.name}`);

            msg.channel.send(`:white_check_mark: Success. **${one}** - **${two}** has been added to the database with the following key: ${reportKey}.
Note: You do not need to remember this code. You can remove a faction at any time with list.shipremove name`);
        })
        .catch((err) => {
            msg.channel.send(`:x:\n ERR: Failed to add to the database. See log for information.`)
            winston.error(err)
        })
}

module.exports.help = {
    name: "list.shipadd"
}
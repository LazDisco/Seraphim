import sendArray from '../processes/sendArray.js' // We need this to convert our db information
import format from 'string-format' // We also need this for that same reason
import moment from 'moment'; // Our timestamp is a string of numbers, lets fix that.
import winston from 'winston'; // Turns out I wasn't getting any errors because I forgot to import winston.
// What a waste of 3 hours. Kill me. Just Monika Just Monika Just Monika Just Monika Just Monika Just Monika Just Monika

process.on('unhandledRejection', (reason, p) => {
    winston.debug('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // We want to log what happens when we have an unhandled Promise.
});

const reportTemplate = require("../defaults.json").reportTemplate // Have a guess

// String-format documentation: https://www.npmjs.com/package/string-format - PIN

module.exports.run = async (msg, args, client, db, id) => {
    // brigands only plox
    if (id !== "372846495608602624") return msg.reply("ERR: This command is server restricted.")

    const formatReport = (res) => {
        const {
            reporter: userID,
            ship: shipName,
            cargo: cargoName,
            amount: cargoAmount,
            screenshot: screenshots,
            timestamp: time
        } = res;

        const dateFormat = "DD-MM-YY mm:HH"; // format the date how normal people do. (not American)
        const member = msg.guild.members.get(userID); // We need to use the find the user object via id. we can't backtrack.

        return format(reportTemplate, member ? member.user.tag : userID, shipName, cargoName, cargoAmount, screenshots,
            moment(time).format(dateFormat));
        // I cannot explain this in a few words. For information look at documentation at the top.
        // Links to reportTemplate is in defaults.json
    };

    const dbERR = (err) => { // stupid way of saying if(err) throw (err)
        winston.error(err)
        msg.channel.send("ERR: Something has gone wrong. See log file for details.")
    }

    if (args[0] == "recent") {
        // Make sure that the value they provide is a valid int (no decimal or words etc)
        if (args[1].isInteger == false) return msg.reply("ERR: User did not specify a valid int value.")
        if (args[1] > 10) return msg.reply("ERR: User did not keep value between 1-10.") // obv
        var reportAmount = parseInt(args[1])
        db.getEpiniacRecentReports(reportAmount) // Get the amount of reports specified
            .then((res) => {
                sendArray(res.map(formatReport), msg.channel);
            })
            .catch(dbERR)
    }
    // Count overall reports in the database
    if (args[0] == "count") {
        db.countEpiniacReports()
            .then((count) => msg.channel.send(`The Epiniac Datahub currently has a total of ${count} shipping reports.`))
            .catch(dbERR)
    }

    // Count reports from specific person
    if (args[0] == "count.id") {
        db.countEpiniacIndividualReports(msg.author.id)
            .then((count) => msg.channel.send(`The Epiniac Datahub currently has a total of ${count} shipping reports submitted by ${msg.author.username}`))
            .catch(dbERR)
    }
    // Get report by specific ID
    if (args[0] == "get") {
        db.getEpiniacReport(args[1])
            .then((res) => {
                if (res) {
                    msg.channel.send(formatReport(res));
                } else {
                    msg.channel.send("ERR: Cannot find selected report.");
                }
            })
            .catch(dbERR)
    }

    /* if (args[0] == "list") {
         if (args[1] == "id") {

         }
         if (args[1] == "ship") {

         }
         if (args[1] == "cargo") {

         }
     }*/
}

module.exports.help = {
    name: "info.epiniac"
}
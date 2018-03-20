import ini from 'ini'; // I want to see how useful this ini parser is, best way to test.
import fs from 'fs';
import { dbERR } from "../../processes/statusReport";
import { statusReport } from "../../processes/statusReport";

const inistring = './build/settings/rules.ini' // Fs loads strings from index.js

module.exports.run = async (msg, args, client, db, ID) => {

    let report = await statusReport(ID);
    if(report.Discovery == false) return msg.reply("The Discovery module is currently disabled on this server.")

    let rule = args[0];
    if(!rule) return msg.reply("ERR: You didn't request a rule. Please select a rule by using it's numbers. E.g. 'rule 1.1'")
    if(!parseFloat(rule)) return msg.reply("ERR: What you supplied was not a valid rule number.")
    
    var file = ini.parse(fs.readFileSync(inistring, 'utf-8'))
    if(Object.keys(file.Rules).includes(rule))
    {
        return msg.channel.send(`Rule ${rule}:
\`\`\`css
${file.Rules[rule]}\`\`\` `);
    }

    msg.channel.send("ERR: Cannot find rule specified.")

}

module.exports.help = {
    name: "rule"
}
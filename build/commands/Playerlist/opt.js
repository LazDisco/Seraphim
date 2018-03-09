module.exports.run = async (msg, args, client, db, ID) => {
    if(!args) msg.reply("ERR: You did not specify any arguments.")

    let guildMember = msg.member;

    if(args[0] == "in")
    {
        db.r.table('playerlist').get(ID).getField('rolename').run(async function (err, result) {
            try {
                var role = msg.guild.roles.find('name', result);
                guildMember.addRole(role, "Opt in for shadow tag")
                msg.channel.send(`You have opted in for the ${result} role`)
            } catch (error) {
                msg.channel.send(`ERR: You already have the ${result} role! (Or there is another error, poke Laz if that is the case)`)
            }
        })
    }

    if(args[0] == "out")
    {
        db.r.table('playerlist').get(ID).getField('rolename').run(async function (err, result) {
            try {
                var role = msg.guild.roles.find('name', result);
                guildMember.removeRole(role, "Opted out for shadow tag")
                msg.channel.send(`You have opted out for the ${result} role`)
            } catch (error) {
                msg.channel.send(`ERR: You don't have the ${result} role! (Or there is another error, poke Laz if that is the case)`)
            }
        })
    }

}

module.exports.help = {
    name: "opt"
}
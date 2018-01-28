module.exports.run = async (msg, args, client, db, ID) => {

    const user = msg.mentions.users.first();
    const amount = !!parseInt(msg.content.split(' ')[1]) ? parseInt(msg.content.split(' ')[1]) : parseInt(msg.content.split(' ')[2])
    if (!amount) return msg.reply('Must specify an amount to delete!');
    if (!amount && !user) return msg.reply('Must specify a user and amount, or just an amount, of msgs to purge!');
    msg.channel.fetchmsgs({
        limit: amount,
    }).then((msgs) => {
        if (user) {
            const filterBy = user ? user.id : Client.user.id;
            msgs = msgs.filter(m => m.author.id === filterBy).array().slice(0, amount);
        }
        msg.channel.bulkDelete(msgs, true).catch(error => console.log(error.stack));
    });
}

module.exports.help = {
    name: "purge"
}
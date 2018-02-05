module.exports.run = async (msg, args, client, db, ID) => {
    let user = msg.mentions.users.first();
    let amount = !!parseInt(msg.content.split(' ')[1]) ? parseInt(msg.content.split(' ')[1]) : parseInt(msg.content.split(' ')[2])
    amount = amount+1
    if (!amount) return msg.reply('Must specify an amount to delete!');
    if (!amount && !user) return msg.reply('Must specify a user and amount, or just an amount, of messages to purge!');
    
    msg.channel.fetchMessages({
        limit: amount,
    }).then((messages) => {
        if (user) {
            const filterBy = user ? user.id : Client.user.id;
            messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
        }
        msg.channel.bulkDelete(messages).catch(error => console.log(error.stack));
    });
}

module.exports.help = {
    name: "purge"
}
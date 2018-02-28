module.exports.run = async (msg, args, client, db, ID) => {
    let sender = msg.member;
    if (msg.author.id !== secrets.ownerID || !sender.hasPermission('MANAGE_MESSAGES')) return msg.reply("You may not do this.")    
    
    let user = msg.mentions.users.first();
    let amount = !!parseInt(msg.content.split(' ')[1]) ? parseInt(msg.content.split(' ')[1]) : parseInt(msg.content.split(' ')[2])
    amount = amount+1 // So we have one more to include the message itself.

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
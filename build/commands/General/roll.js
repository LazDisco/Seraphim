
/*
    I found this code on my old bot server
    I have no idea where it came from, if I wrote it or I stole it
    I converted it to work with my current bot
    but frankly, I'm clueless to where it originated

    If I didn't make this, sorry to whoever I stole it from since I cannot credit you.
    Truly, I am. 
    (I'll be honest, I cannot even understand what this means in places. It could easily be both by early work, or something I found)
*/

module.exports.run = async (msg, args, client, db, ID) => {
    const messageWords = msg.content.split(' ');
    const rollFlavor = messageWords.slice(2).join(' ');

    if (messageWords.length === 1) 
    {
        return msg.reply(
            (Math.floor(Math.random() * 6) + 1) + ' ' + rollFlavor
        );
    }
    let sides = messageWords[1];
    let rolls = 1;

    if (!isNaN(messageWords[1][0] / 1) && messageWords[1].includes('d')) 
    {
        rolls = messageWords[1].split('d')[0] / 1;
        sides = messageWords[1].split('d')[1];
    } 

    else if (messageWords[1][0] == 'd') 
    {
        sides = sides.slice(1);
    }
    sides = sides / 1;
    if (isNaN(sides) || isNaN(rolls)) 
    {
        return;
    }

    if (rolls > 1) 
    {
        const rollResults = [];
        for (let i = 0; i < rolls; i++) 
        {
            rollResults.push(Math.floor(Math.random() * sides) + 1 + '\n');
        }

        const sum = rollResults.reduce((a, b) => a + b);
        return msg.reply(`You rolled the following:\n ${rollResults.toString()} ${rollFlavor}`);
    } 
    else 
    {
        return msg.reply((Math.floor(Math.random() * sides) + 1) + ' ' + rollFlavor);
    }
};
module.exports.help = {
    name: "roll"
}
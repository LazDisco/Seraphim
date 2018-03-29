import Discord from 'discord.js'; // Discord.JS for embeds
import winston from 'winston'; // Have a guuesssssssssssssssssss?
import { genericError } from "../../db/JS/database.js";

module.exports.run = async (msg, args, client, db, ID) => {

    let one = args.shift();
    let two = args.join(' ');
    let guildMember = msg.member;
    var valid = false;

    if(!msg.guild.me.hasPermission('MANAGE_ROLES')) return msg.reply("ERR: Bot doesn't have manage roles permission.")
    
    if(one == undefined) return msg.reply("ERR: You didn't supply the correct parameters.")

    if (one == "not") // Command to remove from self asignable role
    {
        if (two == undefined) return msg.reply("ERR: You didn't supply a role to remove.")

        var bool = await verifyEntries(two)
        if(await bool == true)
        {
            let role = msg.guild.roles.find('name', two);
            if(role == undefined) return msg.reply("ERR: The role provided does not exist on this server, or is not self-asignable.")

            bool = await checkRoleTree(role)
            if(bool == false) return msg.reply("ERR: The selected role is below the bot role in the role tree.")

            var embed = new Discord.RichEmbed()
                .setColor('#00FF00')
                .setDescription(`You have successfully removed yourself from the ${role} role.`);

            guildMember.removeRole(role, `${msg.author.username}#${msg.author.discriminator} removed the ${two} role`);
            return msg.channel.send(embed);                
        }
    }

    if (one == "list") 
    {
        valid = true;
        let list = await getEntries();
            return msg.channel.send({
                embed: await formatEntries(await list)
            })
    }

    if (one == "set") 
    {
        valid = true;
        if (!guildMember.hasPermission("ADMINISTRATOR")) return msg.reply("You must be set to Admin to use this command.");
        if (two == undefined) return msg.reply("ERR: You didn't supply a role to set.")

        if (msg.guild.roles.find('name', two) == undefined) return msg.reply("ERR: The role you supplied was is not a role within this guild.")

        db.addRole(ID, two)
            .then((res) => {
                console.log(res)
                let embed = new Discord.RichEmbed()
                    .setColor('#00FF00')
                    .setDescription(`${two} has been added to the list of self-asignable roles`)

                return msg.channel.send(embed)
            })
            .catch(winston.error)
    }

    if (one == "remove") 
    {
        valid = true;
        if (!guildMember.hasPermission("ADMINISTRATOR")) return msg.reply("You must be set to Admin to use this command.");
        if (two == undefined) return msg.reply("ERR: You didn't supply a role to set.")

        db.removeRole(ID, two)
            .then((res) => {
                console.log(res)
                let embed = new Discord.RichEmbed()
                    .setColor('#00FF00')
                    .setDescription(`${two} has been removed to the list of self-asignable roles`)

                return msg.channel.send(embed)
            })
            .catch(winston.error)
    }
    if(valid == false)
    {
        let bool = await verifyEntries(one)
        if(await bool == true)
        {
            let role = msg.guild.roles.find('name', one);
            if(role == undefined) return msg.reply("ERR: The role provided does not exist on this server, or is not self-asignable.")
            
            bool = await checkRoleTree(role)
            if(bool == false) return msg.reply("ERR: The selected role is below the bot role in the role tree.")

            var embed = new Discord.RichEmbed()
                .setColor('#00FF00')
                .setDescription(`You have successfully given yourself the ${role} role`);

            guildMember.addRole(role, `${msg.author.name} added the ${one} role`);
            return msg.channel.send(embed);                
        }
    }

    async function checkRoleTree(role) {
        if(msg.guild.me.highestRole.comparePositionTo(role) <= 0)
        {
            return false
        }
        return true;
    }
    
    async function getEntries() {
        return db.getRoles(ID)
            .then((result) => {
                if (result[0] == undefined) return;
                var format = Object.keys(result[0]).map(function (element) {
                    return {
                        'name': element
                    };
                });
                return format;
            })
            .catch(winston.error)
    }

    async function verifyEntries(roleName) {
        let list = await getEntries();
        if(list == undefined) return false;
        if (list.filter(lst => (lst.name === roleName))) {
            return true;
        }
    }

    async function formatEntries(format)
    {
        if(format == undefined) return noEntries()
        
        let roles = format.reduce((accumulator, set) => {
            return accumulator + `${set.name}\n`
        }, '')                                            
        
        let time = new Date();
        var embed = new Discord.RichEmbed() // New embed
            .setTitle(`List of self-asignable roles:`)
            .setColor('#663399') // Royal Purple - Brigand colour
            .setTimestamp(time) // What time is it?
            .addField("Role list:", "Role:\n" + roles, true)
        return embed
    }

    async function noEntries()
    {
        var embed = new Discord.RichEmbed() // New embed
            .setDescription(`There are no self-asignable roles currently.`)
            .setColor('#FF0000')
        return embed
    }
}

module.exports.help = {
    name: "iam"
}
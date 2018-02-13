# The Brgiand Bot
The Brigand Bot is a discord bot that uses rethinkdb and Discord.JS (as well as a few other utilities) to upload and store data related to Epiniac. Along side this, it also has a fully functioning playerlist and various helpful moderation functions. Written in NodeJS Version 9.4.0.

It relies on the following external modules to work correctly:

 - [Bluebird (3.5.1)](https://www.npmjs.com/package/bluebird)
 - [Discord.JS (11.3.0)](https://discord.js.org/)
 - [Discoverygc (1.0.1)](https://github.com/mrhuds0n/discovery)
 - [FS](https://www.npmjs.com/package/file-system)
 - [Moment (2.20.1)](https://www.npmjs.com/package/moment)
 - [Require-dir (0.3.2)](https://www.npmjs.com/package/require-dir)
 - [Rethinkdbdash (2.3.31)](https://www.npmjs.com/package/rethinkdbdash)
 - [String-format (0.5.0)](https://www.npmjs.com/package/string-format)
 - [Winston (2.4.0)](https://www.npmjs.com/package/winston)
(these can all be installed by running npm install in the console)

In addition to these, you'll also require the [rethinkdb executable](https://www.rethinkdb.com/docs/install/windows/) (Windows) or the [rethinkdb package](https://www.rethinkdb.com/docs/install/ubuntu/) (Linux).

----------
## Setting up:

Once you have node installed, you can get around to setting up the bot. For the bot to work, you'll only need a few main things to be done. Step one would be to go to the site for [Discord](https://discordapp.com/developers/applications/me) and create a bot application. After that is sorted, copy the token to the clipboard.

Now, what we are going to want to do is create a new .json file in the build folder of our project. Call it the following:

> secrets.json

Inside the file you want to put in three fields. These are "ownerID", "token", & "apiKey". ![Like so.](https://i.imgur.com/X2e0yvO.jpg)
You put your user account's ID in ownerID, the token you copied from Discord in the token section, and the API key from Discovery in the apiKey section. If you do not have an API key / do not want to use the playerlist - you can simply delete the "reload.js" command and remove the functions from the ready event to disable it completly.

After both this and rethinkdb is setup, you can start the bot. Using either 'forever' or 'pm2' is recomended, but you can always just use 'node index.js' to get started.
# Command Overview:
(More information can be obtained by using the |help command)

## Rethinkdb Commands
(Commands that interface with the database)

 - prefix
 - addguild
 - epiniac
 - info.epiniac
 - tag
 - factionadd
 - factionremove
 - shipadd
 - shipremove
 ## General Commands:
 
 - laz
 - help
 - reload
 - ping
 - purge

(Will add more information and stuff later. I think)

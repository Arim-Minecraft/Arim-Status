const Discord = require('discord.js');

const client = new Discord.Client();

var request = require('request');
var mcCommand = '/status'; // Command for triggering
var mcIP = 'arim.space'; // Your MC server IP or hostname address
var mcPort = 25565; // Your MC server port (25565 is the default) 


client.on('message', message => {
    if (message.content === mcCommand) {
        var url = 'http://mcapi.us/server/status?ip=' + mcIP + '&port=' + mcPort;
        request(url, function(err, response, body) {
            if(err) {
                console.log(err);
                return message.reply('Error getting Minecraft server status.');
            }
            body = JSON.parse(body);
            var status = 'Arim is currently offline :(';
            if(body.online) {
                status = 'Arim is **online** :D \n';
                if(body.players.now) {
                    status += '**' + body.players.now + '** current playing!';
                } else {
                    status += 'but no one is playing :(';
                }
            }
            message.reply(status);
        });
    }
});

 

client.login(process.env.BOT_TOKEN);

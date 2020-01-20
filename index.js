const Discord = require('discord.js');

const client = new Discord.Client();

const request = require('request');
const statusCmd = '/status';
const queryCmd = '/query';
const mcIP = 'arim.space';
const mcPort = 25565;

const Query = require("minecraft-query");

const query = new Query(mcIP, mcPort, { timeout: 10000 });

function checkMcServer () {
  query.connect(function (err) {
    if (err) {
      console.error(err);
    } else {
      query.full_stat(fullStatBack);
    }
  })
}

function fullStatBack (err, stat) {
  if (err) {
    console.error(err);
  }
  console.log('%s>fullBack \n', new Date(), stat);
}

setInterval(function () {
  checkMcServer()
}, 5000);


client.on('message', message => {
    if (message.content === statusCmd) {
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
    } else if (message.content === queryCmd) {
        message.reply('Working on this...');
        
    }
});

 

client.login(process.env.BOT_TOKEN);

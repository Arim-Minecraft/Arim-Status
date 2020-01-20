const Discord = require('discord.js');

const client = new Discord.Client();

const https = require('https');

const request = require('request');
const statusCmd = '/status';
const mcIP = 'arim.space';
const mcPort = 25565;

const queryCmd = '/query';
const Query = require("minecraft-query");
const query = new Query({host: mcIP, port: mcPort, timeout: 10000 });

let playerCount = 0;

let website = true;

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
    }
});
//guild id
//568772431347449867
//in-game channel id
//629826592717144095
//website channel id
//668134910221090858

client.login(process.env.BOT_TOKEN);

function sendMessage(msg) {
  client.guilds.get("568772431347449867").channels.get("629826592717144095").send(msg);
}

function sendWebsiteMessage(msg) {
  client.guilds.get("568772431347449867").channels.get("668134910221090858").send(msg);
}

function handleQuery(res) {
    const current = res.online_players;
    if (current != playerCount) {
      playerCount = current;
      if (playerCount == 0) {
        sendMessage("No more players online :(");
      } else {
        sendMessage("There are now " + playerCount + " players online.");
      }
    }
}

function handleDown(ex) {
  if (playerCount != -1) {
    playerCount = -1;
    sendMessage("Uh-oh! Is the server down?");
  }
}

function checkWebsite() {
  https.get('https://www.arim.space/', function(res) {
  if (res.statusCode != 200) {
    if (website) {
      sendWebsiteMessage("The website just went down!");
    }

  } else if (!website) {
    sendWebsiteMessage("The website is back up!");
  }
  res.on('data', function(d) {

  });

  }).on('error', function(e) {
    if (website) {
      sendWebsiteMessage("Failed checking website status.");
    }
  });

}

async function checkAll() {
  query.basicStat().then(success => handleQuery(success)).catch(ex => handleDown(ex));
  checkWebsite();
}

setInterval(function() { checkAll(); }, 3000);

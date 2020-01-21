const Discord = require('discord.js');

const client = new Discord.Client();

const https = require('https');

//const request = require('request');
const statusCmd = '/status';
const mcIP = 'arim.space';
const mcPort = 25565;

const Query = require("minecraft-query");
const query = new Query({host: mcIP, port: mcPort, timeout: 10000 });

let playerCount = 0;

let website = true;

client.on('message', message => {
    if (message.content === statusCmd) {
      checkAll();
      var webStatus = "The website is **online**.";
      var serverStatus = "The server is **online**.";
      if (!website) {
        webStatus = "The website is **down**.";
      }
      if (playerCount == -1) {
        serverStatus = "The server is **down**.";
      } else {
        serverStatus += " Players: " + playerCount;
      }
      message.reply("\n" + serverStatus + "\n" + webStatus);
        /*
        var url = 'http://mcapi.us/server/status?ip=' + mcIP + '&port=' + mcPort;
        request(url, function(err, response, body) {
            if(err) {
                console.log(err);
                return message.reply('Error getting Minecraft server status.');
            }
            body = JSON.parse(body);
            var status = 'Arim is down! Oh no!';
            if(body.online) {
                status = '\nArim is online - ';
                if(body.players.now) {
                    status += '**' + body.players.now + '** current playing!';
                } else {
                    status += 'but no one is playing :(';
                }
            }
            message.reply(status);
        });
        */

    }
});
/*
guild id
568772431347449867
in-game channel id
629826592717144095
website channel id
668134910221090858
*/

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
        sendMessage("No players online");
      } else {
        sendMessage(playerCount + " players online");
      }
    }
}

function handleDown(ex) {
  if (playerCount != -1) {
    playerCount = -1;
    sendMessage("Uh-oh! The server may be down.");
  }
}

function checkServer() {
  query.basicStat().then(success => handleQuery(success)).catch(ex => handleDown(ex));
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
  checkServer();
  checkWebsite();
}

setInterval(function() { checkAll(); }, 60000);

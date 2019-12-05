const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://.glitch.me/`);
}, 280000);

const Discord = require('discord.js');  
const bot = new Discord.Client();  
const {Client, Attachment} = require('discord.js');
const moment = require('moment');
const zalgo = require('zalgolize');  
const math = require('math-expression-evaluator');   
const figlet = require('figlet');   
const fs = require('fs'); 
const ytdl = require('ytdl-core');
const ms = require('ms');  
const PREFIX = '!gc'

var version = '1.0.3';

var servers = {};

bot.on('ready', () => {
    console.log('The bot is online!');
    bot.user.setActivity('GC Server | !gchelp', {
        type: "WATCHING"
    }).catch(console.error);
})

bot.on('message', message => {

    let args = message.content.substring(PREFIX.length).split(" ");

    switch(args[0]) {
        case 'ping':
            message.channel.sendMessage('pong').then(message.react('🏓'))
            break;
        case 'info':
            if(args[1] === 'version') {
                message.channel.sendMessage('version' + version);
            } else {
                message.channel.sendMessage('Put word `version` ')
            }
            break;
        case 'clear':
            if(!message.member.roles.find(r => r.name === "MANAGMENT")) return message.reply('You do not have perms')
            .then(msg => msg.delete(4000))
            if(!args[1]) return message.reply('Please put number of messages')
            message.channel.bulkDelete(args[1]);
            message.channel.sendMessage("", {embed: {
          title: "Chat has been deleted",
          color: 0x40e0d0, 
          footer: {
            
          }
        }}).then(msg => {msg.delete(5000)});
                            
            break;
        case 'kick':
            if(!message.member.roles.find(r => r.name === "MANAGMENT")) return message.reply('You do not have perms')
            .then(msg => msg.delete(4000))
            const user = message.mentions.users.first();

            if(user) {
                const member = message.guild.member(user);

                if(member) {
                    member.kick('You have been Kicked').then(() => {
                        message.reply(`Sucessfuly kicked ${user.tag}`)
                    }).catch(err => {
                        message.reply('I was unable to Kick the member');
                        console.log(err);
                    });
                } else {
                    message.reply("That user isn\'t in this guild")
                }

            } else {
                message.reply('You need to specify a person!')
            }


            break;
        case 'ban':
            if(!message.member.roles.find(r => r.name === "MANAGMENT")) return message.reply('You do not have perms')
            .then(msg => msg.delete(4000))
        
            const User = message.mentions.users.first();

            if(User) {
                const member = message.guild.member(User);

                if(member) {
                    member.ban({ ression: 'You have been banned!' }).then(() => {
                        message.reply(`Sucessfuly Bannned ${User.tag}`)
                    })

                } else {
                    message.reply("That user isn\'t in the guild")
                }

            } else {
                message.reply('You need to specify a person!')
            }

            break;
        case 'mute':
            if(!message.member.roles.find(r => r.name === "MANAGMENT")) return message.reply('You do not have perms')
            .then(msg => msg.delete(4000))
            let person = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1])) 
            if(!person) return message.reply('Please tag member on this serevr')
        
            let mainrole = message.guild.roles.find(role => role.name === "MEMBER")
            let muterole = message.guild.roles.find(role => role.name === "MUTED")
            
            if(!muterole) return message.reply('No mute role exist')
        
            let time = args[2]

         if(!time){
            return message.reply('Please specify time')
         }
         person.removeRole(mainrole)
         person.addRole(muterole)

         message.channel.send(`@${person.user.tag} has now been muted🤐 for ${ms(ms(time))}`)

          setTimeout(function(){
            person.addRole(mainrole)
            person.removeRole(muterole)
            message.channel.send(`@${person.user.tag} has now been unmuted`)
         }, ms(time))

            break;
        case 'play':


            function play(connection, message){
                var server = servers[message.guild.id];

                server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

                server.queue.shift();
                server.dispatcher.on("end", function(){
                    if(server.queue[0]){
                        play(connection, message);
                    }else{
                        connection.disconnect();
                    }
                });
            }


            if(!args[1]){
                message.channel.send("You need to provide a link!")
                return;
            }    
            
            if(!message.member.voiceChannel){
                message.channel.send("You must be in a voiceChannel!")
                return;
            }
            
            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
                play(connection, message);
            })


            break;

        case 'skip':
            var server = servers[message.guild.id];
            if(server.dispatcher) server.dispatcher.end();
            message.channel.send("Skipping").then(message.react('⏭️'))
            break; 
            
        case 'stop':
            var server = servers[message.guild.id];
            if(message.guild.voiceConnection){
                for(var i = server.queue.length -1; i >=0; i--){
                    server.queue.splice(i, 1);
                }

                server.dispatcher.end();
                message.channel.send("Ending the queue!").then(message.react('🛑'))
                
            }
            
            if(message.guild.connection) message.guild.voiceConnection.disconnect();

            break;
      case 'thats':
        message.channel.send('what she said ').then(message.react('😂'))
        break;
        //help members to know how commands work
        case 'help':
            const help = new Discord.RichEmbed()
            .setTitle('Commands you can use')
            .setColor(0x40e0d0)
            .setDescription('This commands need prefix `help `  `ping`  `info`')
            .addField('MODS commands', '`clear`  `kick`  `ban`  `mute` `mutechannel` `unmutechannel`')
            .addField('This commands don\'t need prefix', '`avatar`   `HELLO`')
            .addField('Music commands', '`play`  `skip`  `stop` {play} command must contain link!' )
            .addField('If you want to know about spacific command', '`!gchelp<command>`')
            message.channel.sendEmbed(help); 
            break;
        case 'helpmute':
           const helpmute = new Discord.RichEmbed()
           .setTitle('How to use mute command!')
           .addField('to mute a member', '`!gcmute <@member> <time>`' )
           .setColor(0x40e0d0)
           message.channel.sendEmbed(helpmute);
           break;
      case 'helpkick':
        const helpkick = new Discord.RichEmbed()
        .setTitle('How to Kick a member!')
        .addField('Just type like this', '`!gckick <@member>`')
        .setColor(0x40e0d0)
        message.channel.sendEmbed(helpkick);
        break;
      case 'helpban':
        const helpban = new Discord.RichEmbed()
        .setTitle('how to Ban a member!')
        .addField('just type like this', '`!gcban <@member>`')
        .setColor(0x40e0d0)
        message.channel.sendEmbed(helpban)
        break;
      case 'helpmutechannel':
        const hmc = new Discord.RichEmbed()
        .setTitle('mutechannel command')
        .setDescription('the mod can use this command to mute the whole chat ')
        .setColor(0x40e0d0)
        .addField('you can mute any channel like this', '`!gcmutechannel`')
        message.channel.sendEmbed(hmc)
        break;
      case 'helpunmutechannel':
        const humc = new Discord.RichEmbed()
        .setTitle('unmutechannel command')
        .setColor(0x40e0d0)
        .addField('type this to unmute channel', '`!gcunmutechannel`')
        message.channel.sendEmbed(humc)
        break;
    //another commands with bot.on(message) sitiuation
    }

    if(message.content === 'HELLO'){
        message.channel('HELLO world!').then(message.react('👋'))
    }
    
});
bot.on('message', message => {
  const PREFIX = "!gc";
       if(message.content === PREFIX + "mutechannel") {
                           if(!message.channel.guild) return message.reply('** This command only for servers**');

   if(!message.member.roles.find(r => r.name === "MANAGMENT")) return message.reply('You do not have perms')
              message.channel.overwritePermissions(message.guild.id, {
            SEND_MESSAGES: false

              }).then(() => {
                  message.reply("**The chat has been muted🤐**")
              });
                }

    if(message.content === PREFIX + "unmutechannel") {
                        if(!message.channel.guild) return message.reply('** This command only for servers**');

   if(!message.member.roles.find(r => r.name === "MANAGMENT")) return message.reply('You do not have perms')
              message.channel.overwritePermissions(message.guild.id, {
            SEND_MESSAGES: true

              }).then(() => {
                  message.reply("**The chat has been unmuted🙂**")
              });
    }
       
});
bot.on('message', message => { 
                                if(!message.channel.guild) return;
                        if (message.content.startsWith(PREFIX + 'ping')) {
                            if(!message.channel.guild) return;
                            var msg = `${Date.now() - message.createdTimestamp}`
                            var api = `${Math.round(bot.ping)}`
                            if (message.author.bot) return;
                        let PING = new Discord.RichEmbed()
                        .setAuthor(message.author.username,message.author.avatarURL)
                        .setColor(0x40e0d0)
                        .addField('**Time Taken:**',msg + " ms :signal_strength: ")
                        .addField('**WebSocket:**',api + " ms :signal_strength: ")
                        .setTimestamp()
        message.channel.sendEmbed(PING);
     }
});
bot.on('message', message => {
    if (message.content.startsWith("avatar")) {
if(!message.channel.guild) return;
        var mentionned = message.mentions.users.first();
    var client;
      if(mentionned){
          var client = mentionned; } else {
          var client = message.author;
      }
        const avtr = new Discord.RichEmbed()
                           .addField('Requested by:', "<@" + message.author.id + ">")
        .setColor(0x40e0d0)
        .setImage(`${client.avatarURL}`)
        .setTimestamp()
      message.channel.sendEmbed(avtr);
    }
});

bot.on('message', message => {
   if (message.content.startsWith("what is my age")) {
                if(!message.channel.guild) return message.reply('** This command only for servers**');
 const age = ["Who cares any way!😒" ,"I'm sorry i don't know your age!😔" ,"Even you don't know your age how can i know it!🤣", "The age is not important, hurt is important♥️"]
  var ge = new Discord.RichEmbed()
  .setColor(0x40e0d0) 
 .addField('i will say that' ,
  `${age[Math.floor(Math.random() * age.length)]}`)
  message.channel.sendEmbed(ge);
    }
});
bot.login(process.env.TOKEN);

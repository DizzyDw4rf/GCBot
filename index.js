const Discord = require('discord.js');
const {Client, Attachment} = require('discord.js');
const bot = new Discord.Client();
const ms = require('ms');
const ytdl = require('ytdl-core');

const token = 'Your_secret_token';

const PREFIX = '!gc';

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

         message.channel.send(`@${person.user.tag} has now been muted for ${ms(ms(time))}`)

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
        case 'help':
            const embed = new Discord.RichEmbed()
            .setTitle('Commands you can use')
            .setColor(0x40e0d0)
            .setDescription('This commands need prefix `help `  `ping`  `info`')
            .addField('MODS commands', '`clear`  `kick`  `ban`  `mute`')
            .addField('This commands don\'t need prefix', '`avatar`   `HELLO`')
            .addField('Music commands', '`play`  `skip`  `stop` {play} command must contain link!' )
            message.channel.sendEmbed(embed); 
            break;
        case 'helpmute':
            const helpmute = new Discord.RichEmbed
            .setTitle
            break;       
         
    }   

    if(message.content === 'avatar'){
        message.reply(message.author.avatarURL);
    }

    if(message.content === 'HELLO'){
        message.reply('HELLO world!').then(message.react('👋'))
    }
    if(message.content === 'what is my age'){
        message.reply('who cares any way!')
    }
    
});

bot.login(token);

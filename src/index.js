//REQUIREMENTS
require('dotenv').config()
const {
    Client,
    REST,
    Routes,
    SlashCommandBuilder,
    PermissionFlagsBits,
    IntentsBitField,
    Events,
    GatewayIntentBits,
    EmbedBuilder,
    PermissionsBitField,
    MessageManager,
    Embed,
    ChannelType,
    Collection,
    Message,
    messageLink } = require('discord.js');
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})
const axios = require('axios');
const fetch = require('node-fetch')
const { joinVoiceChannel } = require('@discordjs/voice');


//imports from files  
const questions = require('./lists/questions')
const possibleReplies = require('./lists/possible_replies')
const proverbios = require('./lists/proverbios')
const buenosdias = require('./lists/buenosdias')


//BOT READY
client.on('ready', (c) => {
    console.log(`✅ ${c.user.tag} is ready`)
})




client.on('messageCreate', async (message) => {
    if (message.author.bot) {
        return;
    }

    const content = message.content.toLowerCase();

    switch (content) {
        case 'hola':
            message.reply('holi :3');
            break;

        case 'holi':
            message.reply('hola :3');
            break;

        case '!gn':
            message.channel.send(`${message.author.toString()} se va a la camucha y les desea unas re buenas noches a tudo o mundo 💞🌙`);
            try {
                let url = 'https://g.tenor.com/v1/search?q=goodnight&key=LIVDSRZULELA&limit=100';
                let response = await axios.get(url);
                let json = response.data;
                let index = Math.floor(Math.random() * json.results.length);
                message.channel.send(json.results[index].url);
            } catch (error) {
                console.error('Error fetching GIF:', error);
            }
            break;

        case '!proverbio':
            const randomProv = proverbios[Math.floor(Math.random() * proverbios.length)];
            message.channel.send(randomProv + '\n\n🏮**LECUELDALO** 🏮');
            break;

        case '!gm':
            const saludoBuenosDias = buenosdias[Math.floor(Math.random() * buenosdias.length)];
            message.channel.send(`${message.author.toString()} ${saludoBuenosDias}`);
            try {
                let url = 'https://g.tenor.com/v1/search?q=azumanga&key=LIVDSRZULELA&limit=100';
                let response = await axios.get(url);
                let json = response.data;
                let index = Math.floor(Math.random() * json.results.length);
                message.channel.send(json.results[index].url);
            } catch (error) {
                console.error('Error fetching GIF:', error);
            }
            break;

        default:
            if (content.startsWith('!')) {
                message.channel.send(`${message.author.toString()} nononono alto ahi papito, el comando "${content}" no existe`);
            }
            break;
    }
});
//FUNCION DE PREGUNTA
client.on('messageCreate', (message) => {
    if (message.content === '!pregunta') {
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        const sentQuestion = message.channel.send(randomQuestion.question);


        // Regular text-based question
        const filter = (response) => response.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({
            filter,
            max: 1,
            time: 15000,// Time in milliseconds to collect responses
            errors: ['time']
        });

        collector.on('collect', (response) => {
            if (response.content.toLowerCase() == randomQuestion.answer) {
                message.channel.send(`✅ ${message.author} ha respondido correctamente! :3`); // Correct answer
            } else {
                message.channel.send(`❌ ${message.author} le erró a la respuesta u.u mejor suerte la próxima!`); // Incorrect answer
            }
            response.delete(); //borra la respuesta del user
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                message.channel.send('se te acabo el tiempo jiji :3 mejor suerte la proxima, **la respuesta era: **' + randomQuestion.answer); //mensaje de error cuando se acaba el tiempo
            }
        });
    }
});






client.login(process.env.TOKEN)
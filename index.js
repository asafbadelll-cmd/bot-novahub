require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

// Crear una nueva instancia del cliente de Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// Evento cuando el bot está listo
client.once('ready', () => {
    console.log(`✅ Bot conectado como ${client.user.tag}`);
    console.log(`📊 Servidores: ${client.guilds.cache.size}`);
});

// Evento cuando se recibe un mensaje
client.on('messageCreate', async (message) => {
    // Ignorar mensajes del propio bot
    if (message.author.bot) return;

    // Comando simple: !hola
    if (message.content === '!hola') {
        message.reply('¡Hola! Soy un bot creado con Node.js 🤖');
    }

    // Comando: !ping
    if (message.content === '!ping') {
        const ping = client.ws.ping;
        message.reply(`🏓 Pong! Latencia: ${ping}ms`);
    }

    // Comando: !info
    if (message.content === '!info') {
        const embed = {
            color: 0x0099ff,
            title: 'Información del Bot',
            description: 'Este es un bot básico creado con discord.js y Node.js',
            fields: [
                { name: 'Servidores', value: `${client.guilds.cache.size}`, inline: true },
                { name: 'Usuarios', value: `${client.users.cache.size}`, inline: true },
                { name: 'Versión', value: '1.0.0', inline: true },
            ],
            timestamp: new Date(),
            footer: {
                text: 'Creado con ❤️ usando discord.js'
            }
        };
        message.channel.send({ embeds: [embed] });
    }
});

// Iniciar sesión en Discord
client.login(process.env.DISCORD_TOKEN);

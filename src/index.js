const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

// Crear cliente con intents necesarios
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

// Colección de comandos
client.commands = new Collection();

// Cargar comandos
const commandFiles = fs.readdirSync('./src/comandos').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./comandos/${file}`);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Comando cargado: ${command.data.name}`);
    }
}

// Cargar eventos
const eventFiles = fs.readdirSync('./src/eventos').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./eventos/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
    console.log(`✅ Evento cargado: ${event.name}`);
}

// Cargar sistemas
const systemFiles = fs.readdirSync('./src/sistemas').filter(file => file.endsWith('.js'));
for (const file of systemFiles) {
    const system = require(`./sistemas/${file}`);
    if (typeof system.init === 'function') {
        system.init(client);
        console.log(`✅ Sistema cargado: ${file}`);
    }
}

// Iniciar el bot
client.login(process.env.DISCORD_TOKEN);

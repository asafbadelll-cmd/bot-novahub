/**
 * Discord Bot - Nova Hub
 * Punto de entrada principal
 */

require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

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

// Base directory
const baseDir = path.join(__dirname, 'src');

// Cargar comandos
const commandsDir = path.join(baseDir, 'comandos');
if (fs.existsSync(commandsDir)) {
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        try {
            const command = require(path.join(commandsDir, file));
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                console.log(`✅ Comando cargado: ${command.data.name}`);
            }
        } catch (error) {
            console.error(`❌ Error cargando comando ${file}:`, error.message);
        }
    }
}

// Cargar eventos
const eventsDir = path.join(baseDir, 'eventos');
if (fs.existsSync(eventsDir)) {
    const eventFiles = fs.readdirSync(eventsDir).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        try {
            const event = require(path.join(eventsDir, file));
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
            console.log(`✅ Evento cargado: ${event.name}`);
        } catch (error) {
            console.error(`❌ Error cargando evento ${file}:`, error.message);
        }
    }
}

// Cargar sistemas
const systemsDir = path.join(baseDir, 'sistemas');
if (fs.existsSync(systemsDir)) {
    const systemFiles = fs.readdirSync(systemsDir).filter(file => file.endsWith('.js'));
    for (const file of systemFiles) {
        try {
            const system = require(path.join(systemsDir, file));
            if (typeof system.init === 'function') {
                system.init(client);
                console.log(`✅ Sistema cargado: ${system.name || file}`);
            }
        } catch (error) {
            console.error(`❌ Error cargando sistema ${file}:`, error.message);
        }
    }
}

// Manejo de errores global
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
});

// Iniciar el bot
client.login(process.env.DISCORD_TOKEN).catch(error => {
    console.error('❌ Error al iniciar sesión:', error.message);
    process.exit(1);
});

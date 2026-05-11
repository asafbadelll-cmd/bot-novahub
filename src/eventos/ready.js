const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`✅ Bot conectado como ${client.user.tag}`);
        
        // Registrar comandos slash
        const { REST } = require('@discordjs/rest');
        const { Routes } = require('discord-api-types/v10');
        
        const commands = [];
        const commandFiles = fs.readdirSync('./src/comandos').filter(file => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            const command = require(`./comandos/${file}`);
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
                console.log(`✅ Comando cargado: ${command.data.name}`);
            }
        }
        
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        
        rest.put(Routes.applicationCommands(client.user.id), { body: commands })
            .then(() => console.log('✅ Comandos slash registrados globalmente'))
            .catch(console.error);
    },
};

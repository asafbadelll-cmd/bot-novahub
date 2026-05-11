/**
 * Evento: Ready - Se ejecuta cuando el bot está listo
 */

const { Events, ActivityType } = require('discord.js');
const { REST, Routes } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`✅ Bot conectado como ${client.user.tag}`);
        
        // Establecer actividad del bot
        client.user.setPresence({
            activities: [{ name: '!help | /info', type: ActivityType.Watching }],
            status: 'online'
        });
        
        // Registrar comandos slash
        try {
            const commands = [];
            const commandFiles = fs.readdirSync('./src/comandos').filter(file => file.endsWith('.js'));
            
            for (const file of commandFiles) {
                const command = require(`./comandos/${file}`);
                if ('data' in command && 'execute' in command) {
                    commands.push(command.data.toJSON());
                }
            }
            
            const rest = new REST().setToken(process.env.DISCORD_TOKEN);
            
            await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
            console.log(`✅ ${commands.length} comandos slash registrados globalmente`);
        } catch (error) {
            console.error('❌ Error al registrar comandos:', error);
        }
    },
};

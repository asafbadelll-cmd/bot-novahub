const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'logger',
    init(client) {
        console.log('📝 Sistema de logging inicializado');

        // Log de mensajes
        client.on('messageCreate', (message) => {
            if (message.author.bot) return;
            logUserActivity(message.author, `Mensaje en #${message.channel.name}: ${message.content.substring(0, 50)}`);
        });

        // Log de uniones
        client.on('guildMemberAdd', (member) => {
            logUserActivity(member.user, `Se unió al servidor ${member.guild.name}`);
        });

        // Log de comandos slash
        client.on('interactionCreate', (interaction) => {
            if (interaction.isChatInputCommand()) {
                logUserActivity(interaction.user, `Ejecutó comando /${interaction.commandName}`);
            }
        });
    },
};

function logUserActivity(user, action) {
    const logsDir = './src/logs';
    
    // Asegurar que el directorio existe
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }

    const userId = user.id;
    const logFile = path.join(logsDir, `${userId}.log`);
    
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${action} - Usuario: ${user.tag} (${user.id})\n`;
    
    fs.appendFileSync(logFile, logEntry);
}

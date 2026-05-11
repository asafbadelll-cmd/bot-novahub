/**
 * Sistema: Logger - Registra actividades de usuarios en archivos
 */

const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'logger',
    init(client) {
        console.log('📝 Sistema de logging inicializado');

        const logsDir = path.join(__dirname, '..', 'logs');
        
        // Asegurar que el directorio existe
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }

        // Log de mensajes (limitado para evitar exceso de logs)
        client.on('messageCreate', (message) => {
            if (message.author.bot) return;
            logUserActivity(message.author, `Mensaje en #${message.channel.name}`, logsDir);
        });

        // Log de uniones
        client.on('guildMemberAdd', (member) => {
            logUserActivity(member.user, `Se unió al servidor ${member.guild.name}`, logsDir);
        });

        // Log de comandos slash
        client.on('interactionCreate', (interaction) => {
            if (interaction.isChatInputCommand()) {
                logUserActivity(interaction.user, `Ejecutó comando /${interaction.commandName}`, logsDir);
            }
        });
    },
};

/**
 * Registra la actividad de un usuario en un archivo log
 * @param {User} user - El usuario de Discord
 * @param {string} action - La acción realizada
 * @param {string} logsDir - Directorio de logs
 */
function logUserActivity(user, action, logsDir) {
    const userId = user.id;
    const logFile = path.join(logsDir, `${userId}.log`);
    
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${action} - Usuario: ${user.tag} (${user.id})\n`;
    
    fs.appendFileSync(logFile, logEntry);
}

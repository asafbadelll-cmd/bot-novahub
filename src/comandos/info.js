const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Muestra información sobre un usuario')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario a consultar')
                .setRequired(false)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('usuario') || interaction.user;
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        
        const embed = {
            title: `📋 Información de ${user.tag}`,
            thumbnail: { url: user.displayAvatarURL() },
            fields: [
                { name: 'ID', value: user.id, inline: true },
                { name: 'Nombre', value: user.username, inline: true },
                { name: 'Bot', value: user.bot ? '✅ Sí' : '❌ No', inline: true },
                { name: 'Cuenta creada', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
            ],
            color: 0x00AE86,
            timestamp: new Date(),
            footer: { text: `Solicitado por ${interaction.user.tag}` }
        };

        if (member) {
            embed.fields.push(
                { name: 'Apodo', value: member.nickname || 'Ninguno', inline: true },
                { name: 'Se unió', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: 'Roles', value: member.roles.cache.size.toString(), inline: true }
            );
        }

        // Guardar log del usuario
        logUserActivity(user, 'info_command');

        await interaction.reply({ embeds: [embed] });
    },
};

function logUserActivity(user, action) {
    const logsDir = './src/logs';
    const userId = user.id;
    const logFile = path.join(logsDir, `${userId}.log`);
    
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] Acción: ${action} - Usuario: ${user.tag} (${user.id})\n`;
    
    fs.appendFileSync(logFile, logEntry);
    console.log(`📝 Log guardado para ${user.tag}: ${action}`);
}

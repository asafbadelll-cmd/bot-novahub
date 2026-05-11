/**
 * Comando: ping - Muestra la latencia del bot
 */

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Muestra la latencia del bot'),
    async execute(interaction) {
        const sent = await interaction.reply({ 
            content: '🏓 Calculando...', 
            fetchReply: true 
        });
        
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(interaction.client.ws.ping);
        
        await interaction.editReply({
            content: `🏓 Pong!\n• Latencia del mensaje: \`${latency}ms\`\n• Latencia de API: \`${apiLatency}ms\``,
            allowedMentions: { parse: [] }
        });
    },
};

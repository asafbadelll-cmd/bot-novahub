/**
 * Comando: hola - Saluda al usuario
 */

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hola')
        .setDescription('Saluda al bot'),
    async execute(interaction) {
        await interaction.reply({
            content: `¡Hola ${interaction.user.username}! Soy un bot de Discord creado con Node.js 🤖`,
            allowedMentions: { parse: [] }
        });
    },
};

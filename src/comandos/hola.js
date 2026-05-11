const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hola')
        .setDescription('Saluda al bot'),
    async execute(interaction) {
        await interaction.reply('¡Hola! Soy un bot de Discord creado con Node.js 🤖');
    },
};

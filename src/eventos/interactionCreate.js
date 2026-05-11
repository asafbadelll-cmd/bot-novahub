/**
 * Evento: InteractionCreate - Maneja las interacciones de comandos slash
 */

const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`❌ Comando no encontrado: ${interaction.commandName}`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`❌ Error ejecutando comando ${interaction.commandName}:`, error);
            
            const errorMessage = { 
                content: '❌ Hubo un error al ejecutar este comando.', 
                ephemeral: true 
            };
            
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage).catch(() => {});
            } else {
                await interaction.reply(errorMessage).catch(() => {});
            }
        }
    },
};

const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('🗑️ Elimina mensajes del canal')
        .addIntegerOption(option =>
            option.setName('cantidad')
                .setDescription('Cantidad de mensajes a eliminar (1-100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        )
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Filtrar mensajes de un usuario específico')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const amount = interaction.options.getInteger('cantidad');
        const targetUser = interaction.options.getUser('usuario');

        // Verificar permisos del bot
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({
                content: '❌ No tengo permisos para gestionar mensajes.',
                ephemeral: true
            });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            const messages = await interaction.channel.messages.fetch({ limit: amount });
            
            let messagesToDelete = messages;
            
            if (targetUser) {
                messagesToDelete = messages.filter(msg => msg.author.id === targetUser.id);
            }

            // Discord no permite borrar mensajes con más de 14 días
            const twoWeeksAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
            messagesToDelete = messagesToDelete.filter(msg => msg.createdAt > twoWeeksAgo);

            if (messagesToDelete.size === 0) {
                return interaction.editReply({
                    content: '⚠️ No se encontraron mensajes para eliminar (pueden tener más de 14 días).'
                });
            }

            await interaction.channel.bulkDelete(messagesToDelete, true);

            const embed = new EmbedBuilder()
                .setColor('#00ff88')
                .setTitle('🗑️ Mensajes Eliminados')
                .addFields(
                    { name: 'Cantidad', value: `${messagesToDelete.size} mensajes`, inline: true },
                    { name: 'Moderador', value: `${interaction.user.tag}`, inline: true }
                );

            if (targetUser) {
                embed.addFields({ name: 'Usuario filtrado', value: `${targetUser.tag}`, inline: true });
            }

            embed.setFooter({ text: `Solicitado por ${interaction.user.tag}` })
                .setTimestamp();

            const sentMessage = await interaction.editReply({ embeds: [embed] });

            // Eliminar el mensaje de confirmación después de 5 segundos
            setTimeout(() => {
                sentMessage.delete().catch(() => {});
            }, 5000);

            console.log(`[PURGE] ${messagesToDelete.size} mensajes eliminados por ${interaction.user.tag}`);

        } catch (error) {
            console.error('[PURGE ERROR]', error);
            await interaction.editReply({
                content: '❌ Ocurrió un error al intentar eliminar los mensajes.'
            });
        }
    }
};

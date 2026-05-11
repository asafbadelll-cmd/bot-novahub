/**
 * Comando: info - Muestra información sobre un usuario
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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
        
        const embed = new EmbedBuilder()
            .setTitle(`📋 Información de ${user.tag}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
            .setColor(0x00AE86)
            .setTimestamp()
            .setFooter({ text: `Solicitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .addFields(
                { name: 'ID', value: user.id, inline: true },
                { name: 'Nombre', value: user.username, inline: true },
                { name: 'Bot', value: user.bot ? '✅ Sí' : '❌ No', inline: true },
                { name: 'Cuenta creada', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true }
            );

        if (member) {
            embed.addFields(
                { name: 'Apodo', value: member.nickname || 'Ninguno', inline: true },
                { name: 'Se unió', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: 'Roles', value: member.roles.cache.size.toString(), inline: true }
            );
        }

        await interaction.reply({ embeds: [embed], allowedMentions: { parse: [] } });
    },
};

const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('👤 Muestra información detallada de un usuario')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario a consultar')
                .setRequired(false)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario') || interaction.user;
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`👤 Información de ${user.tag}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields(
                { 
                    name: '📋 Información General', 
                    value: [
                        `• **Nombre:** ${user.tag}`,
                        `• **ID:** ${user.id}`,
                        `• **Bot:** ${user.bot ? '✅ Sí' : '❌ No'}`,
                        `• **Cuenta creada:** <t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
                        `• **Antigüedad:** <t:${Math.floor(user.createdTimestamp / 1000)}:R>`
                    ].join('\n'),
                    inline: false 
                }
            );

        if (member) {
            embed.addFields({
                name: '🏠 Información del Servidor',
                value: [
                    `• **Apodo:** ${member.nickname || 'Ninguno'}`,
                    `• **Se unió:** <t:${Math.floor(member.joinedTimestamp / 1000)}:F>`,
                    `• **Antigüedad:** <t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
                    `• **Roles (${member.roles.cache.size}):** ${member.roles.cache.sort((a, b) => b.position - a.position).slice(0, 5).map(r => r.name).join(', ')}${member.roles.cache.size > 5 ? '...' : ''}`,
                    `• **Rol más alto:** ${member.roles.highest.name}`,
                    `• **¿Silenciado?:** ${member.isCommunicationDisabled() ? '✅ Sí' : '❌ No'}`
                ].join('\n'),
                inline: false
            });

            // Banner si está disponible (solo para usuarios con Nitro)
            try {
                const fetchedUser = await interaction.client.users.fetch(user.id, { force: true });
                if (fetchedUser.banner) {
                    embed.setImage(fetchedUser.bannerURL({ size: 4096 }));
                }
            } catch (e) {
                // Ignorar error si no se puede obtener el banner
            }
        }

        embed.setFooter({ text: `Solicitado por ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};

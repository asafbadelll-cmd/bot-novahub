const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('🏠 Muestra información detallada del servidor')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const guild = interaction.guild;
        const owner = await guild.fetchOwner().catch(() => null);

        // Obtener canales por categoría
        const channels = guild.channels.cache;
        const categorias = {
            texto: channels.filter(c => c.type === 0).size,
            voz: channels.filter(c => c.type === 2).size,
            categoria: channels.filter(c => c.type === 4).size,
            foro: channels.filter(c => c.type === 15).size
        };

        // Roles destacados
        const roles = guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .filter(r => !r.managed)
            .slice(0, 10)
            .map(r => r.name)
            .join(', ');

        // Emojis
        const emojis = guild.emojis.cache;
        const emojisAnimados = emojis.filter(e => e.animated).size;
        const emojisEstaticos = emojis.size - emojisAnimados;

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`🏠 Información de ${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
            .setImage(guild.bannerURL({ size: 4096 }) || guild.splashURL({ size: 4096 }) || null)
            .addFields(
                { 
                    name: '📊 Información General', 
                    value: [
                        `• **Nombre:** ${guild.name}`,
                        `• **ID:** ${guild.id}`,
                        `• **Dueño:** ${owner ? `${owner.user.tag}` : 'No disponible'}`,
                        `• **Creado:** <t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
                        `• **Antigüedad:** <t:${Math.floor(guild.createdTimestamp / 1000)}:R>`
                    ].join('\n'),
                    inline: false 
                },
                { 
                    name: '👥 Miembros', 
                    value: [
                        `• **Total:** ${guild.memberCount}`,
                        `• **Humanos:** ${guild.members.cache.filter(m => !m.user.bot).size}`,
                        `• **Bots:** ${guild.members.cache.filter(m => m.user.bot).size}`,
                        `• **En línea:** ${guild.members.cache.filter(m => m.presence?.status !== 'offline').size}`
                    ].join('\n'),
                    inline: true 
                },
                { 
                    name: '📁 Canales', 
                    value: [
                        `• **Texto:** ${categorias.texto}`,
                        `• **Voz:** ${categorias.voz}`,
                        `• **Foros:** ${categorias.foro}`,
                        `• **Categorías:** ${categorias.categoria}`
                    ].join('\n'),
                    inline: true 
                },
                { 
                    name: '🎭 Roles y Emojis', 
                    value: [
                        `• **Roles:** ${guild.roles.cache.size}`,
                        `• **Emojis:** ${emojis.size} (${emojisEstaticos} estáticos, ${emojisAnimados} animados)`,
                        `• **Stickers:** ${guild.stickers.cache.size}`
                    ].join('\n'),
                    inline: true 
                }
            );

        if (roles) {
            embed.addFields({ name: '🔝 Roles Destacados', value: roles, inline: false });
        }

        // Características del servidor
        if (guild.features.length > 0) {
            embed.addFields({ 
                name: '✨ Características', 
                value: guild.features.map(f => `• ${f}`).join('\n'), 
                inline: false 
            });
        }

        embed.setFooter({ text: `Solicitado por ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};

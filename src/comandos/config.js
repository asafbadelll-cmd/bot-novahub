const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('⚙️ Muestra la configuración del servidor')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const guild = interaction.guild;

        // Verificar permisos del bot
        const botMember = guild.members.me;
        
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`⚙️ Configuración de ${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
            .addFields(
                { 
                    name: '📊 Información General', 
                    value: [
                        `• **Nombre:** ${guild.name}`,
                        `• **ID:** ${guild.id}`,
                        `• **Dueño:** <@${guild.ownerId}>`,
                        `• **Miembros:** ${guild.memberCount}`,
                        `• **Canales:** ${guild.channels.cache.size}`,
                        `• **Roles:** ${guild.roles.cache.size}`,
                        `• **Emojis:** ${guild.emojis.cache.size}`,
                        `• **Creado:** <t:${Math.floor(guild.createdTimestamp / 1000)}:F>`
                    ].join('\n'),
                    inline: false 
                },
                { 
                    name: '🔒 Nivel de Verificación', 
                    value: `\`${guild.verificationLevel}\``,
                    inline: true 
                },
                { 
                    name: '🛡️ Nivel de Moderación', 
                    value: `\`${guild.mfaLevel}\``,
                    inline: true 
                },
                { 
                    name: '📢 Canal de Sistema', 
                    value: guild.systemChannel ? `<#${guild.systemChannel.id}>` : 'No configurado',
                    inline: true 
                }
            )
            .setFooter({ text: `Solicitado por ${interaction.user.tag}` })
            .setTimestamp();

        // Verificar permisos importantes
        const permisosImportantes = [
            { nombre: 'Administrar Mensajes', flag: PermissionFlagsBits.ManageMessages },
            { nombre: 'Expulsar Miembros', flag: PermissionFlagsBits.KickMembers },
            { nombre: 'Banear Miembros', flag: PermissionFlagsBits.BanMembers },
            { nombre: 'Silenciar Miembros', flag: PermissionFlagsBits.ModerateMembers },
            { nombre: 'Gestionar Roles', flag: PermissionFlagsBits.ManageRoles },
        ];

        const permisosBot = permisosImportantes.map(p => {
            const tiene = botMember.permissions.has(p.flag);
            return `${tiene ? '✅' : '❌'} ${p.nombre}`;
        }).join('\n');

        embed.addFields({ name: '🤖 Permisos del Bot', value: permisosBot, inline: false });

        await interaction.reply({ embeds: [embed] });
    }
};

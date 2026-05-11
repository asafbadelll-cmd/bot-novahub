const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('🔨 Banea a un usuario del servidor')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario a banear')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('razon')
                .setDescription('La razón del baneo')
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option.setName('dias')
                .setDescription('Días de mensajes a eliminar (0-7)')
                .setMinValue(0)
                .setMaxValue(7)
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('razon') || 'Sin razón especificada';
        const days = interaction.options.getInteger('dias') || 0;

        // Verificar si el usuario puede ser baneado
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        
        if (!member) {
            return interaction.reply({
                content: '❌ No puedo encontrar a este usuario en el servidor.',
                ephemeral: true
            });
        }

        // Verificar jerarquía de roles
        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({
                content: '❌ No puedes banear a alguien con un rol igual o superior al tuyo.',
                ephemeral: true
            });
        }

        // Verificar si el bot tiene permisos
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({
                content: '❌ No tengo permisos para banear usuarios.',
                ephemeral: true
            });
        }

        try {
            await member.ban({ 
                deleteMessageSeconds: days * 24 * 60 * 60,
                reason: `${reason} | Solicitado por ${interaction.user.tag}` 
            });

            const embed = new EmbedBuilder()
                .setColor('#ff4444')
                .setTitle('🔨 Usuario Baneado')
                .addFields(
                    { name: 'Usuario', value: `${user.tag} (${user.id})`, inline: true },
                    { name: 'Moderador', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Razón', value: reason, inline: false },
                    { name: 'Mensajes eliminados', value: `${days} días`, inline: true }
                )
                .setFooter({ text: `ID: ${user.id}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

            // Log del baneo
            console.log(`[BAN] ${user.tag} fue baneado por ${interaction.user.tag}. Razón: ${reason}`);

        } catch (error) {
            console.error('[BAN ERROR]', error);
            await interaction.reply({
                content: '❌ Ocurrió un error al intentar banear al usuario.',
                ephemeral: true
            });
        }
    }
};

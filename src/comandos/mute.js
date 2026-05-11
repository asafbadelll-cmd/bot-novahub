const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('🔇 Silencia temporalmente a un usuario')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario a silenciar')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('duracion')
                .setDescription('Duración del mute en minutos')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(1440)
        )
        .addStringOption(option =>
            option.setName('razon')
                .setDescription('La razón del mute')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const duration = interaction.options.getInteger('duracion');
        const reason = interaction.options.getString('razon') || 'Sin razón especificada';

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
                content: '❌ No puedes silenciar a alguien con un rol igual o superior al tuyo.',
                ephemeral: true
            });
        }

        // Verificar si el bot tiene permisos
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({
                content: '❌ No tengo permisos para silenciar usuarios.',
                ephemeral: true
            });
        }

        // Verificar si ya está silenciado
        if (member.isCommunicationDisabled()) {
            return interaction.reply({
                content: '⚠️ Este usuario ya está silenciado.',
                ephemeral: true
            });
        }

        try {
            const durationMs = duration * 60 * 1000;
            await member.timeout(durationMs, `${reason} | Solicitado por ${interaction.user.tag}`);

            const embed = new EmbedBuilder()
                .setColor('#ffaa00')
                .setTitle('🔇 Usuario Silenciado')
                .addFields(
                    { name: 'Usuario', value: `${user.tag} (${user.id})`, inline: true },
                    { name: 'Moderador', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Duración', value: `${duration} minutos`, inline: true },
                    { name: 'Razón', value: reason, inline: false }
                )
                .setFooter({ text: `ID: ${user.id}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

            console.log(`[MUTE] ${user.tag} fue silenciado por ${interaction.user.tag} durante ${duration}min. Razón: ${reason}`);

        } catch (error) {
            console.error('[MUTE ERROR]', error);
            await interaction.reply({
                content: '❌ Ocurrió un error al intentar silenciar al usuario.',
                ephemeral: true
            });
        }
    }
};

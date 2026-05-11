const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('🔊 Quita el silencio de un usuario')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario a desilenciar')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        
        if (!member) {
            return interaction.reply({
                content: '❌ No puedo encontrar a este usuario en el servidor.',
                ephemeral: true
            });
        }

        // Verificar si está silenciado
        if (!member.isCommunicationDisabled()) {
            return interaction.reply({
                content: '⚠️ Este usuario no está silenciado.',
                ephemeral: true
            });
        }

        // Verificar jerarquía de roles
        if (member.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({
                content: '❌ No puedes gestionar a alguien con un rol igual o superior al tuyo.',
                ephemeral: true
            });
        }

        // Verificar si el bot tiene permisos
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.reply({
                content: '❌ No tengo permisos para gestionar silencios.',
                ephemeral: true
            });
        }

        try {
            await member.timeout(null, `Desilenciado por ${interaction.user.tag}`);

            const embed = new EmbedBuilder()
                .setColor('#00ff88')
                .setTitle('🔊 Usuario Desilenciado')
                .addFields(
                    { name: 'Usuario', value: `${user.tag} (${user.id})`, inline: true },
                    { name: 'Moderador', value: `${interaction.user.tag}`, inline: true }
                )
                .setFooter({ text: `ID: ${user.id}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

            console.log(`[UNMUTE] ${user.tag} fue desilenciado por ${interaction.user.tag}`);

        } catch (error) {
            console.error('[UNMUTE ERROR]', error);
            await interaction.reply({
                content: '❌ Ocurrió un error al intentar desilenciar al usuario.',
                ephemeral: true
            });
        }
    }
};

const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('⚠️ Advierte a un usuario')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario a advertir')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('razon')
                .setDescription('La razón de la advertencia')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('razon');

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
                content: '❌ No puedes advertir a alguien con un rol igual o superior al tuyo.',
                ephemeral: true
            });
        }

        try {
            // Enviar DM al usuario
            const embedDM = new EmbedBuilder()
                .setColor('#ffaa00')
                .setTitle('⚠️ Has recibido una advertencia')
                .setDescription(`Has recibido una advertencia en **${interaction.guild.name}**`)
                .addFields(
                    { name: 'Razón', value: reason, inline: false },
                    { name: 'Moderador', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Fecha', value: new Date().toLocaleString('es-ES'), inline: true }
                )
                .setFooter({ text: `ID: ${user.id}` })
                .setTimestamp();

            await user.send({ embeds: [embedDM] }).catch(() => {
                console.log(`No se pudo enviar DM a ${user.tag}`);
            });

            // Confirmación en el canal
            const embedConfirmacion = new EmbedBuilder()
                .setColor('#ffaa00')
                .setTitle('⚠️ Usuario Advertido')
                .addFields(
                    { name: 'Usuario', value: `${user.tag} (${user.id})`, inline: true },
                    { name: 'Moderador', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Razón', value: reason, inline: false }
                )
                .setFooter({ text: `ID: ${user.id}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embedConfirmacion] });

            console.log(`[WARN] ${user.tag} recibió una advertencia de ${interaction.user.tag}. Razón: ${reason}`);

        } catch (error) {
            console.error('[WARN ERROR]', error);
            await interaction.reply({
                content: '❌ Ocurrió un error al intentar advertir al usuario.',
                ephemeral: true
            });
        }
    }
};

const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('👢 Expulsa a un usuario del servidor')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('El usuario a expulsar')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('razon')
                .setDescription('La razón de la expulsión')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
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
                content: '❌ No puedes expulsar a alguien con un rol igual o superior al tuyo.',
                ephemeral: true
            });
        }

        // Verificar si el bot tiene permisos
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.reply({
                content: '❌ No tengo permisos para expulsar usuarios.',
                ephemeral: true
            });
        }

        try {
            await member.kick(`${reason} | Solicitado por ${interaction.user.tag}`);

            const embed = new EmbedBuilder()
                .setColor('#ff9900')
                .setTitle('👢 Usuario Expulsado')
                .addFields(
                    { name: 'Usuario', value: `${user.tag} (${user.id})`, inline: true },
                    { name: 'Moderador', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Razón', value: reason, inline: false }
                )
                .setFooter({ text: `ID: ${user.id}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

            console.log(`[KICK] ${user.tag} fue expulsado por ${interaction.user.tag}. Razón: ${reason}`);

        } catch (error) {
            console.error('[KICK ERROR]', error);
            await interaction.reply({
                content: '❌ Ocurrió un error al intentar expulsar al usuario.',
                ephemeral: true
            });
        }
    }
};

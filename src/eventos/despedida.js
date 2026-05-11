const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        try {
            const embed = new EmbedBuilder()
                .setColor('#ff4444')
                .setTitle('👋 Miembro se ha ido')
                .setDescription(`${member.user.tag} ha abandonado el servidor.`)
                .addFields(
                    { 
                        name: 'Información', 
                        value: `• Cuenta creada: <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>\n• Se unió: <t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, 
                        inline: false 
                    },
                    {
                        name: 'Miembros actuales',
                        value: `${member.guild.memberCount} miembros`,
                        inline: true
                    }
                )
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
                .setFooter({ text: `ID: ${member.id}` })
                .setTimestamp();

            // Enviar notificación al canal de logs o sistema
            const canalLogs = member.guild.channels.cache.find(c => 
                c.type === 0 && 
                (c.name === 'logs' || c.name === 'mod-logs' || c.name === 'audit-log')
            ) || member.guild.systemChannel;

            if (canalLogs && canalLogs.permissionsFor(member.guild.members.me)?.has('SendMessages')) {
                await canalLogs.send({ embeds: [embed] });
            }

            console.log(`[DESPEDIDA] ${member.user.tag} abandonó el servidor. Miembros restantes: ${member.guild.memberCount}`);

        } catch (error) {
            console.error('[DESPEDIDA ERROR]', error);
        }
    }
};

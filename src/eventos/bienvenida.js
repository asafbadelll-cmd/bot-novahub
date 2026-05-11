const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            // Esperar un poco para asegurar que el miembro esté completamente cargado
            await new Promise(resolve => setTimeout(resolve, 1000));

            const embed = new EmbedBuilder()
                .setColor('#00ff88')
                .setTitle('👋 ¡Bienvenido al Servidor!')
                .setDescription(`¡Hola ${member.user}! Bienvenido/a a **${member.guild.name}**.`)
                .addFields(
                    { 
                        name: '📋 Reglas', 
                        value: 'Por favor lee las reglas del servidor en el canal correspondiente.', 
                        inline: false 
                    },
                    { 
                        name: '💡 Consejos', 
                        value: '• Presentate en el canal de presentaciones\n• Sé respetuoso con los demás\n• Disfruta tu estancia', 
                        inline: false 
                    }
                )
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
                .setFooter({ text: `Miembro #${member.guild.memberCount} | ID: ${member.id}` })
                .setTimestamp();

            // Enviar mensaje de bienvenida al canal general o el primer canal de texto disponible
            const canalBienvenida = member.guild.channels.cache.find(c => 
                c.type === 0 && 
                (c.name === 'general' || c.name === 'bienvenidas' || c.name === 'welcome')
            ) || member.guild.systemChannel;

            if (canalBienvenida && canalBienvenida.permissionsFor(member.guild.members.me)?.has('SendMessages')) {
                await canalBienvenida.send({ content: `${member.user}`, embeds: [embed] });
            }

            // Enviar DM de bienvenida al usuario
            const dmEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`¡Bienvenido a ${member.guild.name}!`)
                .setDescription('Gracias por unirte a nuestro servidor. Espero que disfrutes tu estancia aquí.')
                .addFields({
                    name: '¿Necesitas ayuda?',
                    value: 'No dudes en preguntar a los moderadores si tienes alguna duda.',
                    inline: false
                })
                .setFooter({ text: member.guild.name })
                .setTimestamp();

            await member.user.send({ embeds: [dmEmbed] }).catch(() => {
                console.log(`No se pudo enviar DM de bienvenida a ${member.user.tag}`);
            });

            console.log(`[BIENVENIDA] ${member.user.tag} se unió al servidor. Miembro #${member.guild.memberCount}`);

        } catch (error) {
            console.error('[BIENVENIDA ERROR]', error);
        }
    }
};

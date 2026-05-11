const { Events, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

// Lista de palabras prohibidas (puedes personalizarla)
const palabrasProhibidas = [
    'groseria1',
    'groseria2',
    'insulto1',
    'insulto2',
    // Agrega más palabras según necesites
];

// Cache para llevar cuenta de las advertencias
const warningCache = new Map();

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Ignorar mensajes de bots y del propio bot
        if (message.author.bot) return;

        // Ignorar canales donde el bot no tiene permisos
        if (!message.guild || !message.channel.permissionsFor(message.guild.members.me)?.has(PermissionFlagsBits.ManageMessages)) {
            return;
        }

        const contenidoLower = message.content.toLowerCase();
        
        // Verificar si el mensaje contiene palabras prohibidas
        const palabraEncontrada = palabrasProhibidas.find(palabra => 
            contenidoLower.includes(palabra.toLowerCase())
        );

        if (!palabraEncontrada) return;

        try {
            // Eliminar el mensaje
            await message.delete();

            // Obtener o crear entrada en cache
            let warnings = warningCache.get(message.author.id) || 0;
            warnings++;
            warningCache.set(message.author.id, warnings);

            // Enviar advertencia al usuario
            const embedAdvertencia = new EmbedBuilder()
                .setColor('#ff4444')
                .setTitle('⚠️ Advertencia por Lenguaje Inapropiado')
                .setDescription(`Tu mensaje contenía lenguaje inapropiado y ha sido eliminado.`)
                .addFields(
                    { name: 'Palabra detectada', value: '||palabra prohibida||', inline: true },
                    { name: 'Advertencias', value: `${warnings}/3`, inline: true },
                    { name: 'Canal', value: `${message.channel.name}`, inline: false }
                )
                .setFooter({ text: `Usuario: ${message.author.tag}` })
                .setTimestamp();

            await message.author.send({ embeds: [embedAdvertencia] }).catch(() => {
                console.log(`No se pudo enviar DM a ${message.author.tag}`);
            });

            // Notificación en el canal (se borra después de 5 segundos)
            const embedNotificacion = new EmbedBuilder()
                .setColor('#ff6600')
                .setDescription(`🚫 ${message.author} Por favor mantén un lenguaje respetuoso. (Advertencia ${warnings}/3)`)
                .setTimestamp();

            const notificacionMsg = await message.channel.send({ embeds: [embedNotificacion] });
            setTimeout(() => notificacionMsg.delete().catch(() => {}), 5000);

            // Si llega a 3 advertencias, aplicar mute temporal
            if (warnings >= 3) {
                const member = await message.guild.members.fetch(message.author.id);
                
                if (member && member.moderatable) {
                    await member.timeout(60 * 60 * 1000, 'Uso repetido de lenguaje inapropiado'); // 1 hora
                    
                    const embedMute = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('🔇 Usuario Silenciado Automáticamente')
                        .setDescription(`${message.author} ha sido silenciado por 1 hora debido a múltiples advertencias por lenguaje inapropiado.`)
                        .setFooter({ text: `Sistema Anti-Groserías` })
                        .setTimestamp();

                    await message.channel.send({ embeds: [embedMute] });
                    
                    // Resetear contador después de aplicar mute
                    warningCache.set(message.author.id, 0);

                    console.log(`[ANTI-GROSERIA] ${message.author.tag} fue silenciado automáticamente tras ${warnings} advertencias.`);
                }
            } else {
                console.log(`[ANTI-GROSERIA] ${message.author.tag} recibió advertencia ${warnings}/3 por usar lenguaje inapropiado.`);
            }

        } catch (error) {
            console.error('[ANTI-GROSERIA ERROR]', error);
        }
    }
};

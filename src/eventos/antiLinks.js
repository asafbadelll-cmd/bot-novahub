const { Events, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

// Configuración de enlaces
const ALLOWED_LINKS = [
    'youtube.com',
    'youtu.be',
    'twitch.tv',
    'twitter.com',
    'x.com',
    'instagram.com',
    'tiktok.com',
    'discord.gg',
    'discord.com',
];

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Ignorar mensajes de bots y del propio bot
        if (message.author.bot) return;

        // Ignorar si no es un servidor o no tiene permisos
        if (!message.guild || !message.channel.permissionsFor(message.guild.members.me)?.has(PermissionFlagsBits.ManageMessages)) {
            return;
        }

        // Verificar si el usuario tiene permisos de administrador o manage messages
        const member = await message.guild.members.fetch(message.author.id).catch(() => null);
        if (member?.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return;
        }

        const contenido = message.content.toLowerCase();
        
        // Detectar URLs con regex
        const urlRegex = /(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\- ./?%&=]*)?/gi;
        const urlsEncontradas = contenido.match(urlRegex);

        if (!urlsEncontradas) return;

        // Verificar cada URL encontrada
        const urlsNoPermitidas = urlsEncontradas.filter(url => {
            const urlLimpia = url.replace(/^https?:\/\//, '').toLowerCase();
            return !ALLOWED_LINKS.some(permitido => urlLimpia.includes(permitido));
        });

        if (urlsNoPermitidas.length === 0) return;

        try {
            // Eliminar el mensaje
            await message.delete();

            // Enviar advertencia al usuario
            const embedAdvertencia = new EmbedBuilder()
                .setColor('#ff6600')
                .setTitle('⚠️ Enlace No Permitido')
                .setDescription('Tu mensaje contenía enlaces que no están permitidos en este servidor y ha sido eliminado.')
                .addFields(
                    { 
                        name: 'Enlaces detectados', 
                        value: urlsNoPermitidas.slice(0, 3).map(url => `• ${url}`).join('\n'),
                        inline: false 
                    },
                    {
                        name: 'ℹ️ Información',
                        value: 'Si crees que esto es un error, contacta a un moderador.',
                        inline: false
                    }
                )
                .setFooter({ text: `Usuario: ${message.author.tag}` })
                .setTimestamp();

            await message.author.send({ embeds: [embedAdvertencia] }).catch(() => {
                console.log(`No se pudo enviar DM a ${message.author.tag}`);
            });

            // Notificación en el canal (se borra después de 5 segundos)
            const embedNotificacion = new EmbedBuilder()
                .setColor('#ff9900')
                .setDescription(`🚫 ${message.author} Los enlaces externos no están permitidos sin autorización.`)
                .setTimestamp();

            const notificacionMsg = await message.channel.send({ embeds: [embedNotificacion] });
            setTimeout(() => notificacionMsg.delete().catch(() => {}), 5000);

            console.log(`[ANTI-LINKS] Mensaje de ${message.author.tag} eliminado por contener enlaces no permitidos: ${urlsNoPermitidas.join(', ')}`);

        } catch (error) {
            console.error('[ANTI-LINKS ERROR]', error);
        }
    }
};

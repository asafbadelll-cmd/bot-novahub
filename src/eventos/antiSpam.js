const { Events, PermissionFlagsBits } = require('discord.js');

// Configuración de spam
const SPAM_MESSAGES_LIMIT = 5; // Cantidad máxima de mensajes en el intervalo
const SPAM_TIME_WINDOW = 3000; // Ventana de tiempo en ms (3 segundos)
const MUTE_DURATION = 10 * 60 * 1000; // 10 minutos de mute

// Cache para tracking de mensajes por usuario
const messageCache = new Map();

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Ignorar mensajes de bots y del propio bot
        if (message.author.bot) return;

        // Ignorar si no es un servidor o no tiene permisos
        if (!message.guild || !message.channel.permissionsFor(message.guild.members.me)?.has(PermissionFlagsBits.ModerateMembers)) {
            return;
        }

        const userId = message.author.id;
        const now = Date.now();

        // Obtener o crear entrada en cache para este usuario
        if (!messageCache.has(userId)) {
            messageCache.set(userId, []);
        }

        const userMessages = messageCache.get(userId);

        // Eliminar mensajes antiguos fuera de la ventana de tiempo
        const recentMessages = userMessages.filter(timestamp => now - timestamp < SPAM_TIME_WINDOW);
        recentMessages.push(now);

        // Actualizar cache
        messageCache.set(userId, recentMessages);

        // Verificar si excede el límite
        if (recentMessages.length > SPAM_MESSAGES_LIMIT) {
            try {
                // Eliminar mensajes recientes del usuario
                const channelMessages = await message.channel.messages.fetch({ limit: 10 });
                const userRecentMessages = channelMessages.filter(msg => 
                    msg.author.id === userId && 
                    now - msg.createdAt.getTime() < SPAM_TIME_WINDOW * 2
                );

                if (userRecentMessages.size > 0) {
                    await message.channel.bulkDelete(userRecentMessages, true);
                }

                // Aplicar mute al usuario
                const member = await message.guild.members.fetch(userId);
                
                if (member && member.moderatable) {
                    await member.timeout(MUTE_DURATION, 'Spam detectado automáticamente');

                    console.log(`[ANTI-SPAM] ${message.author.tag} fue silenciado por spam (${recentMessages.length} mensajes en ${SPAM_TIME_WINDOW}ms)`);
                }

                // Limpiar cache de este usuario
                messageCache.delete(userId);

            } catch (error) {
                console.error('[ANTI-SPAM ERROR]', error);
            }
        }
    }
};

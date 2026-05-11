const { Events } = require('discord.js');
const { getAIResponse } = require('../sistemas/iaHandler');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    
    /**
     * Evento que escucha mensajes para responder con IA
     * Solo responde en canales configurados y si se menciona al bot o es un chat directo
     */
    async execute(message) {
        // Ignorar mensajes del propio bot o de otros bots
        if (message.author.bot) return;

        // Configuración desde variables de entorno
        const aiChannelId = process.env.AI_CHANNEL_ID;
        const apiKey = process.env.OPENROUTER_API_KEY;
        
        // Si no hay configuración, no hacer nada
        if (!apiKey) return;

        // Verificar si el mensaje es en el canal de IA designado
        // O si el bot fue mencionado directamente en cualquier canal permitido
        const isAiChannel = aiChannelId && message.channel.id === aiChannelId;
        const isMentioned = message.mentions.has(message.client.user);

        // Si no es el canal de IA ni lo mencionaron, ignorar
        if (!isAiChannel && !isMentioned) return;

        // Indicador de "escribiendo..." para mejor UX
        await message.channel.sendTyping();

        // Preparar contenido (quitar mención si existe para no confundir a la IA)
        let content = message.content;
        if (isMentioned) {
            content = content.replace(new RegExp(`<@!?${message.client.user.id}>`, 'g'), '').trim();
        }

        // Si el mensaje está vacío después de quitar la mención, ignorar
        if (!content) return;

        // Configurar contexto
        const config = {
            apiKey: apiKey,
            model: process.env.AI_MODEL || 'qwen/qwen-2.5-7b-instruct',
            systemPrompt: process.env.AI_SYSTEM_PROMPT || 'Eres Nova, un asistente virtual útil y amigable en Discord. Responde de forma concisa y clara.'
        };

        try {
            // Obtener respuesta de la IA
            const result = await getAIResponse(content, message.channel.id, config);

            if (result.success) {
                // Responder en el mismo canal
                await message.reply({
                    content: result.content,
                    allowedMentions: { repliedUser: false } // No mencionar al usuario de nuevo
                });
            } else {
                // Error manejado desde el handler
                await message.reply({ 
                    content: result.content,
                    ephemeral: true // Solo visible para quien preguntó si es error de config
                });
            }

        } catch (error) {
            console.error('Error ejecutando respuesta de IA:', error);
            // Silenciar errores críticos para no spamear el chat
        }
    }
};

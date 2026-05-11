const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

// Historial de conversación por canal (simple memoria RAM)
// Estructura: { channelId: [ {role, content}, ... ] }
const chatHistory = new Map();

/**
 * Maneja la interacción con la IA vía OpenRouter
 * @param {string} messageContent - El mensaje del usuario
 * @param {string} channelId - ID del canal para mantener contexto
 * @param {Object} config - Configuración (apiKey, prompt, etc)
 */
async function getAIResponse(messageContent, channelId, config) {
    const { apiKey, systemPrompt, model } = config;

    // Inicializar historial si no existe
    if (!chatHistory.has(channelId)) {
        chatHistory.set(channelId, [
            { role: 'system', content: systemPrompt || 'Eres un asistente útil.' }
        ]);
    }

    const history = chatHistory.get(channelId);

    // Agregar mensaje del usuario al historial
    history.push({ role: 'user', content: messageContent });

    // Mantener solo los últimos 10 mensajes (5 intercambios) para no gastar tokens innecesarios
    // El sistema siempre se mantiene en la posición 0
    if (history.length > 11) {
        history.splice(1, history.length - 11);
    }

    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: model || 'qwen/qwen-2.5-7b-instruct', // Modelo gratis recomendado
                messages: history,
                max_tokens: 1000,
                temperature: 0.7,
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    // Headers opcionales para OpenRouter
                    'HTTP-Referer': 'https://github.com/tu-usuario/nova-bot', 
                    'X-Title': 'Nova Bot Discord'
                }
            }
        );

        const aiContent = response.data.choices[0].message.content;

        // Guardar respuesta de la IA en el historial
        history.push({ role: 'assistant', content: aiContent });

        return { success: true, content: aiContent };

    } catch (error) {
        console.error('❌ Error en IA (OpenRouter):', error.response?.data || error.message);
        
        // Mensaje de error amigable
        let errorMsg = 'Lo siento, tuve problemas para conectar con mi cerebro digital.';
        if (error.response?.status === 401) errorMsg = 'Error: API Key inválida o faltante.';
        if (error.response?.status === 429) errorMsg = 'Error: Demasiadas solicitudes, espera un momento.';
        
        return { success: false, content: errorMsg };
    }
}

/**
 * Limpia el historial de un canal específico
 */
function clearChannelHistory(channelId) {
    if (chatHistory.has(channelId)) {
        chatHistory.delete(channelId);
        return true;
    }
    return false;
}

module.exports = { getAIResponse, clearChannelHistory };

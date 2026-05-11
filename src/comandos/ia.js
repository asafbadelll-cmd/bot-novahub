const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { clearChannelHistory } = require('../sistemas/iaHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ia')
        .setDescription('Comandos relacionados con la Inteligencia Artificial')
        .addSubcommand(subcommand =>
            subcommand
                .setName('limpiar')
                .setDescription('Limpia el historial de conversación de la IA en este canal')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('configurar')
                .setDescription('Configura el canal de IA para este servidor (Solo Admin)')
                .addChannelOption(option =>
                    option.setName('canal')
                        .setDescription('El canal donde la IA responderá automáticamente a todos los mensajes')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('estado')
                .setDescription('Muestra el estado actual de la configuración de IA')
        ),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        // 1. Subcomando: Limpiar historial
        if (subcommand === 'limpiar') {
            const cleared = clearChannelHistory(interaction.channel.id);
            
            const embed = new EmbedBuilder()
                .setColor(cleared ? 0x00FF00 : 0xFFA500)
                .setTitle('🧹 Historial de IA')
                .setDescription(cleared 
                    ? 'La memoria de la IA en este canal ha sido borrada. ¡Empezamos de cero!' 
                    : 'No había historial guardado en este canal.')
                .setFooter({ text: `Solicitado por ${interaction.user.tag}` })
                .setTimestamp();

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // 2. Subcomando: Configurar canal (Solo Admin)
        if (subcommand === 'configurar') {
            if (!interaction.member.permissions.has('ManageGuild')) {
                return interaction.reply({ 
                    content: '❌ Necesitas permisos de **Administrador** para usar este comando.', 
                    ephemeral: true 
                });
            }

            const channel = interaction.options.getChannel('canal');
            
            // Nota: En un bot real, aquí guardarías el ID en una base de datos.
            // Para este ejemplo, usaremos una variable global simulada o console.log
            // Idealmente deberías tener un archivo config.json o DB.
            
            // Simulación de guardado (en producción usar DB)
            console.log(`[CONFIG] Canal de IA establecido para Guild ${interaction.guild.id}: ${channel.id}`);
            
            // Mensaje informativo sobre variables de entorno
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('⚙️ Configuración de IA')
                .setDescription(
                    `✅ El canal ${channel} ha sido seleccionado.\n\n` +
                    `**Importante:** Para que la IA responda automáticamente aquí, asegúrate de tener configurado:\n` +
                    `- \`AI_CHANNEL_ID=${channel.id}\` en tu archivo \`.env\`\n` +
                    `- \`OPENROUTER_API_KEY=tu_clave\` en tu archivo \`.env\``
                )
                .addFields({
                    name: '📝 Nota',
                    value: 'La IA también responderá si la mencionas (`@Bot`) en cualquier canal, siempre que tengas la API Key configurada.'
                })
                .setFooter({ text: 'Reinicia el bot si acabas de editar el .env' })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }

        // 3. Subcomando: Estado
        if (subcommand === 'estado') {
            const apiKey = process.env.OPENROUTER_API_KEY ? '✅ Configurada' : '❌ Faltante';
            const model = process.env.AI_MODEL || 'qwen/qwen-2.5-7b-instruct';
            const aiChannel = process.env.AI_CHANNEL_ID || 'No especificado (Solo responde a menciones)';

            const embed = new EmbedBuilder()
                .setColor(0x9B59B6)
                .setTitle('🤖 Estado del Sistema IA')
                .addFields(
                    { name: 'API Key', value: apiKey, inline: true },
                    { name: 'Modelo', value: `\`${model}\``, inline: true },
                    { name: 'Canal Auto', value: aiChannel, inline: false },
                    { 
                        name: 'Cómo usar', 
                        value: 
                            '1. Menciona al bot: `@Nova hola`\n' +
                            '2. O escribe en el canal configurado en `.env`\n' +
                            '3. Usa `/ia limpiar` para borrar el contexto.'
                    }
                )
                .setFooter({ text: 'Powered by OpenRouter & Qwen' })
                .setTimestamp();

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};

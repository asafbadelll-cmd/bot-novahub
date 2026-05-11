# 🚀 Changelog - Nova Hub Bot

## v1.0.0 (Release Inicial) - 2024

### ✨ Características Principales

#### 🛡️ Sistema de Moderación (9 comandos)
- `/ban` - Banea usuarios con opción de eliminar mensajes
- `/kick` - Expulsa usuarios del servidor
- `/mute` - Silencia temporalmente (1-1440 minutos)
- `/unmute` - Quita el silencio
- `/purge` - Elimina 1-100 mensajes (con filtro por usuario)
- `/warn` - Advierte a un usuario (envía DM)
- `/config` - Muestra configuración del servidor
- `/userinfo` - Info detallada de usuario (con banner)
- `/serverinfo` - Info completa del servidor

#### 🤖 Inteligencia Artificial
- Integración con **OpenRouter API**
- Modelo **Qwen 2.5 7B** (gratuito)
- Respuestas por mención (`@Nova`)
- Canal dedicado opcional para respuestas automáticas
- Memoria de contexto (últimos 10 mensajes por canal)
- Comandos de gestión:
  - `/ia limpiar` - Borra historial del canal
  - `/ia configurar` - Establece canal automático
  - `/ia estado` - Ver configuración actual

#### 🔒 Sistemas de Seguridad Automáticos
- **Anti-Groserías**: Detecta y elimina lenguaje inapropiado, mute tras 3 advertencias
- **Anti-Spam**: Detecta 5+ mensajes en 3 segundos, aplica mute de 10 min
- **Anti-Links**: Bloquea enlaces no permitidos (permite dominios seguros como YouTube, Twitch, Discord)

#### 🎉 Eventos de Comunidad
- **Bienvenida**: Mensaje embed + DM personalizado al nuevo miembro
- **Despedida**: Notificación en canal de logs con estadísticas
- **Logging avanzado**: Registro de actividades en archivos y consola

#### 📊 Comandos de Información
- `/ping` - Muestra latencia del mensaje y API WebSocket
- `/hola` - Saludo personalizado al usuario
- `/info` - Información del bot con embed moderno

### 📁 Estructura del Proyecto

```
src/
├── index.js              # Punto de entrada principal
├── comandos/
│   ├── ban.js
│   ├── config.js
│   ├── hola.js
│   ├── ia.js             # Gestión de IA
│   ├── info.js
│   ├── kick.js
│   ├── mute.js
│   ├── ping.js
│   ├── purge.js
│   ├── serverinfo.js
│   ├── unmute.js
│   ├── userinfo.js
│   └── warn.js
├── eventos/
│   ├── clientReady.js    # Evento ready optimizado
│   ├── guildMemberAdd.js # Bienvenidas
│   ├── guildMemberRemove.js # Despedidas
│   ├── interactionCreate.js # Ejecución de comandos
│   └── messageCreate.js  # Sistema de IA por mensajes
└── sistemas/
    ├── antiGroserias.js  # Filtro de lenguaje
    ├── antiLinks.js      # Bloqueo de enlaces
    ├── antiSpam.js       # Detección de spam
    ├── iaHandler.js      # Manejador de IA con contexto
    └── logger.js         # Sistema de logs
```

### ⚙️ Configuración Requerida (.env)

```env
# Token del Bot (Discord Developer Portal)
DISCORD_TOKEN=tu_token_aqui

# ID del Cliente (para OAuth2)
CLIENT_ID=tu_client_id_aqui

# Guild ID (opcional, para registro rápido de comandos)
GUILD_ID=tu_guild_id_aqui

# OpenRouter API Key (https://openrouter.ai/keys)
OPENROUTER_API_KEY=sk-or-v1-tu_clave_aqui

# Modelo de IA (Qwen 2.5 7B gratuito)
AI_MODEL=qwen/qwen-2.5-7b-instruct

# Canal para respuestas automáticas de IA (opcional)
AI_CHANNEL_ID=123456789012345678

# Personalidad de la IA (opcional)
AI_SYSTEM_PROMPT=Eres Nova, un asistente útil y amigable.
```

### 🔧 Intents Necesarios

El bot requiere los siguientes intents habilitados en [Discord Developer Portal](https://discord.com/developers/applications):

- ✅ Guilds
- ✅ GuildMembers
- ✅ GuildBans
- ✅ GuildMessages
- ✅ MessageContent (**CRÍTICO** para IA y moderación)
- ✅ GuildPresences
- ✅ DirectMessages

⚠️ **Importante**: Los intents marcados como "Privileged" (Guild Members, Message Content, Presence) deben ser aprobados manualmente en el portal de desarrolladores si tu bot está en más de 100 servidores.

### 📦 Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/nova-hub-bot.git
cd nova-hub-bot

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar bot
npm start
```

### 🛠️ Tecnologías Utilizadas

- **Node.js** >= 16.9.0
- **discord.js** v14.26.4
- **axios** para peticiones HTTP (IA)
- **dotenv** para variables de entorno
- **node-cache** para caché de mensajes (IA)

### 📝 Licencia

MIT License - Nova Hub Team

### 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor abre un issue o pull request.

---

**Total de comandos**: 13  
**Total de eventos**: 7  
**Sistemas automáticos**: 5  
**Líneas de código**: ~2000+

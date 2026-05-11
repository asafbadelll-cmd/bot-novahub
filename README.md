# 🤖 Discord Bot - Nova Hub

Bot de Discord de código abierto con comandos slash (/), sistemas de moderación automática, eventos de bienvenida y **IA integrada con OpenRouter**.

## 📋 Características Principales

- ✅ **Comandos de Moderación:** Ban, Kick, Mute, Unmute, Purge, Warn
- ✅ **Sistemas Automáticos:** Anti-groserías, Anti-spam, Anti-links
- ✅ **Eventos:** Bienvenidas y despedidas personalizadas
- ✅ **Información:** Comandos userinfo, serverinfo, config
- ✅ **Logging:** Sistema de logs de actividad de usuarios
- ✅ **🤖 IA Integrada:** Respuestas automáticas con Qwen (OpenRouter)
- ✅ **API Moderna:** discord.js v14 con EmbedBuilder

## 📁 Estructura del Proyecto

```
├── src/
│   ├── comandos/           # Comandos slash (/)
│   │   ├── ban.js          🔨 Banear usuarios
│   │   ├── kick.js         👢 Expulsar usuarios
│   │   ├── mute.js         🔇 Silenciar usuarios
│   │   ├── unmute.js       🔊 Quitar silencio
│   │   ├── purge.js        🗑️ Limpiar mensajes
│   │   ├── warn.js         ⚠️ Advertir usuarios
│   │   ├── config.js       ⚙️ Configuración del servidor
│   │   ├── userinfo.js     👤 Info de usuario
│   │   ├── serverinfo.js   🏠 Info del servidor
│   │   ├── ping.js         📶 Latencia del bot
│   │   ├── hola.js         👋 Saludo
│   │   ├── info.js         ℹ️ Información del bot
│   │   └── ia.js           🤖 Comandos de IA (limpiar, configurar, estado)
│   ├── eventos/            # Manejadores de eventos
│   │   ├── ready.js              # Evento de inicio
│   │   ├── interactionCreate.js  # Manejo de interacciones
│   │   ├── messageCreate.js      # 💬 Respuestas con IA
│   │   ├── antiGroserias.js      # 🚫 Anti-lenguaje inapropiado
│   │   ├── antiSpam.js           # ⚡ Anti-spam
│   │   ├── antiLinks.js          # 🔗 Anti-enlaces no permitidos
│   │   ├── bienvenida.js         # 👋 Bienvenida de miembros
│   │   └── despedida.js          # 👋 Despedida de miembros
│   ├── sistemas/         # Sistemas del bot
│   │   ├── logger.js     # Sistema de logs
│   │   └── iaHandler.js  # 🧠 Manejador de IA (OpenRouter)
│   ├── logs/             # Logs de actividad de usuarios
│   └── index.js          # Punto de entrada principal
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Instalación

1. Clona el repositorio
2. Instala las dependencias:
```bash
npm install
```

3. Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

4. Edita el archivo `.env` y agrega tu token de Discord y configuración de IA:
```env
DISCORD_TOKEN=tu_token_aqui
CLIENT_ID=tu_client_id_aqui

# Configuración de IA (OpenRouter)
OPENROUTER_API_KEY=sk-or-v1-tu_clave_aqui
AI_MODEL=qwen/qwen-2.5-7b-instruct
AI_CHANNEL_ID=123456789012345678  # Opcional: canal para respuestas automáticas
AI_SYSTEM_PROMPT=Eres Nova, un asistente útil y amigable.
```

## 💻 Uso

Para iniciar el bot:
```bash
npm start
```

Para desarrollo con auto-recarga (Node 18+):
```bash
npm run dev
```

## 🎯 Comandos Disponibles

### Moderación
| Comando | Descripción | Permisos |
|---------|-------------|----------|
| `/ban` | Banea a un usuario | BanMembers |
| `/kick` | Expulsa a un usuario | KickMembers |
| `/mute` | Silencia temporalmente | ModerateMembers |
| `/unmute` | Quita el silencio | ModerateMembers |
| `/purge` | Elimina mensajes | ManageMessages |
| `/warn` | Advierte a un usuario | ModerateMembers |

### Información
| Comando | Descripción |
|---------|-------------|
| `/userinfo [usuario]` | Info detallada de un usuario |
| `/serverinfo` | Info detallada del servidor |
| `/config` | Configuración del servidor |
| `/ping` | Latencia del bot |
| `/info [usuario]` | Información básica |
| `/hola` | Saludo al bot |
| `/ia limpiar` | 🧹 Limpia el historial de IA en el canal |
| `/ia configurar` | ⚙️ Configura el canal de IA (Admin) |
| `/ia estado` | 📊 Muestra el estado de la IA |

## 🤖 Sistema de IA

El bot integra inteligencia artificial mediante **OpenRouter** usando el modelo gratuito **Qwen 2.5 7B**.

### ¿Cómo funciona?

1. **Por mención:** Menciona al bot en cualquier canal (`@Nova hola`) y responderá con IA.
2. **Canal dedicado:** Configura un canal específico donde la IA responderá a TODOS los mensajes automáticamente.

### Comandos de IA

| Subcomando | Descripción | Permisos |
|------------|-------------|----------|
| `/ia limpiar` | Borra el historial de conversación en ese canal | Todos |
| `/ia configurar` | Establece el canal para respuestas automáticas | ManageGuild |
| `/ia estado` | Muestra configuración actual de la IA | Todos |

### Configuración de Variables de Entorno

```env
# API Key de OpenRouter (Obténla gratis en https://openrouter.ai/keys)
OPENROUTER_API_KEY=sk-or-v1-tu_clave_aqui

# Modelo a usar (Qwen 2.5 7B es gratuito y rápido)
AI_MODEL=qwen/qwen-2.5-7b-instruct

# Canal opcional para respuestas automáticas (sin necesidad de mención)
AI_CHANNEL_ID=123456789012345678

# Personalidad de la IA (opcional)
AI_SYSTEM_PROMPT=Eres Nova, un asistente virtual útil y amigable en Discord.
```

### Características de la IA

- 🧠 **Memoria de contexto:** Recuerda las últimas 10 mensagens por canal
- ⌨️ **Typing indicator:** Muestra "escribiendo..." mientras procesa
- 🛡️ **Manejo de errores:** Mensajes amigables si falla la API
- 🔒 **Seguro:** Ignora otros bots y requiere mención o canal configurado

## 🛡️ Sistemas Automáticos

### Anti-Groserías
- Detecta lenguaje inapropiado
- Elimina mensajes ofensivos
- Envía advertencias por DM
- Aplica mute automático tras 3 advertencias

**Configuración en `src/eventos/antiGroserias.js`:**
```javascript
const palabrasProhibidas = [
    'palabra1',
    'palabra2',
    // Agrega más palabras
];
```

### Anti-Spam
- Detecta spam de mensajes (5 mensajes en 3 segundos)
- Elimina mensajes y aplica mute de 10 minutos

**Configuración en `src/eventos/antiSpam.js`:**
```javascript
const SPAM_MESSAGES_LIMIT = 5;
const SPAM_TIME_WINDOW = 3000; // ms
const MUTE_DURATION = 600000; // 10 minutos
```

### Anti-Links
- Bloquea enlaces no permitidos
- Permite dominios específicos (YouTube, Twitch, Discord, etc.)

**Configuración en `src/eventos/antiLinks.js`:**
```javascript
const ALLOWED_LINKS = [
    'youtube.com',
    'twitch.tv',
    'discord.gg',
    // Agrega más dominios
];
```

## 🎉 Eventos

### Bienvenidas
- Mensaje embed en canal de bienvenida
- DM personalizado al nuevo miembro
- Muestra número de miembro y consejos

### Despedidas
- Notificación en canal de logs
- Fecha de creación y unión
- Miembros restantes

## 📝 Sistema de Logs

El bot guarda automáticamente logs de actividad en `src/logs/`:
- ✅ Mensajes enviados
- ✅ Comandos slash ejecutados
- ✅ Uniones al servidor
- ✅ Acciones de moderación

## 🔧 Cómo obtener el token

1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Crea una nueva aplicación
3. Ve a la sección "Bot" y crea un bot
4. Copia el token y pégalo en tu archivo `.env`
5. Invita el bot con los scopes: `bot` y `applications.commands`
6. Permisos recomendados: `Administrator` o selecciona los necesarios

## ⚙️ Requisitos

- Node.js >= 16.9.0
- discord.js ^14.26.4
- Permisos adecuados en el servidor

## 📄 Licencia

ISC

---

**Hecho con ❤️ para Nova Hub**

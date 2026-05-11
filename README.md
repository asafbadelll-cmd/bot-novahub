# bot-novahub
# Bot de Discord con Node.js

Este es un bot básico de Discord creado con Node.js, discord.js y dotenv.

## Requisitos previos

1. **Node.js** instalado (versión 16.9.0 o superior)
2. Un **token de bot** de Discord

## Configuración

### 1. Obtener el token del bot

1. Ve al [Portal de Desarrolladores de Discord](https://discord.com/developers/applications)
2. Crea una nueva aplicación
3. Ve a la sección "Bot" y crea un bot
4. Copia el token del bot

### 2. Configurar las variables de entorno

Edita el archivo `.env` y reemplaza los valores:

```env
DISCORD_TOKEN=tu_token_aqui
CLIENT_ID=tu_client_id_aqui
```

### 3. Invitar el bot a tu servidor

Usa la siguiente URL (reemplaza `CLIENT_ID` con tu ID de cliente):

```
https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=8&scope=bot
```

## Instalación

```bash
npm install
```

## Uso

Para iniciar el bot:

```bash
npm start
```

## Comandos disponibles

- `!hola` - El bot te saluda
- `!ping` - Muestra la latencia del bot
- `!info` - Muestra información sobre el bot

## Estructura del proyecto

```
├── .env              # Variables de entorno (token)
├── index.js          # Código principal del bot
├── package.json      # Dependencias y scripts
└── README.md         # Este archivo
```

## Notas de seguridad

⚠️ **Nunca compartas tu token de Discord** ni lo subas a repositorios públicos. El archivo `.env` está incluido en `.gitignore` por seguridad.

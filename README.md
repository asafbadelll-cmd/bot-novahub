# bot-novahub
# Discord Bot con Node.js

Bot de Discord de código abierto con comandos slash (/) y sistema de logging de usuarios.

## Estructura del Proyecto

```
├── src/
│   ├── comandos/      # Comandos slash (/)
│   │   ├── hola.js
│   │   ├── ping.js
│   │   └── info.js
│   ├── eventos/       # Manejadores de eventos
│   │   ├── ready.js
│   │   └── interactionCreate.js
│   ├── sistemas/      # Sistemas del bot
│   │   └── logger.js
│   ├── logs/          # Logs de actividad de usuarios
│   └── index.js       # Punto de entrada principal
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Instalación

1. Clona el repositorio
2. Instala las dependencias:
```bash
npm install
```

3. Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

4. Edita el archivo `.env` y agrega tu token de Discord:
```
DISCORD_TOKEN=tu_token_aqui
```

## Uso

Para iniciar el bot:
```bash
npm start
```

Para desarrollo con auto-recarga (Node 18+):
```bash
npm run dev
```

## Comandos Disponibles

- `/hola` - Saluda al bot
- `/ping` - Muestra la latencia del bot
- `/info [usuario]` - Muestra información de un usuario

## Sistema de Logs

El bot guarda automáticamente logs de actividad de cada usuario en `src/logs/`. Cada usuario tiene su propio archivo `.log` con su ID de Discord.

Se registran:
- ✅ Mensajes enviados
- ✅ Comandos slash ejecutados
- ✅ Uniones al servidor

## Cómo obtener el token

1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Crea una nueva aplicación
3. Ve a la sección "Bot" y crea un bot
4. Copia el token y pégalo en tu archivo `.env`
5. Invita el bot a tu servidor usando la URL de OAuth2 con los scopes: `bot` y `applications.commands`

## Licencia

ISC

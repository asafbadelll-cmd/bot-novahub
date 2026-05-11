# bot-novahub
# Discord Bot con Node.js

Bot de Discord creado con Node.js, discord.js y dotenv.

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

## Comandos disponibles

- `!hola` - El bot te saluda
- `!ping` - Muestra la latencia del bot

## Cómo obtener el token

1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Crea una nueva aplicación
3. Ve a la sección "Bot" y crea un bot
4. Copia el token y pégalo en tu archivo `.env`
5. Invita el bot a tu servidor usando la URL de OAuth2

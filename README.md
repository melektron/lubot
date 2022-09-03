# LiveUnderflowBot

A bot to monitor LiveOverflow's minecraft server using discord.

## Current Features
 - beacon monitor 
   - mining alerts

## Setup

### Installation

Clone repository and run
```bash
npm install
```
in the project root directory to install node packages.

### Configuration

Create src/secrets.json with contents:
```json
{
    "token": "...",
    "botid": "...",
    "outputChannels": [
        "..."
    ],
    "inputChannels": [
        "..."
    ],
    "connectionData": {
        "host": "some.ip.or.domain",
        "port": 25565,
        "username": "Player",
        "password": "password",
        "auth": "microsoft"
    }
}
```

 - __```"token"```__: The Discord bot token (string).
 - __```"botid"```__: the user ID (string) of the Discord bot.
 - __```"outputChannels"```__: List of Discord channel IDs (string) the bot should send it's messages to.
 - __```"inputChannels"```__:  List of Discord channel IDs (string) to listen for bot commands.
 - __```"connectionData"```__: Connection and login data for the Minecraft bot. 
 
### Connection data

When logging in to a server in offline mode, any username can be chosen and the password can be left empty.

When logging in using a Microsoft account the username has to be your Microsoft account email and the password the Microsoft account password. The optional __```"auth"```__ field also has to have the value __```"microsoft"```__, otherwise it will try to log in using a mojang account.

When logging in using a Mojang or Legacy account, the username has to be your account email or player name and the password your Mojang account password. The __```"auth"```__ field has to be empty or set to __```"mojang"```__. (Also you should migrate your account)

## Running

Run the project from the project root directory:
```bash
node .
```
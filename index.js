const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10'); 
const config = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
client.commands = new Collection();

const DISCORD_TOKEN = config.token; 
const CLIENT_ID = '1295138498193391688';
const GUILD_ID = '1295137493854720072'; 

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const commands = [];

for (const file of commandFiles) {
    try {
        const command = require(path.join(commandsPath, file));
        if (command.data && command.data.name) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
            console.log(`Loaded command: ${command.data.name}`);
        } else {
            console.error(`Command in file ${file} is missing a name.`);
        }
    } catch (error) {
        console.error(`Error loading command ${file}: ${error.message}`);
    }
}

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(`Error registering commands: ${error}`);
    }
})();

client.once('ready', () => {
    console.log('Bot is ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
    }
});

client.login(DISCORD_TOKEN);

import { Client, IntentsBitField } from "discord.js";
import { configDotenv } from "dotenv";
configDotenv()

import eventHandler from "./handlers/eventHandler.js";

const client = new Client({
    intents:[
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        
    ]
});

eventHandler(client)

client.login(process.env.TOKEN)
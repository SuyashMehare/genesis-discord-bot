import { Client, IntentsBitField } from "discord.js";
import { configDotenv } from "dotenv";
configDotenv()

import eventHandler from "./handlers/eventHandler.js";
import mongoose from "mongoose";

const client = new Client({
    intents:[
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildPresences,
    ]
});

(async () => {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("db connected successfully...");
    
    client.login(process.env.TOKEN)
})()

eventHandler(client)

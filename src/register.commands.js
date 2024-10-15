import { ApplicationCommandOptionType, ApplicationCommandType, REST, Routes } from 'discord.js';
import { config } from 'dotenv';
config()

async function registerCommands(){

  const commands = [
    {
      name: "addition",
      description:"Addition of two numbers",
      type:ApplicationCommandType.ChatInput,
      options:[
        {
          name:"first",
          description:"first parameter",
          type:ApplicationCommandOptionType.Number,
          choices:[
            {
              name:"five",
              value: 5
            } ,{
              name:"four",
              value: 4
            },
          ],
          required:true
        },
        {
          name:"second",
          description:"second parameter",
          type:ApplicationCommandOptionType.Number,
          required:true
        }
      ],
      required:true
    },
    {
      name:"links",
      description: "Discription for Embed links",
      type:ApplicationCommandType.ChatInput
    }
  ];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

Routes.applicationGuildCommands
try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID,process.env.GUILD_ID),
   { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}}

await registerCommands()

export{
  registerCommands
}
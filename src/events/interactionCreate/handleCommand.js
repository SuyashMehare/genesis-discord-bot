import { config } from "dotenv";
import { getLocalCommands } from "../../utils/getLocalCommands.js";
import { Client, ChatInputCommandInteraction } from "discord.js";

config()

/**
 * @param {Client} client
 * @param {ChatInputCommandInteraction} interaction
 * 
 */
export default async (client,interaction) => {
    if(!interaction.isChatInputCommand()) return;
    /**
     * 1. Check: `interaction.commandName` is present locally
     * 2. Check: If commandObject marked as `testOnly`. Check current origin guild is testserver
     * 3. Check: If commandObject marked as `devOnly`. Check current interaction originator (member) is developer
     * 4. Check: If current member has enough permissions to run current command
     * 5. Check: If bot has enough permissions to run current command on origin guild
     * 6. Run:   Run respective callback to commandObject
     */

    const localCommands = await getLocalCommands();
    
    try {
        
        const commandObject = localCommands.find(
            (cmd) => cmd.name === interaction.commandName
        );

        if (!commandObject) {
            return;
        }
        
        if(commandObject.devOnly){
            const devs = process.env.DEVS || [];

            if(!devs.includes(interaction.member.id)){
                return interaction.reply({
                    content: "DevOnly command",
                    ephemeral: true
                })
            }
        }

        if(commandObject.testOnly){
            const testServer = process.env.TESTSERVER || ""

            if (!(testServer === interaction.guild.id)) {
                return interaction.reply({
                    content: "Only TestServer command",
                    ephemeral: true
                });
            }
        }

        if(commandObject.permissionsRequired?.length){

            for (const permission of commandObject.permissionsRequired) {
                if(!interaction.member.permissions.has(permission)){
                    return interaction.reply({
                        content: 'Not enough permissions.',
                        ephemeral: true,
                    })
                }
            }
        }

        let bot = interaction.guild.members.me
        // console.log(bot.permissions.toArray());

        if (commandObject.botPermissions?.length) {

                for (const permission of commandObject.botPermissions) {
                    if(!bot.permissions.has(permission)){
                        return interaction.reply({
                            content: "I don't have enough permissions.",
                            ephemeral: true,
                        })
                    }
            }
        }


        await commandObject.callback(client,interaction);
    } catch (error) {
        console.log("Error while handling command "+ interaction.commandName ,error);
    }

}
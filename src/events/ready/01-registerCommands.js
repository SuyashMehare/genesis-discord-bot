import { configDotenv } from "dotenv";
import { getApplicationCommands } from "../../utils/getApplicationCommands.js";
import { getLocalCommands } from "../../utils/getLocalCommands.js";
import { checkCommandDiff } from "../../utils/checkCommandDiff.js";

configDotenv()

export default async (client) => {
    try {
        const localCommands = await getLocalCommands();
        const applicationCommands = await getApplicationCommands(client,process.env.GUILD_ID);
        
        for (const localCommand of localCommands) {
            const { name, description, options} = localCommand;
            
            const existingCommnd  = await applicationCommands.cache.find(
                (cmd) => cmd.name === name
            )

            if(existingCommnd){
                if (localCommand.deleted) {
                    await applicationCommands.delete(existingCommnd.id);
                    console.log(`🗑 Command is removed ${name} `);
                    continue;
                }

                if(checkCommandDiff(existingCommnd,localCommand)){
                    await applicationCommands.edit(existingCommnd.id, 
                        { description, options }
                    )
                    console.log(`🗑 Command is edited ${name} `);
                }
            }else{
                applicationCommands.create({
                    name,
                    description,
                    options
                })
                console.log(`👍 Registered command "${name}."`);
            }    

        }       
        
    } catch (error) {
        console.log('error while registering commands',error);
        
    }
}
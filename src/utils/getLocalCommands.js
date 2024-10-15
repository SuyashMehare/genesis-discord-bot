import { pathToFileURL } from "url";
import { getAllFilesOrFolders } from "./getAllFilesOrFolders.js";
import path from "path";


// @return objects of commands
export const getLocalCommands = async (ignoreCommands = []) => {

    let localCommands = [];
    const commandFolders = getAllFilesOrFolders(path.join(import.meta.dirname,'..','commands'),true);

    for (const commandFolder of commandFolders) {
       const commandFiles = getAllFilesOrFolders(commandFolder)

       for (const commandFile of commandFiles) {
        const commandsObject = await import(pathToFileURL(commandFile));

        if(ignoreCommands.includes(commandsObject.default.name)){
            continue;
        }
        
        localCommands.push(commandsObject.default);
       }
    }

    return localCommands;
}

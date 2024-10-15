import path from "path";
import { pathToFileURL } from "url";
import {getAllFilesOrFolders} from "../utils/getAllFilesOrFolders.js";

export default (client) => {
    const dirname = path.join(import.meta.dirname,'..','events');
    const eventFolders = getAllFilesOrFolders(dirname,true)

    for (const eventFolder of eventFolders) {
        const eventFiles = getAllFilesOrFolders(eventFolder).sort((a,b) => a > b);
        const eventName = eventFolder.replace(/\\/g,'/').split('/').pop();
        
        for (const eventFile of eventFiles) {
                    
            client.on(eventName, async(arg) => {            
                for (const eventFile of eventFiles) {
                    const eventFunction = await import(pathToFileURL(eventFile));
                    eventFunction.default(client,arg);
                }
            })
        }
    }
}


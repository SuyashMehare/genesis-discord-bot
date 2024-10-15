import fs from "fs";
import path from "path";

export const getAllFilesOrFolders =  (directory, foldersOnly = false) => {

    const fileNames = [];

    const files = fs.readdirSync(directory, { withFileTypes:true })
    
    for(const file of files){
        const filepath = path.join(directory,file.name);
        
        if(foldersOnly){
            if(file.isDirectory()){
                fileNames.push(filepath)
            }
        }
        else{
            if(file.isFile()){
                fileNames.push(filepath)
            }
        }
    }
    
    return fileNames;
}
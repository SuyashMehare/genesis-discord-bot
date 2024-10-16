import { Client, Message } from "discord.js";
import { UserLevel } from "../../schema/userDiscordLevel.model.js";
import { getUserNewExpPoints } from "../../utils/getUserExpPoints.js"

/**
 * @param {Client} client
 * @param {Message} message
 * 
 */

const cooldown = new Set();

export default async (client,message) => {
    if(!message.inGuild() || 
        message.author.bot ||  
        cooldown.has(message.member.id)
    ) return;

    const guildId = message.guildId;
    const userId = message.member.id;

    try {
        let userLevel = await UserLevel.findOne({userId,guildId});
    
        if(!userLevel){
            userLevel = await UserLevel.create({userId,guildId});
        }
    
        cooldown.add(userId);
        setTimeout(() => { cooldown.delete(userId);},1000*60)
    
        userLevel.xp = getUserNewExpPoints(userLevel.xp)
        await userLevel.save()
    } catch (error) {
        console.log(`Erro while mutatuing user xp....`,error);
    }
}
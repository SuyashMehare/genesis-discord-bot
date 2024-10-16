import { ApplicationCommandOptionType, Attachment, AttachmentBuilder, Client } from "discord.js";
import { UserLevel } from "../../schema/userDiscordLevel.model.js";
import canvacord, { Font } from "canvacord";
import getMemberGuildLevel from "../../utils/getMemberGuildLevel.js";

export default{
    
    /**
     * @param {Client} client
     * @param {import("discord.js").Interaction} interaction

    */
    callback: async (client,interaction) => {
        if(interaction.user.bot || !interaction.isChatInputCommand) return;
        
        await interaction.deferReply()

        if(!interaction.inGuild()){
            return interaction.editRely('You can only run this command inside a server.');
        }
        
        const targetUserId = interaction.options.get('target-user')?.value || 
            interaction.member.id;
        
        const targetUser = await interaction.guild.members.fetch(targetUserId);
        
        const userLevel = await UserLevel.findOne({
            userId: targetUser.user.id,
            guildId: targetUser.guild.id
        });

        if(!userLevel){
          return interaction.editReply(
            targetUserId === interaction.user.id ? 
            "You should have at at least one message on channel" :
            "Target user not yet start conversation on channel");
        };
        
        const { xp } = userLevel;
        const status = targetUser.presence?.status || "offline"; // todo: presence fault

        const ranks = await UserLevel.find({ guildId: interaction.guildId }).sort('-xp').select("-_id");
        const targetUserRank = ranks.findIndex((value) => value.userId == targetUser.id) + 1;

        Font.loadDefault()
        const rankCard = new canvacord.RankCardBuilder()
            .setUsername(`#${targetUser.user.username}`)
            .setDisplayName(targetUser.displayName)
            .setAvatar(targetUser.user.displayAvatarURL({size: 256}))
            .setRank(targetUserRank)
            .setLevel(getMemberGuildLevel(xp))
            .setCurrentXP(xp)
            .setRequiredXP(getRequiredXP(xp))
            .setBackground("#23272a")
            .setStatus(status)
        
        const build = await rankCard.build();
        const attachement = new AttachmentBuilder(build);

        return interaction.editReply({ files:[attachement] });
    },

    name: 'level',
    description: 'Display discord progress of user',
    options:[
        {
            name: "target-user",
            description: "Discord progress of the target user",
            type: ApplicationCommandOptionType.Mentionable,
            required: false
        }
    ]
}

function getRequiredXP(xp) {
    // not yet logic implemented..
    return xp*10;
}
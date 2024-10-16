import {
    ApplicationCommandOptionType,
    Client,
    PermissionFlagsBits,
    
  }  from 'discord.js';
  
  export default {

    /**
     * 
     * @param {Client} client 
     * @param {import('discord.js').Interaction} interaction 
     */
    callback: async (client, interaction) => {
      /**
       * Check if interction is chatInput
       * {user,reason} : options
       * checks: notServerOwner, permission Should higher
       * guild.member.ban
       * reply
       */
      if (!interaction.isChatInputCommand()) {
        return;
      }

      await interaction.deferReply()

      const targetUserId = await interaction.options.get("target-user")
      const reason = await interaction.options.get("reason")?.value || "Reason is not provided"

      const targetUser = await interaction.guild.members.fetch(targetUserId)
      if (!targetUser) {
        return await interaction.editReply("That user doesn't exist in this server.");
      }

      if(targetUser.id === interaction.guild.ownerId){
        return interaction.editReply("You can not ban owner of the server");
      }

      const currentUserRolePosition = interaction.member.roles.highest.position;
      const targetUserRolePosition = targetUser.roles.highest.position
      const botRolePosition = interaction.guild.members.me.roles.highest.position;
      
      
      if (targetUserRolePosition >= currentUserRolePosition) {
        return await interaction.editReply(
          "You can't ban that user because they have the same/higher role than you.."
        );
      }
      
      if (targetUserRolePosition >= botRolePosition) {
        console.log('executed second');
        
        return await interaction.editReply(
          "I can't ban that user because they have the same/higher role than me."
        );
      }

      try {
        const ban = await targetUser.ban({reason})
        const msg = await interaction.editReply(
           `User ${targetUser} was banned\nReason: ${reason}`
        )

      } catch (error) {
        console.log(`There was an error when banning: ${error}`);
      }
    },

    name: 'ban',
    description: 'Bans a member!!!',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
      {
        name: 'target-user',
        description: 'The user to ban.',
        required: true,
        type: ApplicationCommandOptionType.Mentionable,
      },
      {
        name: 'reason',
        description: 'The reason for banning.',
        type: ApplicationCommandOptionType.String,
      },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
  };
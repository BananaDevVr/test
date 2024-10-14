const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js'); // Import ChannelType

module.exports = {
    data: new SlashCommandBuilder()
        .setName('post')
        .setDescription('Posts an image with a name in an embed.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Name of the post')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('image')
                .setDescription('Image to post')
                .setRequired(true)),

    async execute(interaction) {
        const requiredRoleId = ''; 

        if (!interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const name = interaction.options.getString('name'); 
        const image = interaction.options.getAttachment('image');

        const embed = new EmbedBuilder()
            .setColor(0x00AE86) 
            .setTitle(name)
            .setDescription(`**Posted by:** ${interaction.user.username}`) 
            .setImage(image.url) 
            .setTimestamp() 
            .setFooter({ text: 'Made by RoSports Central' }); 

        const channelId = ''; 
        const channel = await interaction.client.channels.fetch(channelId);

        if (!channel || channel.type !== ChannelType.GuildText) {
            return interaction.reply({ content: 'Could not find a valid text channel to send the post.', ephemeral: true });
        }

        try {
            await channel.send({ embeds: [embed] });
            await interaction.reply({ content: 'Your post has been submitted!', ephemeral: true });
        } catch (error) {
            console.error('Error sending message:', error);
            await interaction.reply({ content: 'There was an error while sending your post. Please try again later.', ephemeral: true });
        }
    },
};

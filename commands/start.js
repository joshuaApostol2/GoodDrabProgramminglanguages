module.exports = {
    name: 'start',
    description: 'Start command with tutorial',
    execute: (api, event) => {
        const buttons = [
            {
                type: "web_url",
                url: "https://www.facebook.com/profile.php?id=100088690249020",
                title: "Visit the Owner"
            },
            {
                type: "postback",
                title: "AI Command",
                payload: "AI_COMMAND"
            }
        ];

        const message = {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "🎉 Welcome to Nashbot! 🎉\n\n" +
                          "✨ Here’s how you can interact with me:\n\n" +
                          "1️⃣ Type `/ai [your question]` to get responses from the AI.\n" +
                          "2️⃣ Type `/help` to see all available commands.\n\n" +
                          "👤 Want to learn more about the creator? Just click the button below!",
                    buttons: buttons
                }
            }
        };

        api.sendMessage(message, event.threadID, event.messageID);
    }
};

const axios = require('axios');

module.exports = {
    name: 'ai',
    description: 'Interact with AI',
    execute: async (api, event, args) => {
        const input = args.join(' ');

        if (!input) {
            return api.sendMessage({ text: 'Please enter a prompt.' }, event.threadID, event.messageID);
        }

        api.sendMessage({ text: 'Processing your request...' }, event.threadID, event.messageID);

        try {
            const response = await axios.get(`${global.NashBot.END}new/gpt-3_5-turbo?prompt=${encodeURIComponent(input)}`);
            const result = response.data.result.reply;

            if (!result || typeof result !== 'string') {
                throw new Error('No valid response received from the API.');
            }

            api.sendMessage({ text: `🤖 AI Response\n━━━━━━━━━━━━━━━━━━━\n${result}` }, event.threadID, event.messageID);
        } catch (error) {
            api.sendMessage({ text: `An error occurred: ${error.message}` }, event.threadID, event.messageID);
        }
    },
};

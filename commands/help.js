const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'help',
    description: 'Help command to list available commands',
    execute: (api, event) => {
        const commandsDir = path.join(__dirname);
        const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js') && file !== 'help.js');

        const commandList = commandFiles.map(file => {
            return `❍ ${file.replace('.js', '')}`;
        });

        const helpMessage = `
╔═ஜ۩۞۩ஜ═╗
${commandList.join('\n')}
╚═ஜ۩۞۩ஜ═╝`;

        api.sendMessage({ text: helpMessage }, event.threadID, event.messageID);
    }
};

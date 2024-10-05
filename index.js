const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(bodyParser.json());
const PORT = process.env.PORT || 8084;

const PAGE_ACCESS_TOKEN = '';
const VERIFY_TOKEN = 'nashbot';
const COMMANDS_DIR = path.join(__dirname, 'commands');

app.get('/webhook', (req, res) => {
    const { mode, verify_token, challenge } = req.query;
    if (mode && verify_token === VERIFY_TOKEN) {
        return res.status(200).send(challenge);
    }
    return res.sendStatus(403);
});

app.post('/webhook', (req, res) => {
    const body = req.body;

    if (body.object !== 'page') return res.sendStatus(404);

    body.entry.forEach(entry => {
        entry.messaging.forEach(event => {
            const sender_psid = event.sender.id;
            event.message ? handleMessage(sender_psid, event.message) : handlePostback(sender_psid, event.postback);
        });
    });
    res.status(200).send('EVENT_RECEIVED');
});

const handleMessage = (sender_psid, received_message) => {
    const messageText = (received_message.text || '').toLowerCase().trim();
    if (!messageText) return;

    const command = loadCommand(messageText.split(' ')[0]);
    if (command) {
        command.execute(
            { sendMessage: (message) => callSendAPI(sender_psid, message) },
            { senderID: sender_psid, threadID: sender_psid, messageID: received_message.mid },
            messageText.split(' ').slice(1)
        );
    } else {
        callSendAPI(sender_psid, { text: "Sorry, I don't recognize that command." });
    }
};

const handlePostback = (sender_psid, postback) => {
    if (postback.payload === 'GET_STARTED') {
        // Optional: Add functionality for GET_STARTED postback
    }
};

const callSendAPI = async (sender_psid, response) => {
    try {
        await axios.post(`https://graph.facebook.com/v13.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
            recipient: { id: sender_psid },
            message: response,
        });
        console.log('Message sent successfully');
    } catch (error) {
        console.error('Unable to send message:', error.response?.data || error.message);
    }
};

const loadCommand = (commandName) => {
    const commandFile = path.join(COMMANDS_DIR, `${commandName}.js`);
    return fs.existsSync(commandFile) ? require(commandFile) : null;
};

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));



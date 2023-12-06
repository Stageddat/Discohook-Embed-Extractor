const axios = require('axios');
const express = require('express');
const app = express();

app.get('/getEmbed', async (req, res) => {
    let url = req.query.url;
    let Url;
    try {
        Url = new URL(url);
        if (Url.hostname === 'share.discohook.app') {
            const response = await axios.get(url);
            Url = new URL(response.request.res.responseUrl);
        }
        if ('discohook.org' !== Url.hostname) {
            throw new Error('Invalid URL');
        }
        let data = Url.searchParams.get('data'); // base64
        if (!data) {
            throw new Error('Invalid URL');
        }
        data = JSON.parse(Buffer.from(data, 'base64').toString());
        const messages = data.messages;
        let messagesData = [];
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i].data;
            messagesData.push(message);
        }
        res.json(messagesData);
    } catch (e) {
        res.json({message: 'Error: ' + e.message});
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
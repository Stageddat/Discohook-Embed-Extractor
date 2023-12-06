const fs = require('fs');
const axios = require('axios');

async function getEmbed(url) {
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
        let data = Url.searchParams.get('data');
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
        fs.writeFileSync('embed.json', JSON.stringify(messagesData, null, 2));
    } catch (e) {
        console.log(e.message);
    }
}

getEmbed('https://share.didsascohook.app/go/ID');

const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const convertTextToAudio = require('./lib/convertaudio');
const { unlinkSync } = require('node:fs');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: 'new',
  },
});

client.initialize();

client.on('loading_screen', (percent, message) => {
  console.log('LOADING SCREEN', percent, message);
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
  console.log('AUTHENTICATED');
});

client.on('auth_failure', (msg) => {
  console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
  console.log('READY');
});

client.on('message', async (msg) => {
  console.log(`${msg._data.notifyName}: ${msg.body}`);

  if (msg.body.startsWith('!say ')) {
    const reply = msg.body.slice(5);

    const chat = await msg.getChat();

    chat.sendStateRecording();

    convertTextToAudio(reply)
      .then(async () => {
        setTimeout(() => {
          const audio = './src/assets/audio.ogg';
          const media = MessageMedia.fromFilePath(audio);
          chat.sendMessage(media, { sendAudioAsVoice: true });

          chat.clearState();
          unlinkSync(audio);
        }, 3000);
      })
      .catch((error) => {
        console.error('Error en la conversión:', error);
      });
  }
});

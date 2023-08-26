const dotenv = require('dotenv');
dotenv.config();

const voice = require('elevenlabs-node');
const fs = require('fs-extra');

const apiKey = process.env.ELEVEN_API;
const voiceID = process.env.ELEVEN_LABS_VOICE_ID;

function convertTextToAudio(msg) {
  try {
    const fileName = './src/assets/audio.mp3';
    const textInput = msg;
    const stability = '0.8';
    const similarityBoost = '0.59';
    const modelId = 'eleven_multilingual_v1';

    voice
      .textToSpeech(
        apiKey,
        voiceID,
        fileName,
        textInput,
        stability,
        similarityBoost,
        modelId
      )
      .then((res) => {
        console.log(res);
      });
  } catch (error) {
    console.log(error);
  }
}

module.exports = convertTextToAudio;

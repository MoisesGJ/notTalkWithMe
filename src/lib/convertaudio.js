const ffmpeg = require('fluent-ffmpeg');
const { promisify } = require('util');
const fs = require('fs');
const exists = promisify(fs.exists);
const createAudio = require('./audio');

function convertTextToAudio(msg) {
  try {
    createAudio(msg);
  } catch (error) {
    console.error('Error al crear el audio:', error);
    return Promise.reject(error);
  }

  return new Promise(async (resolve, reject) => {
    const inputFilePath = './src/assets/audio.mp3';
    const outputFilePath = './src/assets/audio.ogg';

    async function waitForInputFile() {
      while (!(await exists(inputFilePath))) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    try {
      await waitForInputFile();

      ffmpeg()
        .input(inputFilePath)
        .audioCodec('libopus')
        .toFormat('ogg')
        .on('end', () => {
          fs.unlinkSync(inputFilePath);
          resolve();
        })
        .on('error', (err) => {
          console.error('Error:', err);
          reject(err);
        })
        .save(outputFilePath);
    } catch (error) {
      console.error('Error al convertir:', error);
      reject(error);
    }
  });
}

module.exports = convertTextToAudio;

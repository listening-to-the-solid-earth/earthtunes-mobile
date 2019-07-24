const axios = require('axios');
const WaveFile = require('wavefile');
const fs = require('fs');

// API Params
const DATE = "2019-05-30"
const TIME = "09:00:00"
const STATION = 'L44A'
const NET = 'NW'
const LOCATION = '00'
const CHANNEL = 'HHZ'
const DURATION = "7200"  // 2 hours
const URL = "http://service.iris.edu/irisws/timeseries/1/query";

// Math Params
const FIXED_AMP = 5e-5;
const HALF_PI = Math.PI / 2;
const SPEED_FACTOR = 800;

// Audiofile params
const CHANNEL_COUNT = 1;
const BIT_DEPTH = '32';


const params = {
  net: NET,
  sta: STATION,
  loc: LOCATION,
  cha: CHANNEL,
  starttime: `${DATE}T${TIME}`,
  duration: DURATION,
  demean: true,
  scale: 'auto',
  output: 'ascii1'
}

axios.get(URL, { params }).then(resp => {
  const responseLines = resp.data.split('\n');
  const metadata = responseLines[0];
  // E[0] 
  //   TIMESERIES NW_L44A_00_HHZ_D, 720001 samples, 100 sps, 2019-05-30T09:00:00.000000, SLIST, FLOAT, M/S
  const sampleCount = metadata.split(' ')[2];
  const sampleRate = metadata.split(' ')[4]; // sps
  const stringData = responseLines.slice(1, responseLines.length - 1);
  const soundData = stringData.map(d => {
    const amplitude = parseFloat(d);
    const scaledAmplitude = Math.pow(2, 31) * Math.atan(amplitude / FIXED_AMP) / HALF_PI ;
    return scaledAmplitude;
  });

  const effectiveSampleRate = sampleRate * SPEED_FACTOR;
  const wav = new WaveFile();
  wav.fromScratch(CHANNEL_COUNT, effectiveSampleRate, BIT_DEPTH, soundData);
  fs.writeFileSync('./output.wav', wav.toBuffer());
}).catch(e => console.log(e))

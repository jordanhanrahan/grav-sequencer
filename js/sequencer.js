var sound_dir = '/nullseq/user/plugins/sequencer/sounds'
const BPM = 120;
const TICKS = 16;
const INTERVAL = 1 / (4 * BPM / (60 * 1000));
const MAX_BITS = 32;
const MAX_HEX = MAX_BITS / 4;

// sounds originated from http://808.html909.com
const sounds = [
  sound_dir + '/bass_drum.wav',
  sound_dir + '/snare_drum.wav',
  sound_dir + '/low_tom.wav',
  sound_dir + '/mid_tom.wav',

  // sound_dir + '/hi_tom.wav',
  // sound_dir + '/rim_shot.wav',
  // sound_dir + '/hand_clap.wav',
  // sound_dir + '/cowbell.wav',
  // sound_dir + '/cymbal.wav',
  // sound_dir + '/o_hi_hat.wav',
  // sound_dir + '/cl_hi_hat.wav',

  // sound_dir + '/low_conga.wav',
  // sound_dir + '/mid_conga.wav',
  // sound_dir + '/hi_conga.wav',
  // sound_dir + '/claves.wav',
  // sound_dir + '/maracas.wav',
];

const audioCtx = new(window.AudioContext || window.webkitAudioContext)();
const buffers = [];
const theGrid = document.getElementById('grid');
const sLen = sounds.length;

function binToHex(bin) {
  var hex = '';
  for (i = 0, len = bin.length; i < len; i += MAX_BITS) {
    var tmp = parseInt(bin.substr(i,MAX_BITS), 2).toString(16);
    while (tmp.length < MAX_HEX) {
      tmp = '0' + tmp;
    }
    hex += tmp;
  }
  return hex;
}

function hexToBin(hex) {
  var bin = '';
  for (i = 0, len = hex.length; i < len; i += MAX_HEX) {
    var tmp = parseInt(hex.substr(i,MAX_HEX), 16).toString(2);
    while (tmp.length < MAX_BITS) {
      tmp = '0' + tmp;
    }
    bin += tmp;
  }
  return bin;
}

// represent the hash as two 32-bit integers, in hex
function updateState() {
  var state = '';

  Array.from(beats).map(function(btn) {
    state += btn.classList.contains('on') ? '1' : '0';
  });

  // TODO: this causes an unnecessary restore state
  window.location.hash = binToHex(state);
}

function restoreState() {
  var hash = window.location.hash;
  hash = (hash === '') ? '0000000000000000' : hash.substr(1); // Remove the first char (#...)

  hexToBin(hash).split('').map(function(el, i) {
    if (parseInt(el) === 1) {
      beats[i].classList.add('on');
    } else {
      beats[i].classList.remove('on');
    }
  });
}

// needed for page history
window.addEventListener('hashchange', restoreState, false);

for (var soundIndex = 0; soundIndex < sLen; ++soundIndex) {
  (function (index) {
    // create buffer for sound
    const req = new XMLHttpRequest();
    req.open('GET', sounds[index], true);
    req.responseType = 'arraybuffer';
    req.onload = function () {
      audioCtx.decodeAudioData(
        req.response,
        function (buffer) {
          buffers.push(buffer);
        }
      );
    };
    req.send();
  })(soundIndex);

  // create row for sound
  const fragment = document.createDocumentFragment();

  for (var t = 0; t < TICKS; ++t) {
    const btn = document.createElement('button');
    btn.className = 'beat';
    btn.addEventListener('click', function () {
      this.classList.toggle('on');
      updateState();
    }, false);

    fragment.appendChild(btn);
  }

  theGrid.appendChild(fragment);
  theGrid.appendChild(document.createElement('p'));
}

const beats = document.getElementsByClassName('beat');

var lastTick = TICKS - 1;
var curTick = 0;

var lastTime = new Date().getTime();

function drumLoop() {
  const curTime = new Date().getTime();

  if (curTime - lastTime >= INTERVAL) {
    for (var i = 0; i < sLen; ++i) {
      const lastBeat = beats[i * TICKS + lastTick];
      const curBeat = beats[i * TICKS + curTick];

      lastBeat.classList.remove('ticked');
      curBeat.classList.add('ticked');

      if (curBeat.classList.contains('on')) {
        try {
          const source = audioCtx.createBufferSource();
          source.buffer = buffers[i];
          source.connect(audioCtx.destination);
          source.start();
        } catch (e) {
          console.error(e.message);

          // Fallback method
          new Audio(sounds[i]).play();
        }
      }
    }

    lastTick = curTick;
    curTick = (curTick + 1) % TICKS;
    lastTime = curTime;
  }
  requestAnimationFrame(drumLoop);
}
// Restore the state before we start the drum loop
restoreState();
requestAnimationFrame(drumLoop);

// adapted from https://paulbakaus.com/tutorials/html5/web-audio-on-ios/
function enableIOSAudio() {
  const buffer = audioCtx.createBuffer(1, 1, 22050);
  const source = audioCtx.createBufferSource();

  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.noteOn(0);

  window.removeEventListener('touchend', enableIOSAudio, false);
}
window.addEventListener('touchend', enableIOSAudio, false);
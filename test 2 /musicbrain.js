

let musicIsPlaying = false;




function preload() {
  if (typeof preloadBassInputs === "function") {
    preloadBassInputs();
  }

  if (typeof preloadDrumInputs === "function") {
    preloadDrumInputs();
  }

  if (typeof preloadGuitarInputs === "function") {
    preloadGuitarInputs();
  }

  if (typeof preloadStringsInputs === "function") {
    preloadStringsInputs();
  }

  if (typeof preloadSynthFFTInputs === "function") {
    preloadSynthFFTInputs();
  }

  if (typeof preloadVocalPitchInputs === "function") {
    preloadVocalPitchInputs();
  }
}




function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  colorMode(RGB);

  

  if (typeof setupBassInputs === "function") {
    setupBassInputs();
  }

  if (typeof setupDrumInputs === "function") {
    setupDrumInputs();
  }

  if (typeof setupGuitarInputs === "function") {
    setupGuitarInputs();
  }

  if (typeof setupStringsInputs === "function") {
    setupStringsInputs();
  }

  if (typeof setupSynthFFTInputs === "function") {
    setupSynthFFTInputs();
  }

  if (typeof setupVocalPitchInputs === "function") {
    setupVocalPitchInputs();
  }



  if (typeof setupWholeFFTInputs === "function") {
    setupWholeFFTInputs();
  } else {
    console.log("setupWholeFFTInputs() not found. Check wholeFFT.js is loaded before testvis.js.");
  }

  

  if (typeof setupSynth === "function") {
    setupSynth();
  } else {
    console.log("setupSynth() not found. Check synth.js is loaded before testvis.js.");
  }

  

  if (typeof mv_setup === "function") {
    mv_setup();
  } else {
    console.log("mv_setup() not found. Check teammateVisual.js is loaded before testvis.js.");
  }

  if (typeof mv_hookHits === "function") {
    mv_hookHits();
  }
}




function draw() {
  background(4, 6, 22);

  if (musicIsPlaying) {
    checkAllMusicHits();

    if (typeof updateSynthFFTOutputs === "function") {
      updateSynthFFTOutputs();
    }

    if (typeof updateWholeFFTOutputs === "function") {
      updateWholeFFTOutputs();
    }
  } else {
    if (typeof resetWholeFFTOutputs === "function") {
      resetWholeFFTOutputs();
    }
  }

  // Draw teammate final visual
  if (typeof mv_draw === "function") {
    if (
      typeof mv_ready !== "undefined" &&
      !mv_ready &&
      typeof mv_setup === "function"
    ) {
      mv_setup();
    }

    mv_draw();
  } else {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("mv_draw not found", width / 2, height / 2);
  }

  drawMusicStatus();
}


function checkAllMusicHits() {
  if (typeof getActiveBassHits === "function") {
    let bassHits = getActiveBassHits();

    for (let note of bassHits) {
      if (typeof createBassVisual === "function") {
        createBassVisual(note);
      }
    }
  }

  if (typeof getActiveDrumHits === "function") {
    let drumHits = getActiveDrumHits();

    for (let note of drumHits) {
      if (typeof createDrumVisual === "function") {
        createDrumVisual(note);
      }
    }
  }

  if (typeof getGuitarHits === "function") {
    let guitarHits = getGuitarHits();

    for (let note of guitarHits) {
      if (typeof createGuitarVisual === "function") {
        createGuitarVisual(note);
      }
    }
  }

  if (typeof getActiveStringsHits === "function") {
    let stringsHits = getActiveStringsHits();

    for (let note of stringsHits) {
      if (typeof createStringsVisual === "function") {
        createStringsVisual(note);
      }
    }
  }
}



function createBassVisual(note) {
  // intentionally empty
}

function createDrumVisual(note) {
  // intentionally empty
}

function createGuitarVisual(note) {
  // intentionally empty
}

function createStringsVisual(note) {
  // intentionally empty
}



function mousePressed() {
  userStartAudio();

  if (musicIsPlaying) {
    pauseAllMusic();
  } else {
    playAllMusic();
  }
}


function playAllMusic() {
  if (typeof playBass === "function") {
    playBass();
  }

  if (typeof playDrum === "function") {
    playDrum();
  }

  if (typeof playGuitar === "function") {
    playGuitar();
  }

  if (typeof playStrings === "function") {
    playStrings();
  }

  if (typeof playSynthFFT === "function") {
    playSynthFFT();
  }

  if (typeof playVocals === "function") {
    playVocals();
  }

  musicIsPlaying = true;
}


function pauseAllMusic() {
  if (typeof pauseBass === "function") {
    pauseBass();
  }

  if (typeof pauseDrum === "function") {
    pauseDrum();
  }

  if (typeof pauseGuitar === "function") {
    pauseGuitar();
  }

  if (typeof pauseStrings === "function") {
    pauseStrings();
  }

  if (typeof pauseSynthFFT === "function") {
    pauseSynthFFT();
  }

  if (typeof pauseVocals === "function") {
    pauseVocals();
  }

  musicIsPlaying = false;
}



function keyPressed() {
  

  if (key === "1" && typeof switchBassTrack === "function") {
    switchBassTrack(0);
  }

  if (key === "2" && typeof switchBassTrack === "function") {
    switchBassTrack(1);
  }

  if (key === "3" && typeof switchBassTrack === "function") {
    switchBassTrack(2);
  }

  if (key === "4" && typeof switchBassTrack === "function") {
    switchBassTrack(3);
  }

  if (key === "5" && typeof muteBass === "function") {
    muteBass();
  }


  

  if ((key === "q" || key === "Q") && typeof switchDrumTrack === "function") {
    switchDrumTrack(0);
  }

  if ((key === "w" || key === "W") && typeof switchDrumTrack === "function") {
    switchDrumTrack(1);
  }

  if ((key === "e" || key === "E") && typeof switchDrumTrack === "function") {
    switchDrumTrack(2);
  }

  if ((key === "r" || key === "R") && typeof switchDrumTrack === "function") {
    switchDrumTrack(3);
  }

  if ((key === "t" || key === "T") && typeof muteDrum === "function") {
    muteDrum();
  }



  if ((key === "a" || key === "A") && typeof unmuteGuitar === "function") {
    unmuteGuitar();
  }

  if ((key === "s" || key === "S") && typeof muteGuitar === "function") {
    muteGuitar();
  }




  if ((key === "z" || key === "Z") && typeof switchStringsTrack === "function") {
    switchStringsTrack(0);
  }

  if ((key === "x" || key === "X") && typeof switchStringsTrack === "function") {
    switchStringsTrack(1);
  }

  if ((key === "c" || key === "C") && typeof switchStringsTrack === "function") {
    switchStringsTrack(2);
  }

  if ((key === "v" || key === "V") && typeof switchStringsTrack === "function") {
    switchStringsTrack(3);
  }

  if ((key === "b" || key === "B") && typeof muteStrings === "function") {
    muteStrings();
  }


  

  if ((key === "u" || key === "U") && typeof unmuteVocal === "function") {
    userStartAudio();
    unmuteVocal(0);
  }

  if ((key === "i" || key === "I") && typeof unmuteVocal === "function") {
    userStartAudio();
    unmuteVocal(1);
  }

  if ((key === "o" || key === "O") && typeof unmuteVocal === "function") {
    userStartAudio();
    unmuteVocal(2);
  }

  if ((key === "j" || key === "J") && typeof muteVocal === "function") {
    muteVocal(0);
  }

  if ((key === "k" || key === "K") && typeof muteVocal === "function") {
    muteVocal(1);
  }

  if ((key === "l" || key === "L") && typeof muteVocal === "function") {
    muteVocal(2);
  }

  if ((key === "p" || key === "P") && typeof toggleAllVocals === "function") {
    userStartAudio();
    toggleAllVocals();
  }




  if (key === "m" || key === "M") {
    if (typeof playSynthNote === "function") {
      playSynthNote();
    }
  }
}

function drawMusicStatus() {
  push();

  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);

  if (musicIsPlaying) {
    text("PLAYING", width / 2, 32);
  } else {
    text("CLICK TO PLAY", width / 2, 32);
  }

  pop();
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  if (typeof mv_setup === "function") {
    mv_setup();
  }
}

let players = [];
let activeIndex = null;
let dragStarted = false;
let pressPoint = { x: 0, y: 0 };
let maxDistance;
let audioStarted = false;

function preload() {
  soundFormats('wav');

  players = [
    {
      label: 'Drum',
      folder: '../assessment code/assets/DrumWav',
      prefix: 'Drum',
      color: [80, 180, 230],
      darkColor: [40, 90, 115],
      x: 120,
      y: 200,
      tracks: [],
      isLoaded: false,
      loadedCount: 0,
      selectedTrack: 0,
      muted: false,
      radius: 80,
      minRadius: 30,
      maxRadius: 120,
      wet: 0,
      pan: 0,
    },
    {
      label: 'Bass',
      folder: '../assessment code/assets/BassWav',
      prefix: 'Bass',
      color: [255, 150, 150],
      darkColor: [180, 80, 80],
      x: 280,
      y: 200,
      tracks: [],
      isLoaded: false,
      loadedCount: 0,
      selectedTrack: 0,
      muted: false,
      radius: 80,
      minRadius: 30,
      maxRadius: 120,
      wet: 0,
      pan: 0,
    },
  ];

  players.forEach((player) => {
    for (let i = 0; i < 4; i++) {
      const trackNumber = i + 1;
      const path = `${player.folder}/${player.prefix} ${trackNumber}.wav`;
      const soundFile = loadSound(
        path,
        () => {
          player.loadedCount += 1;
          if (player.loadedCount === 4) {
            player.isLoaded = true;
          }
        },
        () => {
          console.error('Failed to load', path);
        }
      );

      player.tracks.push({
        sound: soundFile,
        reverb: null,
      });
    }
  });
}

function setup() {
  createCanvas(400, 400);
  textAlign(CENTER, CENTER);
  textSize(16);
  maxDistance = dist(0, 0, width / 2, height / 2);

  players.forEach((player) => {
    player.tracks.forEach((track) => {
      track.reverb = new p5.Reverb();
      track.reverb.process(track.sound, 3, 2);
      track.reverb.drywet(0);
      track.sound.setVolume(0);
    });
  });
}

function draw() {
  background(25);

  players.forEach((player) => {
    const distanceFromCenter = dist(player.x, player.y, width / 2, height / 2);
    const normalizedDistance = constrain(distanceFromCenter / maxDistance, 0, 1);
    player.radius = lerp(player.maxRadius, player.minRadius, normalizedDistance);
    player.wet = normalizedDistance;
    player.pan = constrain(map(player.x, player.radius, width - player.radius, -1, 1), -1, 1);

    updateTrackForEdge(player);

    player.tracks.forEach((track, index) => {
      if (track.reverb) {
        track.reverb.drywet(player.wet);
      }
      if (track.sound) {
        track.sound.pan(player.pan);
        const volume = player.muted ? 0 : index === player.selectedTrack ? 1 : 0;
        track.sound.setVolume(volume);
      }
    });

    const fillColor = player.muted ? player.darkColor : player.color;
    push();
    noStroke();
    fill(fillColor[0], fillColor[1], fillColor[2], 220);
    ellipse(player.x, player.y, player.radius * 2);
    pop();

    fill(255);
    noStroke();
    text(`${player.label} ${player.selectedTrack + 1}`, player.x, player.y - player.radius - 18);
  });

  fill(255);
  noStroke();
  text('Tap circle to mute/unmute', width / 2, 24);
  text('Drag circle to change pan & reverb', width / 2, 48);
  text('Right = track 1, top = track 2, left = track 3, bottom = track 4', width / 2, 72);

  if (!players.every((player) => player.isLoaded)) {
    fill(255, 200, 0);
    text('Loading audio files...', width / 2, height - 30);
  }
}

function updateTrackForEdge(player) {
  let newIndex = null;

  if (player.x + player.radius >= width) {
    newIndex = 0;
  } else if (player.y - player.radius <= 0) {
    newIndex = 1;
  } else if (player.x - player.radius <= 0) {
    newIndex = 2;
  } else if (player.y + player.radius >= height) {
    newIndex = 3;
  }

  if (newIndex !== null && newIndex !== player.selectedTrack) {
    player.selectedTrack = newIndex;
  }
}

function mousePressed() {
  userStartAudio();
  if (!audioStarted && players.every((player) => player.isLoaded)) {
    startAllAudio();
  }

  activeIndex = getCircleUnderMouse();
  dragStarted = false;
  pressPoint = { x: mouseX, y: mouseY };
}

function mouseDragged() {
  if (activeIndex === null) {
    return;
  }

  if (!dragStarted && dist(mouseX, mouseY, pressPoint.x, pressPoint.y) > 5) {
    dragStarted = true;
  }

  if (dragStarted) {
    const player = players[activeIndex];
    player.x = constrain(mouseX, player.radius, width - player.radius);
    player.y = constrain(mouseY, player.radius, height - player.radius);
  }
}

function mouseReleased() {
  if (activeIndex === null) {
    return;
  }

  if (!dragStarted && audioStarted) {
    const player = players[activeIndex];
    player.muted = !player.muted;
  }

  activeIndex = null;
}

function startAllAudio() {
  players.forEach((player) => {
    player.tracks.forEach((track, index) => {
      if (track.sound) {
        track.sound.loop();
        track.sound.pan(player.pan);
        const volume = player.muted ? 0 : index === player.selectedTrack ? 1 : 0;
        track.sound.setVolume(volume);
      }
    });
  });
  audioStarted = true;
}

function getCircleUnderMouse() {
  for (let i = players.length - 1; i >= 0; i--) {
    const player = players[i];
    if (dist(mouseX, mouseY, player.x, player.y) <= player.radius) {
      return i;
    }
  }
  return null;
}

Final Assessment Project Pitch

Working Title: Living Score

Our team has chosen to create an original interactive audiovisual piece.

Team Vision
Living Score is an interactive artwork where sound and visuals constantly influence each other. Instead of a normal music visualiser where shapes only react to audio, we want the visuals to also affect the music. We’re using a WAV track together with MIDI files so we can detect specific musical events like drum hits, piano notes, guitar notes, and bass notes. These events will trigger visual changes, and certain visual elements will also be able to mute, switch, or adjust different musical layers.

Our inspiration comes from Patt Vira’s generative projects like Rainbow Pendulum Waves and Musical Onion, where rhythm, colour, and movement are tightly connected. We’re also inspired by abstract audio visualisers that use circles, waves, pulses, and particles to express musical energy. Our goal is to build a system where music, visuals, timing, randomness, and user interaction all feel connected and alive.

Inspiration Sources
Inspiration 1: Patt Vira — Rainbow Pendulum Waves
This inspired our use of repeated shapes, rhythmic timing, and connecting musical notes to visual movement.

<img width="1807" height="787" alt="image" src="https://github.com/user-attachments/assets/73ab1d63-7921-4c61-8e76-77aecbec2e90" />


Inspiration 2: Patt Vira — Musical Onion
This influenced our idea of giving visual objects their own musical meaning, making the artwork feel structured but playful.

<img width="1877" height="745" alt="image" src="https://github.com/user-attachments/assets/bd6c5f69-c574-4dab-85a2-3456583c2d84" />

Inspiration 3: Abstract Audio Visualisers
These inspired our use of circles, waves, pulses, and colour changes to represent musical energy.

<img width="1236" height="741" alt="image" src="https://github.com/user-attachments/assets/61cd0639-f566-4246-88b3-9aa512bab3db" />



Part 2: Mechanics
Team Members and Mechanics
| Team Member | Mechanic |
|------------|----------|
| Jake | Audio / music output system |
| Team Member 2 | Random animation |
| Merna | Background visual |
| Team Member 4 | Visual control of audio effects |


Mechanic 1: Audio / Music Output System
Owner: Jake

The audio system uses one WAV file and multiple MIDI files to generate musical events the rest of the project can respond to. The WAV file is the main audio the audience hears, while the MIDI files give us accurate information about when specific sounds happen like kicks, snares, hi‑hats, piano notes, guitar notes, and bass notes. This avoids relying only on FFT guessing. MIDI also lets us detect both single hits and multiple notes at once.

This mechanic also supports the idea that visuals can shape the music. Certain visual elements will be able to mute, unmute, switch, or adjust the volume of different musical layers. FFT analysis of the final audio output will also influence colour, movement, and atmosphere. This system acts as the “music brain” of the project, giving the other mechanics clear musical triggers to work with.

Mechanic 2: Random Animation
Owner: Team Member 2

This mechanic creates small visual elements that move in unpredictable ways. Random values will control things like position, size, colour, speed, and direction. These shapes such as particles, circles, or lines will appear in different places and behave differently each time. Some of them will also react to musical events, like growing when the kick hits or changing direction on a snare.

This supports our vision by making the artwork feel alive instead of static. Even though the movement is random, it still connects to the audio system so it doesn’t feel disconnected. The user might not control these elements directly, but they’ll see constant motion and variation across the canvas.

Mechanic 3: Background Visual
Owner: Merna

The background visual mechanic sets the overall mood of Living Score. Instead of a flat colour, the background will be made of moving gradients, waves, particles, and Perlin noise based textures. Low frequency energy from the FFT can make the background pulse slowly, while higher frequencies can create sharper flickers or bright accents. The background can also shift depending on which musical layer is active—drums, bass, piano, or guitar so the atmosphere changes with the music.

This mechanic ties the whole piece together visually. While the audio system provides musical structure and the random animation adds movement, the background creates the emotional tone. Perlin noise helps everything feel smooth and natural instead of chaotic. Using noise based clouds, pulsing gradients, wave like motion, and colour changes, the background becomes a living canvas that connects all the mechanics into one coherent world.

Mechanic 4: Visual Control of Audio Effects
Owner: Team Member 4

This mechanic lets visuals influence the music. Certain shapes or objects on the canvas will be able to control audio behaviours like volume, muting, switching layers, or triggering simple effects. For example, a shape moving across the screen might slowly increase the bass volume, or entering a specific zone might mute the drums. User input like mouse or keyboard may also move or interact with these visual controllers.

This supports our vision by creating a two way relationship between sound and visuals. Instead of visuals only reacting to music, the artwork can also change how the music is heard. This makes the piece more interactive and performative.

Part 3: Putting It Together
The final piece works as a connected audiovisual system. The WAV file provides the main sound, and the MIDI data gives accurate musical triggers. The random animation and background visuals respond to these triggers, while some visual elements also control the audio by muting, switching, or adjusting layers. FFT analysis adds another layer of responsiveness, letting the visuals react to the final sound output. Together, everything forms one coherent system where music and visuals continuously influence each other.

// Radiohead-inspired Atmospheric Song using Tone.js
// Make sure to include Tone.js in your HTML: <script src="https://cdn.jsdelivr.net/npm/tone"></script>

// Initialize audio context on user interaction
let started = false;

async function startSong() {
    if (started) return;
    started = true;
    
    try {
        await Tone.start();
        console.log("Audio context started");
        
        // Create reverb for ambient space
        const reverb = new Tone.Reverb({
            decay: 8,
            wet: 0.5
        }).toDestination();
        
        // Wait for reverb to generate
        await reverb.generate();
        console.log("Reverb ready");
        
        // Create delay for atmosphere
        const delay = new Tone.FeedbackDelay({
            delayTime: "8n",
            feedback: 0.4,
            wet: 0.3
        }).connect(reverb);
        
        // Create chorus for warmth
        const chorus = new Tone.Chorus({
            frequency: 1.5,
            delayTime: 3.5,
            depth: 0.7,
            wet: 0.3
        }).connect(delay);
        
        // Ambient pad synth (like Radiohead's atmospheric layers)
        const pad = new Tone.PolySynth(Tone.Synth, {
            oscillator: {
                type: "sine"
            },
            envelope: {
                attack: 2,
                decay: 0.5,
                sustain: 0.8,
                release: 4
            }
        }).connect(chorus);
        
        // Lead synth (more present, like Thom Yorke's melodies)
        const lead = new Tone.MonoSynth({
            oscillator: {
                type: "sawtooth"
            },
            filter: {
                Q: 2,
                type: "lowpass",
                rolloff: -12
            },
            envelope: {
                attack: 0.1,
                decay: 0.3,
                sustain: 0.5,
                release: 2
            },
            filterEnvelope: {
                attack: 0.1,
                decay: 0.2,
                sustain: 0.5,
                release: 1.5,
                baseFrequency: 200,
                octaves: 3
            }
        }).connect(reverb);
        
        // Bass synth
        const bass = new Tone.MonoSynth({
            oscillator: {
                type: "square"
            },
            envelope: {
                attack: 0.1,
                decay: 0.3,
                sustain: 0.4,
                release: 1.2
            }
        }).connect(reverb);
        
        // Atmospheric noise (like Kid A textures)
        const noise = new Tone.Noise("pink").start();
        const noiseFilter = new Tone.Filter({
            frequency: 1000,
            type: "lowpass"
        }).connect(reverb);
        const noiseEnv = new Tone.AmplitudeEnvelope({
            attack: 4,
            decay: 2,
            sustain: 0.1,
            release: 8
        }).connect(noiseFilter);
        noise.connect(noiseEnv);
        
        // Chord progression (moody, minor key - inspired by "Everything In Its Right Place")
        const chordProgression = [
            ["C3", "Eb3", "G3", "Bb3"],  // Cm7
            ["Ab2", "C3", "Eb3", "G3"],  // Ab maj7
            ["F3", "Ab3", "C4", "Eb4"],  // Fm7
            ["G3", "Bb3", "D4", "F4"]    // Gm7
        ];
        
        // Melodic sequence (haunting, like Radiohead melodies)
        const melody = [
            { note: "C5", duration: "2n", time: "0:0" },
            { note: "Eb5", duration: "4n", time: "0:2" },
            { note: "G5", duration: "4n", time: "0:3" },
            { note: "F5", duration: "2n", time: "1:0" },
            { note: "Eb5", duration: "4n", time: "1:2" },
            { note: "D5", duration: "4n", time: "1:3" },
            { note: "C5", duration: "2n", time: "2:0" },
            { note: "Bb4", duration: "4n", time: "2:2" },
            { note: "Ab4", duration: "4n", time: "2:3" },
            { note: "G4", duration: "1n", time: "3:0" }
        ];
        
        // Bass line
        const bassLine = [
            { note: "C2", duration: "2n", time: "0:0" },
            { note: "Ab1", duration: "2n", time: "1:0" },
            { note: "F2", duration: "2n", time: "2:0" },
            { note: "G2", duration: "2n", time: "3:0" }
        ];
        
        // Sequence the song
        const part = new Tone.Part((time, value) => {
            pad.triggerAttackRelease(value.chord, value.duration, time);
        }, [
            { time: "0:0", chord: chordProgression[0], duration: "1m" },
            { time: "4:0", chord: chordProgression[1], duration: "1m" },
            { time: "8:0", chord: chordProgression[2], duration: "1m" },
            { time: "12:0", chord: chordProgression[3], duration: "1m" }
        ]);
        part.loop = true;
        part.loopEnd = "16m";
        
        // Melody part
        const melodyPart = new Tone.Part((time, note) => {
            lead.triggerAttackRelease(note.note, note.duration, time);
        }, melody.map(m => ({ time: m.time, note: m })));
        melodyPart.loop = true;
        melodyPart.loopEnd = "4m";
        
        // Bass part
        const bassPart = new Tone.Part((time, note) => {
            bass.triggerAttackRelease(note.note, note.duration, time);
        }, bassLine.map(b => ({ time: b.time, note: b })));
        bassPart.loop = true;
        bassPart.loopEnd = "4m";
        
        // Trigger atmospheric noise occasionally
        const noisePart = new Tone.Loop((time) => {
            noiseEnv.triggerAttackRelease("8m", time);
        }, "8m");
        
        // Start everything
        Tone.Transport.bpm.value = 72; // Slow, moody tempo
        
        part.start(0);
        melodyPart.start("4m"); // Melody comes in after intro
        bassPart.start("2m");   // Bass comes in early
        noisePart.start(0);
        
        Tone.Transport.start();
        
        console.log("Song started - Radiohead-inspired ambient track");
    
    } catch (error) {
        console.error("Error starting song:", error);
        started = false;
    }
}

// Stop function
function stopSong() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    console.log("Song stopped");
}

// Add button to start (required for browser autoplay policies)
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.createElement('button');
    startBtn.textContent = 'Start Radiohead-style Song';
    startBtn.style.cssText = 'position: fixed; top: 20px; left: 20px; z-index: 1000; padding: 15px 30px; font-size: 16px; background: #000; color: #fff; border: 2px solid #fff; cursor: pointer;';
    startBtn.onclick = startSong;
    document.body.appendChild(startBtn);
    
    const stopBtn = document.createElement('button');
    stopBtn.textContent = 'Stop Song';
    stopBtn.style.cssText = 'position: fixed; top: 70px; left: 20px; z-index: 1000; padding: 15px 30px; font-size: 16px; background: #333; color: #fff; border: 2px solid #fff; cursor: pointer;';
    stopBtn.onclick = stopSong;
    document.body.appendChild(stopBtn);
});

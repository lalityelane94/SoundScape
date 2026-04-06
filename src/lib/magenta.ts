"use client";

const SCALES: Record<string, number[]> = {
  minor: [0, 2, 3, 5, 7, 8, 10],
  major: [0, 2, 4, 5, 7, 9, 11],
  pentatonic: [0, 2, 4, 7, 9],
  blues: [0, 3, 5, 6, 7, 10],
};

export async function generateMelody(bpm: number) {
  await new Promise((r) => setTimeout(r, 800));

  const scaleNames = Object.keys(SCALES);
  const scaleName = scaleNames[Math.floor(Math.random() * scaleNames.length)];
  const scale = SCALES[scaleName];
  const rootNote = 48 + Math.floor(Math.random() * 12);

  const stepsArray = new Array(16).fill(false);
  const notesArray: number[] = new Array(16).fill(0);

  const density = 0.4 + Math.random() * 0.3;
  const pattern = bpm > 120
    ? [0, 2, 3, 5, 6, 8, 10, 12]
    : [0, 1, 3, 4, 6, 8, 10, 12, 14];

  for (let i = 0; i < 16; i++) {
    if (pattern.includes(i) && Math.random() < density) {
      stepsArray[i] = true;
      const scaleNote = scale[Math.floor(Math.random() * scale.length)];
      const octaveShift = Math.random() > 0.7 ? 12 : 0;
      notesArray[i] = rootNote + scaleNote + octaveShift;
    }
  }

  stepsArray[0] = true;
  notesArray[0] = rootNote;

  return { stepsArray, notesArray };
}

export async function loadMagenta() {
  return true;
}

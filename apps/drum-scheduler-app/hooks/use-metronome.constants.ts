export type MetronomeOptions = {
  bpm: number;
  clickAssetPath: string;
  lookaheadMs: number;
  scheduleAheadSec: number;
};

export const metronomeOptions: MetronomeOptions = {
  bpm: 170,
  clickAssetPath: 'click_sound_1.mp3',
  lookaheadMs: 10,
  scheduleAheadSec: 0.6,
};

import { useEffect, useRef } from 'react';
import { AudioBuffer, AudioContext } from 'react-native-audio-api';
import RNFS from 'react-native-fs';
import { MetronomeOptions } from './use-metronome.constants';

declare const atob: (input: string) => string;

type SchedulerConfig = {
  intervalSec: number;
  lookaheadMs: number;
  scheduleAheadSec: number;
};

export const useMetronome = (options: MetronomeOptions) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const clickBufferRef = useRef<AudioBuffer | null>(null);
  const runningRef = useRef<boolean>(false);
  const nextTimeRef = useRef<number>(0);
  const schedulerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const stop = () => {
    runningRef.current = false;
    if (schedulerTimeoutRef.current) {
      clearTimeout(schedulerTimeoutRef.current);
      schedulerTimeoutRef.current = null;
    }
  };

  const readClickTrackAsset = async (assetPath: string) => {
    const base64 = await RNFS.readFileAssets(assetPath, 'base64');
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const tick = (time: number) => {
    const audioContext = audioContextRef.current;
    if (!audioContext || !clickBufferRef.current) return;

    const src = audioContext.createBufferSource();
    src.buffer = clickBufferRef.current;
    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    src.connect(gain);
    gain.connect(audioContext.destination);

    src.start(time);
    src.stop(time + 0.055);
  };

  const scheduler = (config: SchedulerConfig) => {
    const audioContext = audioContextRef.current;
    const isRunning = runningRef.current;
    if (!isRunning || !audioContext) return;

    const { intervalSec, lookaheadMs, scheduleAheadSec } = config;

    const now = audioContext.currentTime;
    let nextTime = nextTimeRef.current;
    while (nextTime < now + scheduleAheadSec) {
      tick(nextTime);
      nextTime += intervalSec;
    }

    nextTimeRef.current = nextTime;
    schedulerTimeoutRef.current = setTimeout(
      () => scheduler(config),
      lookaheadMs,
    );
  };

  const play = async (beatsPerMinute?: number) => {
    stop();
    let { bpm, clickAssetPath, lookaheadMs, scheduleAheadSec } = options;
    bpm = beatsPerMinute ?? bpm;
    const intervalSec = 60 / bpm;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    const audioContext = audioContextRef.current;

    if (!clickBufferRef.current) {
      const arrayBuffer = await readClickTrackAsset(clickAssetPath);
      clickBufferRef.current = await audioContext.decodeAudioData(arrayBuffer);
    }

    nextTimeRef.current = audioContext.currentTime + 0.05;
    runningRef.current = true;

    scheduler({
      intervalSec,
      lookaheadMs,
      scheduleAheadSec,
    });
  };

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return { play, stop };
};

import React from 'react';
import { Audio, Sequence, interpolate, staticFile } from 'remotion';
import {
  PROD_INT, PRE_FILLED, SMALL_ROWS, SMALL_COLS, LARGE_COLS, ORIGIN_COL,
  SCENE1_END, SCENE4_START,
  RIPPLE,
} from '../constants';
import { STICKER_FRAMES } from './TextOverlay';

const TICK    = staticFile('sfx/kamranbashirb-car-door-shut-297266.mp3');
const ALERT   = staticFile('sfx/u_ayf470ljcu-incorrect-buzzer-sound-147336.mp3');
const TENSION = staticFile('sfx/lesiakower-error-mistake-sound-effect-incorrect-answer-437420.mp3');
const SWEEP   = staticFile('sfx/stereogenicstudio-swish-swoosh-woosh-sfx-53-357158.mp3');
const RESOLVE = staticFile('sfx/universfield-new-notification-07-210334.mp3');
const STAMP      = staticFile('sfx/freesound_community-stamp-102627.mp3');
const AMBIANCE1  = staticFile('sfx/freesound_community-industrial-ambience-67112.mp3');
const AMBIANCE2  = staticFile('sfx/alex_jauk-industrial-ambience-223058.mp3');




const noop = () => undefined;

export const SoundEffects: React.FC = () => (
  <>
    {/* Industrial ambiance throughout — fades out before final text at frame 668 */}
    <Audio src={AMBIANCE1} loop loopVolumeCurveBehavior="extend" volume={(f) => interpolate(f, [0, 15, 690, 750], [0, 0.5, 0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} onError={noop} />
    <Audio src={AMBIANCE2} loop loopVolumeCurveBehavior="extend" volume={(f) => interpolate(f, [0, 15, 690, 750], [0, 0.5, 0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} onError={noop} />
    {/* Cell scan ticks — production zone (36) + extended fill row (6), up to frame 615 */}
    {Array.from({ length: SMALL_ROWS * SMALL_COLS + (LARGE_COLS - ORIGIN_COL - SMALL_COLS) }, (_, idx) => {
      if (idx < PRE_FILLED) return null;
      const frame = (idx - PRE_FILLED) * PROD_INT;
      return (
        <Sequence key={`tick-${idx}`} from={frame} durationInFrames={30}>
          <Audio src={TICK} volume={0.18} onError={noop} />
        </Sequence>
      );
    })}

    {/* Defect alert */}
    <Sequence from={258} durationInFrames={60}>
      <Audio src={ALERT} volume={0.65} trimBefore={30} onError={noop} />
    </Sequence>

    {/* Ripple tension hits — one per ripple cell turning red */}
    {RIPPLE.map(([, , delay], idx) => (
      <Sequence key={`tension-${idx}`} from={SCENE1_END + delay} durationInFrames={45}>
        <Audio src={TENSION} volume={0.35} onError={noop} />
      </Sequence>
    ))}

    {/* Random whips during zoom-out (SCENE3_START–SCENE3_END) */}
    {Array.from({ length: 16 }, (_, i) => Math.round(448 + i * (53 / 15))).map((f) => (
      <Sequence key={`zoom-whip-${f}`} from={f} durationInFrames={20}>
        <Audio src={TENSION} volume={0.32} onError={noop} />
      </Sequence>
    ))}

    {/* AI sweep whoosh — slowed to 0.5x to stretch across the full sweep */}
    <Sequence from={SCENE4_START} durationInFrames={180}>
      <Audio src={SWEEP} volume={0.75} onError={noop} />
    </Sequence>

    {/* Stamp on each sticker text appearance (except the final professional text) */}
    {STICKER_FRAMES.map((frame) => (
      <Sequence key={`stamp-${frame}`} from={frame} durationInFrames={30}>
        <Audio src={STAMP} volume={0.6} playbackRate={2} onError={noop} />
      </Sequence>
    ))}

    {/* Resolution dings — staggered from frame 592, with 3 extra tail dings */}
    {Array.from({ length: RIPPLE.length + 3 }, (_, idx) => (
      <Sequence key={`resolve-${idx}`} from={592 + idx * 8} durationInFrames={60}>
        <Audio src={RESOLVE} volume={0.28} onError={noop} />
      </Sequence>
    ))}
  </>
);

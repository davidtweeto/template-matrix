import {
  LARGE_ROWS, LARGE_COLS, SMALL_ROWS, SMALL_COLS,
  ORIGIN_ROW, ORIGIN_COL, PRE_FILLED, PROD_INT, SCAN_LAG,
  SWEEP_FRAMES, FLIP_FRAMES,
  DEFECT_R, DEFECT_C, RIPPLE, Q_MARKS,
  SCENE1_END, SCENE3_START, SCENE4_START, SCENE4_END,
  END_GREEN_FADE_START, END_GREEN_FADE_END,
  END_PERSIST_FADE_START, END_PERSIST_FADE_END,
} from '../constants';

function lerp(frame: number, f0: number, f1: number, v0: number, v1: number): number {
  if (frame <= f0) return v0;
  if (frame >= f1) return v1;
  return v0 + (v1 - v0) * (frame - f0) / (f1 - f0);
}
import type { CellData } from '../types';

function inSmall(r: number, c: number): boolean {
  return (
    r >= ORIGIN_ROW && r < ORIGIN_ROW + SMALL_ROWS &&
    c >= ORIGIN_COL && c < ORIGIN_COL + SMALL_COLS
  );
}

function smallIdx(r: number, c: number): number {
  return (r - ORIGIN_ROW) * SMALL_COLS + (c - ORIGIN_COL);
}

function aiSweepX(frame: number): number {
  if (frame < SCENE4_START) return -1;
  if (frame >= SCENE4_END) return LARGE_COLS + 1;
  return ((frame - SCENE4_START) / (SCENE4_END - SCENE4_START)) * LARGE_COLS;
}

export function getCellData(r: number, c: number, frame: number): CellData {
  const swept = aiSweepX(frame) > c;

  let base: CellData['base'];
  let appearAge = -1;
  let pulseAge = -1;
  let sweepProgress = -1;
  let flipAge = -1;
  let colorFlipAge = -1;
  let isQuestion = false;
  let endFadeOpacity = 1;

  if (inSmall(r, c)) {
    const idx = smallIdx(r, c);
    const preF = idx < PRE_FILLED;
    const appearF = preF ? 0 : (idx - PRE_FILLED) * PROD_INT;
    const scanF = preF ? 0 : appearF + SCAN_LAG * PROD_INT;

    if (frame < appearF) {
      base = 'empty';
    } else {
      appearAge = frame - appearF;

      if (frame < scanF) {
        base = 'gray';
        if (!preF) {
          const sweepStart = scanF - SWEEP_FRAMES;
          if (frame >= sweepStart) sweepProgress = (frame - sweepStart) / SWEEP_FRAMES;
        }
      } else {
        if (r === DEFECT_R && c === DEFECT_C) {
          base = 'red';
          const flipEndF = preF ? 0 : scanF + FLIP_FRAMES;
          if (!swept && frame >= flipEndF) pulseAge = frame - flipEndF;
        } else {
          const rippleEntry = RIPPLE.find(([rr, rc]) => rr === r && rc === c);
          if (rippleEntry) {
            const [, , delay, confirmed, rippleColor] = rippleEntry;
            const redFrame = SCENE1_END + delay;
            const finalBase: CellData['base'] = confirmed ? (rippleColor ?? 'red') : 'green';
            if (frame < redFrame) {
              base = 'green';
            } else if (swept) {
              // AI rescan: gray + scan bar → flip gray → final color
              const sweepHitF = SCENE4_START + c * (SCENE4_END - SCENE4_START) / LARGE_COLS;
              const rescanAge = frame - sweepHitF;
              if (rescanAge < SWEEP_FRAMES) {
                base = 'gray';
                sweepProgress = rescanAge / SWEEP_FRAMES;
              } else if (rescanAge < SWEEP_FRAMES + FLIP_FRAMES) {
                base = finalBase;
                flipAge = rescanAge - SWEEP_FRAMES;
              } else {
                base = finalBase;
              }
            } else {
              base = 'red';
              if (frame < redFrame + FLIP_FRAMES) {
                colorFlipAge = frame - redFrame; // green → red flip
              } else {
                pulseAge = frame - (redFrame + FLIP_FRAMES);
              }
            }
          } else {
            base = 'green';
          }
        }

        if (!preF && frame < scanF + FLIP_FRAMES) {
          flipAge = frame - scanF;
        }
      }
    }
  } else {
    // Last visible row (row 11) extends the fill animation beyond the production zone
    const isExtendedFill =
      r === ORIGIN_ROW + SMALL_ROWS - 1 && c >= ORIGIN_COL + SMALL_COLS;
    if (isExtendedFill) {
      const extIdx    = c - (ORIGIN_COL + SMALL_COLS);
      const extAppearF = (SMALL_ROWS * SMALL_COLS + extIdx) * PROD_INT;
      const extScanF   = extAppearF + SCAN_LAG * PROD_INT;
      if (frame < extAppearF) {
        base = 'empty';
      } else {
        appearAge = frame - extAppearF;
        if (frame < extScanF) {
          base = 'gray';
          const sweepStart = extScanF - SWEEP_FRAMES;
          if (frame >= sweepStart) sweepProgress = (frame - sweepStart) / SWEEP_FRAMES;
        } else {
          base = 'green';
          if (frame < extScanF + FLIP_FRAMES) {
            flipAge = frame - extScanF;
          }
        }
      }
    } else {
      base = 'green';
      appearAge = 999;
    }
  }

  // Orange question-mark boxes: appear in Scene 3, clustered around defect
  if (base === 'green') {
    const qIdx = Q_MARKS.findIndex(([qr, qc]) => qr === r && qc === c);
    if (qIdx >= 0) {
      const dist = Math.sqrt((r - DEFECT_R) ** 2 + (c - DEFECT_C) ** 2);
      const qAppearF = Q_MARKS[qIdx][2] ?? (SCENE3_START + 10 + Math.round(dist * 4) + qIdx * 2);
      if (frame >= qAppearF) {
        if (!swept) {
          base = 'orange';
          isQuestion = true;
          if (frame < qAppearF + FLIP_FRAMES) {
            colorFlipAge = frame - qAppearF; // green → orange flip
          } else {
            pulseAge = frame - (qAppearF + FLIP_FRAMES);
          }
        } else {
          // AI rescan: gray + scan bar → flip gray → green
          const sweepHitF = SCENE4_START + c * (SCENE4_END - SCENE4_START) / LARGE_COLS;
          const rescanAge = frame - sweepHitF;
          if (rescanAge < SWEEP_FRAMES) {
            base = 'gray';
            sweepProgress = rescanAge / SWEEP_FRAMES;
          } else if (rescanAge < SWEEP_FRAMES + FLIP_FRAMES) {
            base = 'green';
            flipAge = rescanAge - SWEEP_FRAMES;
          }
          // else: base stays 'green'
        }
      }
    }
  }

  // End-phase fade: red/orange persist longer, everything else fades first
  if (base === 'red' || base === 'orange') {
    endFadeOpacity = lerp(frame, END_PERSIST_FADE_START, END_PERSIST_FADE_END, 1, 0);
  } else if (base !== 'empty') {
    endFadeOpacity = lerp(frame, END_GREEN_FADE_START, END_GREEN_FADE_END, 1, 0);
  }

  return { base, appearAge, pulseAge, sweepProgress, flipAge, colorFlipAge, isQuestion, endFadeOpacity };
}

export function getGridData(frame: number): CellData[][] {
  return Array.from({ length: LARGE_ROWS }, (_, r) =>
    Array.from({ length: LARGE_COLS }, (_, c) => getCellData(r, c, frame))
  );
}

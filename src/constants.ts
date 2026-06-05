export const FPS = 30;
export const TOTAL_FRAMES = 895; // ~30s

// End-phase fades for clean loop
export const END_GREEN_FADE_START   = 740;
export const END_GREEN_FADE_END     = 775;
export const END_PERSIST_FADE_START = 865;
export const END_PERSIST_FADE_END   = 880;

// Scene boundaries
export const SCENE1_END = 285;   // 9.5s  — defect turns red at 240, stays ~1.5s
export const SCENE2_END = 420;   // 14s
export const SCENE3_START = 420;
export const SCENE3_END = 510;   // 17s
export const SCENE4_START = 570; // +2s pause before AI sweep
export const SCENE4_END = 660;
export const SCENE5_START = 660;

// Large 18×18 grid; center 6×6 is the production zone
export const LARGE_ROWS = 18;
export const LARGE_COLS = 18;
export const ORIGIN_ROW = 6; // top-left of center 6×6 in large grid
export const ORIGIN_COL = 6;
export const SMALL_ROWS = 6;
export const SMALL_COLS = 6;

export const BOX = 55;             // box pixel size — 18 cols × 60 - 5 ≈ 1075px
export const GAP = 5;              // gap between boxes
export const STEP = BOX + GAP;     // 60 px per cell slot
export const GRID_PX = LARGE_COLS * STEP - GAP;    // 1075 px
export const GRID_HEIGHT = LARGE_ROWS * STEP - GAP; // 1075 px (full internal height)

export const VISIBLE_ROWS = 12; // 6 context rows above + 6 production rows; bottom 6 hidden
export const VISIBLE_HEIGHT = VISIBLE_ROWS * STEP - GAP; // 715 px

// Zoom: scale around grid center (537.5, 537.5) ≡ production-zone center
export const ZOOM_IN = 3.04;  // shows only the center 6×6 production area
export const ZOOM_OUT = 1.0;  // full 18×18 visible — far-away view

// Production animation
export const PRE_FILLED = 0;   // no pre-filled: every box animates one by one
export const PROD_INT = 15;    // frames per new cell (~0.5s each)
export const SCAN_LAG = 2;     // 2 cell lag = scan fires after 3rd box appears

// Per-cell scan & flip animation
export const SWEEP_FRAMES = 8;  // top-to-bottom scan sweep duration (within gray phase)
export const FLIP_FRAMES = 10;  // Y-axis card flip duration: rotates 0→180° showing both faces

// Defect position in large-grid coords (zone position [2,3] + ORIGIN [6,6])
export const DEFECT_R = 8;
export const DEFECT_C = 9;

// Ripple cells: [large_row, large_col, delay_from_SCENE1_END, confirmed, post_sweep_color?]
// confirmed=true → stays non-green after AI rescan; post_sweep_color overrides 'red' default
export const RIPPLE: [number, number, number, boolean, ('red' | 'orange')?][] = [
  [7,  9,  30, false],           // above defect  — cleared by sweep → green
  [8,  8,  50, true,  'orange'], // left          — confirmed, orange after AI rescan
  [8, 10,  70, true,  'orange'], // right         — confirmed, orange after AI rescan
  [9,  9,  90, false],           // below         — cleared by sweep → green
  [6, 11, 115, false],           // top-right corner — clears to green after AI rescan
];

// Question-mark cells: [large_row, large_col, appearFrame?]
// Optional 3rd element overrides the default distance-based stagger formula.
export const Q_MARKS: [number, number, number?][] = [
  [7, 7, 330],  // 2nd cell / 2nd row of 6×6 — appears orange at frame 330
  // Top scatter (rows 0-5)
  [5, 8],  [5, 10], [4, 9],  [5, 7],  [4, 12], [3, 8],
  // Left edge (cols 0-5)
  [8, 5],  [10, 4], [7, 3],  [11, 5], [6, 2],
  // Right edge (cols 12-17)
  [7, 12], [9, 13], [8, 14], [5, 14],
  // Bottom scatter (rows 12-17)
  [12, 9], [13, 7], [12, 11],[14, 8],
  // Far outliers
  [2, 9],  [14, 13],[9, 15],
];

// Palette
export const BG = '#EDE8DC';
export const C_GRAY = '#BDBBB2';
export const C_GREEN = '#3DAE6B';
export const C_RED = '#E03535';
export const C_ORANGE = '#F08030';
export const C_TEXT = '#3D2810';

import React from 'react';
import { GRID_PX } from '../constants';
import { getGridData } from '../utils/grid';
import { Cell } from './Cell';
import { ScanLine } from './ScanLine';
import { AISweep } from './AISweep';

interface Props {
  frame: number;
}

export const MatrixGrid: React.FC<Props> = ({ frame }) => {
  const grid = getGridData(frame);

  return (
    <div style={{ position: 'relative', width: GRID_PX, height: GRID_PX }}>
      {grid.flatMap((rowArr, r) =>
        rowArr.map((data, c) => (
          <Cell key={`${r}-${c}`} row={r} col={c} data={data} frame={frame} />
        ))
      )}
      <ScanLine frame={frame} />
      <AISweep frame={frame} />

    </div>
  );
};


import { useMemo } from 'react';
import { WINNING_COMBINATIONS } from '../constants';

export const useBingoLogic = (markedIndices: Set<number>): number => {
  const bingoCount = useMemo(() => {
    if (markedIndices.size < 3) return 0;

    let count = 0;
    for (const combination of WINNING_COMBINATIONS) {
      const isBingo = combination.every(index => markedIndices.has(index));
      if (isBingo) {
        count++;
      }
    }
    return count;
  }, [markedIndices]);

  return bingoCount;
};

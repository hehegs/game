
import type { Activity } from './types';

export const INITIAL_ACTIVITIES: Activity[] = [
  { id: 1, name: '수영하기', image: '' },
  { id: 2, name: '캠핑가기', image: '' },
  { id: 3, name: '아이스크림 먹기', image: '' },
  { id: 4, name: '바다여행', image: '' },
  { id: 5, name: '자전거 타기', image: '' },
  { id: 6, name: '수박 먹기', image: '' },
  { id: 7, name: '독서하기', image: '' },
  { id: 8, name: '물놀이', image: '' },
  { id: 9, name: '불꽃놀이', image: '' },
];

export const WINNING_COMBINATIONS: number[][] = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

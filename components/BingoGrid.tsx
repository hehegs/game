
import React from 'react';
import { BingoCell } from './BingoCell';
import type { Activity } from '../types';

interface BingoGridProps {
  activities: Activity[];
  gameStarted: boolean;
  markedIndices: Set<number>;
  onCellClick: (index: number) => void;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDrop: () => void;
}

export const BingoGrid: React.FC<BingoGridProps> = ({
  activities,
  gameStarted,
  markedIndices,
  onCellClick,
  onDragStart,
  onDragEnter,
  onDrop,
}) => {
  return (
    <div 
      className="grid grid-cols-3 gap-2 sm:gap-4 p-2 sm:p-4 bg-blue-100 rounded-xl"
      onDragOver={(e) => e.preventDefault()}
    >
      {activities.map((activity, index) => (
        <BingoCell
          key={activity.id}
          activity={activity}
          index={index}
          isMarked={markedIndices.has(index)}
          gameStarted={gameStarted}
          onCellClick={onCellClick}
          onDragStart={onDragStart}
          onDragEnter={onDragEnter}
          onDrop={onDrop}
        />
      ))}
    </div>
  );
};

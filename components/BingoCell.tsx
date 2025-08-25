
import React, { useState } from 'react';
import type { Activity } from '../types';

interface BingoCellProps {
  activity: Activity;
  index: number;
  isMarked: boolean;
  gameStarted: boolean;
  onCellClick: (index: number) => void;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDrop: () => void;
}

export const BingoCell: React.FC<BingoCellProps> = ({
  activity,
  index,
  isMarked,
  gameStarted,
  onCellClick,
  onDragStart,
  onDragEnter,
  onDrop,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = () => {
    if (!gameStarted) {
      onDragStart(index);
    }
  };

  const handleDragEnter = () => {
    if (!gameStarted) {
      onDragEnter(index);
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    if (!gameStarted) {
      setIsDragOver(false);
    }
  };

  const handleDrop = () => {
    if (!gameStarted) {
      onDrop();
      setIsDragOver(false);
    }
  };

  const handleClick = () => {
    if (gameStarted) {
      onCellClick(index);
    }
  };

  const cellClasses = `
    relative aspect-square rounded-lg overflow-hidden shadow-lg 
    transition-all duration-300 ease-in-out
    ${gameStarted ? 'cursor-pointer hover:scale-105' : 'cursor-grab active:cursor-grabbing'}
    ${isDragOver ? 'ring-4 ring-blue-500 ring-offset-2 scale-105' : ''}
    ${isMarked ? 'ring-4 ring-red-500 ring-offset-2' : ''}
  `;

  return (
    <div
      draggable={!gameStarted}
      onDragStart={handleDragStart}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={cellClasses}
    >
      <img
        src={activity.image}
        alt={activity.name}
        className="w-full h-full object-cover select-none"
        draggable={false}
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-2 sm:p-3">
        <p className="text-white text-xs sm:text-sm font-bold drop-shadow-md">{activity.name}</p>
      </div>

      {isMarked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-3/4 h-3/4 border-8 border-red-500 rounded-full bg-red-500 bg-opacity-20 transition-transform transform scale-100 animate-pop-in"></div>
        </div>
      )}
      <style>{`
        @keyframes pop-in {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in { animation: pop-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

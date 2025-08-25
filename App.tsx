
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BingoGrid } from './components/BingoGrid';
import { useBingoLogic } from './hooks/useBingoLogic';
import { INITIAL_ACTIVITIES } from './constants';
import type { Activity } from './types';

const activityToPrompt = (name: string): string => {
    const basePrompt = "A kid-friendly, vibrant, simple illustration, in a cartoon style of";
    switch (name) {
        case '수영하기': return `${basePrompt} a person happily swimming in a clear blue pool on a summer day.`;
        case '캠핑가기': return `${basePrompt} a cozy camping tent under a starry night sky with a campfire.`;
        case '아이스크림 먹기': return `${basePrompt} a child happily eating a large, melting ice cream cone on a sunny day.`;
        case '바다여행': return `${basePrompt} a beautiful tropical beach with palm trees and clear blue water.`;
        case '자전거 타기': return `${basePrompt} a person riding a bicycle through a green park on a sunny day.`;
        case '수박 먹기': return `${basePrompt} a large, juicy slice of red watermelon on a picnic blanket.`;
        case '독서하기': return `${basePrompt} a person relaxing in a hammock and reading a book under a shady tree.`;
        case '물놀이': return `${basePrompt} children having a fun water fight with water guns in a backyard.`;
        case '불꽃놀이': return `${basePrompt} spectacular colorful fireworks exploding in a dark night sky.`;
        default: return `${basePrompt} a fun summer activity.`;
    }
};

const App: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [initialGeneratedActivities, setInitialGeneratedActivities] = useState<Activity[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [markedIndices, setMarkedIndices] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateImages = async () => {
      try {
        if (!process.env.API_KEY) {
          throw new Error("API_KEY environment variable not set.");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const imageGenerationPromises = INITIAL_ACTIVITIES.map(activity =>
          ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: activityToPrompt(activity.name),
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1',
            },
          }).then(response => {
              if (!response.generatedImages || response.generatedImages.length === 0) {
                  throw new Error(`Image generation failed for prompt: ${activityToPrompt(activity.name)}`);
              }
              const base64ImageBytes = response.generatedImages[0].image.imageBytes;
              return `data:image/jpeg;base64,${base64ImageBytes}`;
          })
        );
        
        const generatedImageUrls = await Promise.all(imageGenerationPromises);

        const updatedActivities = INITIAL_ACTIVITIES.map((activity, index) => ({
          ...activity,
          image: generatedImageUrls[index],
        }));
        
        setActivities(updatedActivities);
        setInitialGeneratedActivities(updatedActivities);
      } catch (err) {
        console.error("Error generating images:", err);
        setError("그림을 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
      } finally {
        setIsLoading(false);
      }
    };

    generateImages();
  }, []);

  const bingoCount = useBingoLogic(markedIndices);

  const draggedItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    draggedItemIndex.current = index;
  }, []);

  const handleDragEnter = useCallback((index: number) => {
    dragOverItemIndex.current = index;
  }, []);

  const handleDrop = useCallback(() => {
    if (draggedItemIndex.current === null || dragOverItemIndex.current === null || draggedItemIndex.current === dragOverItemIndex.current) {
      return;
    }

    const newActivities = [...activities];
    const draggedItem = newActivities[draggedItemIndex.current];
    const dragOverItem = newActivities[dragOverItemIndex.current];

    newActivities[draggedItemIndex.current] = dragOverItem;
    newActivities[dragOverItemIndex.current] = draggedItem;
    
    setActivities(newActivities);

    draggedItemIndex.current = null;
    dragOverItemIndex.current = null;
  }, [activities]);

  const handleCellClick = useCallback((index: number) => {
    if (!gameStarted) return;

    setMarkedIndices(prev => {
      const newMarked = new Set(prev);
      if (newMarked.has(index)) {
        newMarked.delete(index);
      } else {
        newMarked.add(index);
      }
      return newMarked;
    });
  }, [gameStarted]);
  
  const handleGameAction = () => {
    if (gameStarted) {
      setGameStarted(false);
      setMarkedIndices(new Set());
      setActivities(initialGeneratedActivities);
    } else {
      setGameStarted(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-blue-100/50">
        <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-blue-800">빙고판 그림을 만들고 있어요...</h2>
            <p className="text-gray-500 mt-2">잠시만 기다려 주세요!</p>
        </div>
      </div>
    );
  }

  if (error) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-red-100/50">
            <div className="text-center p-8 bg-white rounded-lg shadow-xl">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="mt-4 text-2xl font-bold text-red-700">오류 발생</h2>
                <p className="text-gray-600 mt-2">{error}</p>
            </div>
        </div>
     );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-blue-100/50">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden border-4 border-blue-200">
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 tracking-tight">여름 활동 빙고!</h1>
          <p className="text-gray-500 mt-2">그림을 드래그해서 나만의 빙고판을 만들고 게임을 시작하세요.</p>
        </div>

        <BingoGrid
          activities={activities}
          gameStarted={gameStarted}
          markedIndices={markedIndices}
          onCellClick={handleCellClick}
          onDragStart={handleDragStart}
          onDragEnter={handleDragEnter}
          onDrop={handleDrop}
        />

        <div className="mt-8 flex items-center justify-between">
            <button
                onClick={handleGameAction}
                className={`px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
                gameStarted 
                ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-300' 
                : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300'
                }`}
            >
                {gameStarted ? '다시하기' : '게임 시작'}
            </button>
            {gameStarted && (
                <div className="text-right">
                    <span className="text-gray-500 text-sm">완성된 줄</span>
                    <p className="text-5xl font-bold text-blue-600">{bingoCount}</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default App;

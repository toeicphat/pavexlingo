import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { VocabItem } from '../types';

interface BubbleGameProps {
  vocabData: VocabItem[];
  onFinish?: (correct: number, wrong: number) => void;
  onBack: () => void;
}

type Difficulty = 'easy' | 'hard';
type GameMode = 'word-meaning' | 'meaning-word';

interface BubbleData {
  id: number;
  text: string;
  isCorrect: boolean;
  shape: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isShaking: boolean;
  isGlowing: boolean;
}

const SHAPES = [
  'circle',
  'square',
  'hexagon',
  'pentagon',
  'octagon'
];

const SHAPE_STYLES: Record<string, string> = {
  circle: '50%',
  square: '0%',
  triangle: 'polygon(50% 0%, 0% 100%, 100% 100%)',
  hexagon: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
  diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  oval: '50% / 30%',
  pentagon: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
  octagon: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
  heart: 'path("M 50,30 A 20,20 0,0,1 90,30 A 20,20 0,0,1 50,80 A 20,20 0,0,1 10,30 A 20,20 0,0,1 50,30 Z")', // simple approximation or we can just use clip-path polygon for star/heart or border-radius
  star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
};

const BUBBLE_SIZE = 160; // Increased size to accommodate long text

const generateRandomHex = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

const getRandomColors = () => {
  let color1 = generateRandomHex();
  let color2 = generateRandomHex();
  // Ensure enough difference (simple heuristic, we could calculate distance)
  while (color1 === color2) {
    color2 = generateRandomHex();
  }
  return { topColor: color1, bubbleColor: color2 };
};

export const BubbleGame: React.FC<BubbleGameProps> = ({ vocabData, onFinish, onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('word-meaning');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wrongClicks, setWrongClicks] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [shuffledVocabData, setShuffledVocabData] = useState<VocabItem[]>([]);
  
  const [topColor, setTopColor] = useState<string>('#ffffff');
  const [bubbleColor, setBubbleColor] = useState<string>('#ffffff');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const bubblesRef = useRef<BubbleData[]>([]);
  const bubbleElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  const [bubbles, setBubbles] = useState<BubbleData[]>([]);

  const startTurn = useCallback(() => {
    if (shuffledVocabData.length === 0) return;

    if (currentIndex >= shuffledVocabData.length) {
      setGameOver(true);
      if (onFinish) onFinish(correctWords, wrongClicks);
      return;
    }

    const { topColor, bubbleColor } = getRandomColors();
    setTopColor(topColor);
    setBubbleColor(bubbleColor);

    const targetWord = shuffledVocabData[currentIndex];
    
    let bubbleCount = 5; // Always 5 bubbles now
    const speedMultiplier = difficulty === 'hard' ? 4 : 1.5;

    const newBubbles: BubbleData[] = [];
    const containerWidth = containerRef.current?.clientWidth || window.innerWidth;
    const containerHeight = containerRef.current?.clientHeight || window.innerHeight - 200; // rough estimation

    // Collect distractors
    const distractors = vocabData.filter(v => v.word !== targetWord.word);
    const shuffledDistractors = [...distractors].sort(() => Math.random() - 0.5);

    for (let i = 0; i < bubbleCount; i++) {
      const isCorrect = i === 0; // We'll shuffle later
      const distractor = distractors.length > 0 
        ? shuffledDistractors[(i - 1 + distractors.length) % distractors.length] 
        : { word: 'Random', definition: 'Random definition' };
      
      const text = isCorrect 
        ? (gameMode === 'word-meaning' ? targetWord.definition : targetWord.word) 
        : (gameMode === 'word-meaning' ? distractor.definition : distractor.word);

      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      
      const x = Math.random() * (containerWidth - BUBBLE_SIZE);
      const y = Math.random() * (containerHeight - BUBBLE_SIZE);
      const vx = (Math.random() - 0.5) * 2 * speedMultiplier;
      const vy = (Math.random() - 0.5) * 2 * speedMultiplier;
      
      newBubbles.push({
        id: i,
        text,
        isCorrect,
        shape,
        x,
        y,
        vx,
        vy,
        width: BUBBLE_SIZE,
        height: BUBBLE_SIZE,
        isShaking: false,
        isGlowing: false,
      });
    }

    // Shuffle bubbles
    const shuffledBubbles = newBubbles.sort(() => Math.random() - 0.5);
    bubblesRef.current = shuffledBubbles;
    setBubbles(shuffledBubbles);

  }, [currentIndex, difficulty, gameMode, shuffledVocabData, vocabData, correctWords, wrongClicks, onFinish]);

  useEffect(() => {
    if (difficulty && !gameOver && containerRef.current && shuffledVocabData.length > 0) {
      startTurn();
    }
  }, [difficulty, currentIndex, shuffledVocabData]);

  const updateBubbles = useCallback(() => {
    if (!containerRef.current || gameOver) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    bubblesRef.current.forEach(bubble => {
      let nextX = bubble.x + bubble.vx;
      let nextY = bubble.y + bubble.vy;

      if (nextX <= 0) {
        nextX = 0;
        bubble.vx = Math.abs(bubble.vx);
      } else if (nextX + bubble.width >= containerWidth) {
        nextX = containerWidth - bubble.width;
        bubble.vx = -Math.abs(bubble.vx);
      }

      if (nextY <= 0) {
        nextY = 0;
        bubble.vy = Math.abs(bubble.vy);
      } else if (nextY + bubble.height >= containerHeight) {
        nextY = containerHeight - bubble.height;
        bubble.vy = -Math.abs(bubble.vy);
      }

      bubble.x = nextX;
      bubble.y = nextY;

      const el = bubbleElementsRef.current[bubble.id];
      if (el) {
        el.style.transform = `translate3d(${bubble.x}px, ${bubble.y}px, 0)`;
      }
    });

    requestRef.current = requestAnimationFrame(updateBubbles);
  }, [gameOver]);

  useEffect(() => {
    if (difficulty && !gameOver) {
      requestRef.current = requestAnimationFrame(updateBubbles);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [difficulty, gameOver, updateBubbles]);

  const handleBubbleClick = (bubbleId: number, isCorrect: boolean) => {
    // Prevent multiple clicks while animating
    if (bubblesRef.current.some(b => b.isGlowing || b.isShaking)) return;

    if (isCorrect) {
      setCorrectWords(prev => prev + 1);
      const idx = bubblesRef.current.findIndex(b => b.id === bubbleId);
      if (idx !== -1) {
        bubblesRef.current[idx].isGlowing = true;
        // Pause movement for the correct bubble briefly
        bubblesRef.current[idx].vx = 0;
        bubblesRef.current[idx].vy = 0;
        setBubbles([...bubblesRef.current]);
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
        }, 500);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    } else {
      setWrongClicks(prev => prev + 1);
      // Shake animation
      const idx = bubblesRef.current.findIndex(b => b.id === bubbleId);
      if (idx !== -1) {
        bubblesRef.current[idx].isShaking = true;
        // Pause movement for the wrong bubble briefly
        bubblesRef.current[idx].vx = 0;
        bubblesRef.current[idx].vy = 0;
        setBubbles([...bubblesRef.current]);
        setTimeout(() => {
          // Move on to next word
          setCurrentIndex(prev => prev + 1);
        }, 500);
      }
    }
  };

  const getShapeStyle = (shape: string, color: string) => {
    const clipPath = SHAPE_STYLES[shape] || '50%';
    const style: React.CSSProperties = {
      backgroundColor: color,
      transition: 'all 0.2s ease-in-out',
    };
    
    if (shape === 'circle' || shape === 'oval') {
      style.borderRadius = clipPath;
    } else if (shape === 'square') {
      style.borderRadius = '24px';
    } else {
      style.clipPath = clipPath;
    }
    
    return style;
  };

  const handleStartGame = (diff: Difficulty) => {
    setShuffledVocabData([...vocabData].sort(() => Math.random() - 0.5));
    setDifficulty(diff);
  };

  if (!difficulty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-xl shadow p-8 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Game Setup</h2>
        
        <div className="mb-8 w-full bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h3 className="text-xl font-bold text-slate-700 mb-4">1. Select Mode</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setGameMode('word-meaning')}
              className={`px-6 py-3 rounded-xl font-bold text-lg transition-transform flex-1 max-w-[200px] ${gameMode === 'word-meaning' ? 'bg-indigo-600 text-white shadow-md transform scale-105' : 'bg-white text-slate-600 border-2 border-slate-200 hover:bg-slate-100'}`}
            >
              Word → Meaning
            </button>
            <button 
              onClick={() => setGameMode('meaning-word')}
              className={`px-6 py-3 rounded-xl font-bold text-lg transition-transform flex-1 max-w-[200px] ${gameMode === 'meaning-word' ? 'bg-indigo-600 text-white shadow-md transform scale-105' : 'bg-white text-slate-600 border-2 border-slate-200 hover:bg-slate-100'}`}
            >
              Meaning → Word
            </button>
          </div>
        </div>

        <div className="w-full bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h3 className="text-xl font-bold text-slate-700 mb-4">2. Select Difficulty to Start</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => handleStartGame('easy')}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-lg shadow transition-transform hover:scale-105 flex-1 max-w-[200px]"
            >
              Easy
            </button>
            <button 
              onClick={() => handleStartGame('hard')}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-lg shadow transition-transform hover:scale-105 flex-1 max-w-[200px]"
            >
              Hard
            </button>
          </div>
        </div>

        <button onClick={onBack} className="mt-8 px-6 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition-colors">
          Go Back
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-xl shadow p-8">
        <h2 className="text-4xl font-bold text-slate-800 mb-4">Game Over!</h2>
        <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl flex flex-col gap-4 w-full max-w-md text-center mb-8">
          <p className="text-2xl text-slate-600">Total Correct Words: <span className="font-bold text-green-600">{correctWords}</span></p>
          <p className="text-2xl text-slate-600">Total Wrong Clicks: <span className="font-bold text-red-600">{wrongClicks}</span></p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => {
              setDifficulty(null);
              setCurrentIndex(0);
              setCorrectWords(0);
              setWrongClicks(0);
              setGameOver(false);
            }}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Play Again
          </button>
          <button 
            onClick={onBack}
            className="px-8 py-3 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition-colors shadow-md hover:shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentWord = shuffledVocabData[currentIndex];

  return (
    <div className="flex flex-col h-[70vh] rounded-xl overflow-hidden bg-slate-900 shadow-xl relative border border-slate-700">
      {/* Top Word Box */}
      <div 
        className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-8 py-4 rounded-2xl shadow-lg border-2 border-white/20 transition-colors duration-500 min-w-[200px] text-center"
        style={{ backgroundColor: topColor }}
      >
        <h3 
          className="text-2xl sm:text-3xl font-black tracking-wide leading-tight px-4"
          style={{ 
            color: '#fff',
            textShadow: '0px 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          {gameMode === 'word-meaning' ? currentWord?.word : currentWord?.definition || ''}
        </h3>
        <div className="text-white/90 font-medium text-sm mt-2 mix-blend-difference">
          {currentIndex + 1} / {shuffledVocabData.length} | Wrong: {wrongClicks}
        </div>
      </div>

      {/* Play Area */}
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
      >
        {bubbles.map(bubble => (
          <div
            key={bubble.id}
            ref={el => bubbleElementsRef.current[bubble.id] = el}
            className={`absolute ${bubble.isShaking ? 'animate-bounce' : ''}`}
            style={{
              transform: `translate3d(${bubble.x}px, ${bubble.y}px, 0)`,
              width: `${bubble.width}px`,
              height: `${bubble.height}px`,
              willChange: 'transform',
              filter: bubble.isGlowing 
                ? 'drop-shadow(0 0 20px #4ade80)' 
                : 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.4))',
              zIndex: bubble.isGlowing ? 20 : 10,
            }}
          >
            <div
              className="w-full h-full p-[6px] transition-transform hover:scale-105 cursor-pointer"
              style={getShapeStyle(bubble.shape, bubble.isGlowing ? '#4ade80' : 'rgba(255,255,255,0.9)')}
              onClick={() => handleBubbleClick(bubble.id, bubble.isCorrect)}
            >
              <div 
                className="w-full h-full flex items-center justify-center text-center text-white font-bold text-[0.85rem] leading-tight select-none p-2"
                style={getShapeStyle(bubble.shape, bubble.isShaking ? '#ef4444' : bubbleColor)}
              >
                <span className="drop-shadow-md overflow-hidden text-ellipsis line-clamp-4 w-[90%] break-words whitespace-normal">
                  {bubble.text}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

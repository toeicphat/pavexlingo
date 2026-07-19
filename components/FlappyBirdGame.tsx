import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VocabItem } from '../types';

interface FlappyBirdGameProps {
  vocabData: VocabItem[];
  onFinish?: (correct: number, wrong: number) => void;
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';
type GameMode = 'word-meaning' | 'meaning-word';
type GameState = 'start' | 'playing' | 'paused' | 'gameover' | 'resume_pause' | 'life_lost';

interface Pipe {
  x: number;
  topHeight: number;
  passed: boolean;
}

const GRAVITY = 0.25;
const JUMP = -5;
const PIPE_SPEED = 2.5;
const PIPE_SPAWN_RATE = 120; // frames
const PIPE_WIDTH = 52;
const PIPE_GAP = 180;
const BIRD_SIZE = 30;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const FLOOR_HEIGHT = 60;

export const FlappyBirdGame: React.FC<FlappyBirdGameProps> = ({ vocabData, onFinish, onBack }) => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [lives, setLives] = useState(5);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const correctRef = useRef(0);
  const wrongRef = useRef(0);
  
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizWord, setQuizWord] = useState<VocabItem | null>(null);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [quizMode, setQuizMode] = useState<GameMode>('word-meaning');
  const [timeLeft, setTimeLeft] = useState(30);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  
  // Game state refs (for synchronous access in loop)
  const birdY = useRef(300);
  const birdVelocity = useRef(0);
  const pipes = useRef<Pipe[]>([]);
  const frameCount = useRef(0);
  const animFrameCount = useRef(0);
  
  const shuffledVocab = useRef<VocabItem[]>([]);
  const currentWordIndex = useRef(0);
  
  const timerRef = useRef<NodeJS.Timeout>();

  const initGame = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    setGameState('playing');
    setLives(5);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    correctRef.current = 0;
    wrongRef.current = 0;
    
    birdY.current = 300;
    birdVelocity.current = 0;
    pipes.current = [];
    frameCount.current = 0;
    animFrameCount.current = 0;
    
    shuffledVocab.current = [...vocabData].sort(() => Math.random() - 0.5);
    currentWordIndex.current = 0;
  }, [vocabData]);

  const triggerQuiz = useCallback(() => {
    setGameState('paused');
    
    // Choose mode randomly
    const randomMode: GameMode = Math.random() > 0.5 ? 'word-meaning' : 'meaning-word';
    setQuizMode(randomMode);
    
    const targetWord = shuffledVocab.current[currentWordIndex.current];
    setQuizWord(targetWord);
    
    // Generate options
    const distractors = vocabData.filter(v => v.word !== targetWord.word).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [targetWord, ...distractors].sort(() => Math.random() - 0.5).map(v => randomMode === 'word-meaning' ? v.definition : v.word);
    
    setQuizOptions(options);
    setShowQuiz(true);
    
    // Set timer based on difficulty
    let timeLimit = 30;
    if (difficulty === 'medium') timeLimit = 15;
    if (difficulty === 'hard') timeLimit = 5;
    
    setTimeLeft(timeLimit);
    
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleQuizTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [vocabData, difficulty]);

  const handleQuizAnswer = (answer: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowQuiz(false);
    
    const targetWord = quizWord;
    if (!targetWord) return;
    
    const isCorrect = quizMode === 'word-meaning' ? targetWord.definition === answer : targetWord.word === answer;
    
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      correctRef.current++;
      setScore(prev => prev + 1);
      currentWordIndex.current++;
      
      if (currentWordIndex.current >= shuffledVocab.current.length) {
        setGameState('gameover');
        if (onFinish) onFinish(correctRef.current, wrongRef.current);
      } else {
        setGameState('resume_pause');
      }
    } else {
      setWrongCount(prev => prev + 1);
      wrongRef.current++;
      loseLife();
    }
  };

  const handleQuizTimeout = () => {
    setShowQuiz(false);
    setWrongCount(prev => prev + 1);
    wrongRef.current++;
    loseLife();
  };

  const loseLife = () => {
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        setGameState('gameover');
        if (onFinish) onFinish(correctRef.current, wrongRef.current);
      } else {
        setGameState('life_lost');
      }
      return newLives;
    });
  };

  const continueGame = useCallback(() => {
    birdY.current = 300;
    birdVelocity.current = 0;
    pipes.current = [];
    setGameState('resume_pause');
  }, []);

  const updateGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (gameState === 'playing' || gameState === 'resume_pause') {
      animFrameCount.current++;
    }

    // Sky Background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    bgGradient.addColorStop(0, "#87CEEB");
    bgGradient.addColorStop(0.6, "#B0E0E6");
    bgGradient.addColorStop(1, "#E0F7FA");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Clouds
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    const cloudOffset = (animFrameCount.current * 0.5) % (CANVAS_WIDTH + 100);
    ctx.beginPath();
    ctx.ellipse(CANVAS_WIDTH - cloudOffset, 80, 40, 18, 0, 0, Math.PI * 2);
    ctx.ellipse(CANVAS_WIDTH - cloudOffset + 30, 75, 30, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse((CANVAS_WIDTH - cloudOffset + 200) % (CANVAS_WIDTH + 100), 140, 35, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Game Logic
    if (gameState === 'playing') {
      frameCount.current++;
      birdVelocity.current += GRAVITY;
      if (birdVelocity.current > 6) birdVelocity.current = 6;
      birdY.current += birdVelocity.current;

      // Floor collision
      if (birdY.current + BIRD_SIZE/2 >= CANVAS_HEIGHT - FLOOR_HEIGHT) {
         loseLife();
         return;
      }
      if (birdY.current - BIRD_SIZE/2 <= 0) {
         birdY.current = BIRD_SIZE/2;
         birdVelocity.current = 0;
      }

      // Spawn pipes
      if (frameCount.current % PIPE_SPAWN_RATE === 0) {
        const minPipeHeight = 50;
        const maxPipeHeight = CANVAS_HEIGHT - FLOOR_HEIGHT - PIPE_GAP - minPipeHeight;
        const topHeight = Math.random() * maxPipeHeight + minPipeHeight;
        pipes.current.push({
          x: CANVAS_WIDTH,
          topHeight,
          passed: false
        });
      }

      // Update pipes
      for (let i = pipes.current.length - 1; i >= 0; i--) {
        const p = pipes.current[i];
        p.x -= PIPE_SPEED;

        // Collision detection
        const birdX = 80;
        const bLeft = birdX - BIRD_SIZE/2 + 4;
        const bRight = birdX + BIRD_SIZE/2 - 4;
        const bTop = birdY.current - BIRD_SIZE/2 + 4;
        const bBottom = birdY.current + BIRD_SIZE/2 - 4;
        
        const bottomY = p.topHeight + PIPE_GAP;

        if (bRight > p.x && bLeft < p.x + PIPE_WIDTH) {
          if (bTop < p.topHeight || bBottom > bottomY) {
             loseLife();
             return;
          }
        }

        // Pass pipe -> trigger quiz
        if (!p.passed && birdX > p.x + PIPE_WIDTH / 2) {
          p.passed = true;
          triggerQuiz();
          return; // Pause game immediately
        }

        // Remove off-screen pipes
        if (p.x + PIPE_WIDTH < 0) {
          pipes.current.splice(i, 1);
        }
      }
    } else if (gameState === 'resume_pause') {
       birdVelocity.current = Math.max(birdVelocity.current, 0);
    }

    // Draw pipes
    pipes.current.forEach(p => {
      const pipeGradient = ctx.createLinearGradient(p.x, 0, p.x + PIPE_WIDTH, 0);
      pipeGradient.addColorStop(0, "#4CAF50");
      pipeGradient.addColorStop(0.3, "#66BB6A");
      pipeGradient.addColorStop(0.7, "#43A047");
      pipeGradient.addColorStop(1, "#388E3C");
      
      const bottomY = p.topHeight + PIPE_GAP;

      // Top pipe
      ctx.fillStyle = pipeGradient;
      ctx.fillRect(p.x, 0, PIPE_WIDTH, p.topHeight);
      ctx.fillStyle = "#388E3C";
      ctx.fillRect(p.x - 4, p.topHeight - 20, PIPE_WIDTH + 8, 20);
      ctx.strokeStyle = "#2E7D32";
      ctx.lineWidth = 2;
      ctx.strokeRect(p.x - 4, p.topHeight - 20, PIPE_WIDTH + 8, 20);

      // Bottom pipe
      ctx.fillStyle = pipeGradient;
      ctx.fillRect(p.x, bottomY, PIPE_WIDTH, CANVAS_HEIGHT - FLOOR_HEIGHT - bottomY);
      ctx.fillStyle = "#388E3C";
      ctx.fillRect(p.x - 4, bottomY, PIPE_WIDTH + 8, 20);
      ctx.strokeStyle = "#2E7D32";
      ctx.lineWidth = 2;
      ctx.strokeRect(p.x - 4, bottomY, PIPE_WIDTH + 8, 20);
    });

    // Floor
    const floorGradient = ctx.createLinearGradient(0, CANVAS_HEIGHT - FLOOR_HEIGHT, 0, CANVAS_HEIGHT);
    floorGradient.addColorStop(0, "#8BC34A");
    floorGradient.addColorStop(0.3, "#7CB342");
    floorGradient.addColorStop(1, "#558B2F");
    ctx.fillStyle = floorGradient;
    ctx.fillRect(0, CANVAS_HEIGHT - FLOOR_HEIGHT, CANVAS_WIDTH, FLOOR_HEIGHT);
    ctx.strokeStyle = "#33691E";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_HEIGHT - FLOOR_HEIGHT);
    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - FLOOR_HEIGHT);
    ctx.stroke();

    // Draw bird
    ctx.save();
    ctx.translate(80, birdY.current);
    
    // Rotation based on velocity
    let rotation = (birdVelocity.current * 4) * Math.PI / 180;
    if (rotation < -0.5) rotation = -0.5;
    if (rotation > 0.8) rotation = 0.8;
    ctx.rotate(rotation);

    // Body
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.ellipse(0, 0, BIRD_SIZE / 2, BIRD_SIZE / 2.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#FFA000";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Wing
    const wingFlap = (gameState === 'playing' || gameState === 'resume_pause') ? Math.sin(animFrameCount.current * 0.3) * 4 : 0;
    ctx.fillStyle = "#FFC107";
    ctx.beginPath();
    ctx.ellipse(-4, wingFlap, 8, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(8, -4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.arc(9, -4, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = "#FF6D00";
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(20, 2);
    ctx.lineTo(12, 5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    if (gameState === 'playing' || gameState === 'start' || gameState === 'resume_pause') {
      requestRef.current = requestAnimationFrame(updateGame);
    }
  }, [gameState, triggerQuiz]);

  useEffect(() => {
    if (gameState !== 'paused' && gameState !== 'gameover') {
      requestRef.current = requestAnimationFrame(updateGame);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, updateGame]);

  const jump = useCallback(() => {
    if (gameState === 'resume_pause') {
      setGameState('playing');
      birdVelocity.current = Math.max(birdVelocity.current, 0); // small hop or fall
    } else if (gameState === 'playing') {
      birdVelocity.current = JUMP;
    }
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (gameState === 'life_lost') {
          continueGame();
        } else if (gameState === 'gameover' && lives <= 0) {
          setGameState('start');
        } else {
          jump();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump, gameState, continueGame, lives]);

  return (
    <div className="flex flex-col h-[70vh] rounded-xl overflow-hidden bg-slate-900 shadow-xl relative border border-slate-700 select-none items-center justify-center">
      
      {/* HUD */}
      {(gameState === 'playing' || gameState === 'paused' || gameState === 'resume_pause') && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex justify-between items-center bg-white/80 p-3 rounded-xl shadow-md w-full max-w-[380px]">
          <div className="font-bold text-slate-800 text-lg">📚 {currentWordIndex.current + 1} / {vocabData.length}</div>
          <div className="flex gap-1">
             <span className="font-bold text-slate-800 text-lg">❤️ {lives}</span>
          </div>
        </div>
      )}

      {/* Canvas */}
      <canvas 
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onClick={jump}
        className="h-full w-auto max-w-full object-cover cursor-pointer touch-none bg-sky-200"
      />

      {/* Start Screen */}
      {gameState === 'start' && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 z-20 pointer-events-none">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center pointer-events-auto">
            <div className="text-6xl mb-4">🐤</div>
            <h2 className="text-3xl font-black text-slate-800 mb-4">Flappy Bird Từ Vựng</h2>
            <p className="text-slate-600 mb-8">Chạm màn hình hoặc nhấn Space để bắt đầu!<br/>Trả lời sai bị trừ 1 mạng (tổng 5 mạng).</p>
            
            <h3 className="font-bold text-slate-700 mb-4 text-xl">Chọn độ khó</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button onClick={() => initGame('easy')} className="px-4 py-2 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600">Dễ (30s)</button>
              <button onClick={() => initGame('medium')} className="px-4 py-2 bg-yellow-500 text-white rounded-xl font-bold hover:bg-yellow-600">Vừa (15s)</button>
              <button onClick={() => initGame('hard')} className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600">Khó (5s)</button>
            </div>
            
            <button onClick={onBack} className="text-slate-500 underline font-medium">Quay lại</button>
          </div>
        </div>
      )}

      {/* Resume Pause Screen */}
      {gameState === 'resume_pause' && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4 z-20 pointer-events-none">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center pointer-events-auto">
            <p className="text-slate-600 font-bold">Chạm một lần để rơi tiếp, lần sau mới nhảy lên.</p>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuiz && quizWord && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4 z-30">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center transform transition-all">
            <div className="mb-6 relative">
               <div className="text-sm font-bold text-slate-400 mb-2 uppercase">Thời gian</div>
               <div className="text-4xl font-black text-indigo-600">{timeLeft}s</div>
               <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
                 <div 
                   className="h-full bg-indigo-500 transition-all duration-1000 linear" 
                   style={{ width: `${(timeLeft / (difficulty === 'easy' ? 30 : difficulty === 'medium' ? 15 : 5)) * 100}%` }}
                 />
               </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              {quizMode === 'word-meaning' ? 'Nghĩa của từ này là gì?' : 'Từ này tiếng Anh là gì?'}
            </h3>
            <div className="text-3xl font-black text-indigo-600 mb-8 py-4 bg-indigo-50 rounded-xl">
              {quizMode === 'word-meaning' ? quizWord.word : quizWord.definition}
            </div>

            <div className="flex flex-col gap-3">
              {quizOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleQuizAnswer(opt)}
                  className="w-full p-4 text-left bg-slate-50 hover:bg-indigo-50 border-2 border-slate-200 hover:border-indigo-300 rounded-xl font-medium text-slate-700 transition-colors"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Life Lost Screen */}
      {gameState === 'life_lost' && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 z-40 pointer-events-none">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center pointer-events-auto">
            <div className="text-6xl mb-4">💥</div>
            <h2 className="text-3xl font-black text-red-500 mb-4">Rất tiếc!</h2>
            <p className="text-slate-600 mb-8 font-medium">Bạn bị trừ 1 mạng. Bạn còn <span className="font-bold text-slate-800">{lives}</span> mạng.</p>
            <button 
              onClick={continueGame}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg"
            >
              Chơi tiếp
            </button>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-40">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
            <h2 className="text-4xl font-black text-slate-800 mb-2">
              {lives > 0 ? 'Thành công!' : 'Kết thúc'}
            </h2>
            <p className="text-slate-600 mb-8">
              {lives > 0 ? 'Bạn đã hoàn thành tất cả các từ!' : 'Bạn đã hết mạng.'}
            </p>
            
            <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-200 flex justify-around">
              <div className="text-center">
                <div className="text-sm font-bold text-slate-500">Đúng</div>
                <div className="text-3xl font-black text-green-500">{correctCount}</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-slate-500">Sai</div>
                <div className="text-3xl font-black text-red-500">{wrongCount}</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setGameState('start')}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg"
              >
                Chơi lại
              </button>
              <button 
                onClick={onBack}
                className="w-full py-4 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

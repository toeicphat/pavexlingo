import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VocabItem } from '../types';

interface WordRainGameProps {
  vocabData: VocabItem[];
  testTitle?: string;
  onFinish?: (score: number) => void;
  onBack: () => void;
}

type Difficulty = 'easy' | 'hard';

interface FallingWord {
  id: number;
  vocab: VocabItem;
  x: number;
  y: number;
  vy: number;
  revealedText: string;
  fullWord: string;
  state: 'active' | 'dying' | 'dead';
  explosionTimer?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetId: number;
  active: boolean;
}

interface RainDrop {
  x: number;
  y: number;
  vy: number;
  length: number;
  opacity: number;
}

export const WordRainGame: React.FC<WordRainGameProps> = ({ vocabData, testTitle = "Vocabulary", onBack }) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameover'>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [typedText, setTypedText] = useState("");
  const [isMuted, setIsMuted] = useState(false);

  const typedTextRef = useRef("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wordsRef = useRef<FallingWord[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const rainRef = useRef<RainDrop[]>([]);
  const animationRef = useRef<number>();
  
  const lastSpawnTime = useRef<number>(0);
  const wordsQueue = useRef<VocabItem[]>([...vocabData]);
  
  const cannonAngleRef = useRef<number>(0);
  const targetCannonAngleRef = useRef<number>(0);

  // Create rain drops
  useEffect(() => {
    if (rainRef.current.length === 0) {
      for (let i = 0; i < 100; i++) {
        rainRef.current.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vy: 5 + Math.random() * 10,
          length: 10 + Math.random() * 20,
          opacity: 0.1 + Math.random() * 0.3
        });
      }
    }
  }, []);

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setScore(0);
    setLives(5);
    setTypedText("");
    typedTextRef.current = "";
    wordsQueue.current = [...vocabData].sort(() => Math.random() - 0.5);
    wordsRef.current = [];
    particlesRef.current = [];
    bulletsRef.current = [];
    lastSpawnTime.current = Date.now();
    cannonAngleRef.current = 0;
    targetCannonAngleRef.current = 0;
    setGameState('playing');
  };

  const createExplosion = (x: number, y: number, color: string) => {
    for (let i = 0; i < 30; i++) {
      particlesRef.current.push({
        x, y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1,
        maxLife: 30 + Math.random() * 20,
        color
      });
    }
  };

  const getRevealedText = (word: string) => {
    const w = word.trim().toLowerCase();
    const revealCount = Math.max(1, Math.min(2, Math.floor(w.length / 4)));
    let res = "";
    for (let i = 0; i < w.length; i++) {
      if (w[i] === " " || w[i] === "-") res += w[i];
      else if (i < revealCount) res += w[i];
      else res += "_";
    }
    return res.split('').join(' ');
  };

  const spawnWord = (canvasWidth: number) => {
    if (wordsQueue.current.length === 0) return;
    const vocab = wordsQueue.current.pop()!;
    // Speed adjustments: Easy is reduced by 50%
    const baseVy = difficulty === 'easy' ? 0.125 : 0.5;
    const randVy = difficulty === 'easy' ? 0.125 : 0.5;
    
    const fw: FallingWord = {
      id: Date.now() + Math.random(),
      vocab,
      x: 100 + Math.random() * (canvasWidth - 200),
      y: -50,
      vy: baseVy + Math.random() * randVy,
      revealedText: getRevealedText(vocab.word),
      fullWord: vocab.word.trim().toLowerCase(),
      state: 'active'
    };
    wordsRef.current.push(fw);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'playing') return;
    
    if (e.key === "Escape") {
      setGameState('paused');
      return;
    }

    if (e.key === "Backspace") {
      typedTextRef.current = typedTextRef.current.slice(0, -1);
      setTypedText(typedTextRef.current);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      typedTextRef.current = "";
      setTypedText("");
      return;
    }

    if (e.key.length === 1 && e.key.match(/[a-zA-Z0-9 -]/)) {
      const next = (typedTextRef.current + e.key).toLowerCase();
      
      // Find matching active word (lowest Y that starts with next)
      let matchedIndex = -1;
      let lowestY = -1000;
      
      for (let i = 0; i < wordsRef.current.length; i++) {
        const fw = wordsRef.current[i];
        if (fw.state === 'active' && fw.fullWord.startsWith(next)) {
          if (fw.y > lowestY) {
            lowestY = fw.y;
            matchedIndex = i;
          }
        }
      }
      
      if (matchedIndex !== -1) {
        const fw = wordsRef.current[matchedIndex];
        
        // Shoot bullet
        const canvas = canvasRef.current;
        if (canvas) {
          const startX = canvas.width / 2;
          const startY = canvas.height - 30; // from the cannon barrel
          const dx = fw.x - startX;
          const dy = fw.y - startY;
          const dist = Math.sqrt(dx*dx + dy*dy) || 1;
          const speed = 15;
          
          bulletsRef.current.push({
            x: startX,
            y: startY,
            vx: (dx / dist) * speed,
            vy: (dy / dist) * speed,
            targetId: fw.id,
            active: true
          });
          
          targetCannonAngleRef.current = Math.atan2(dy, dx) + Math.PI / 2;
        }

        if (fw.fullWord === next) {
          // Word fully matched!
          fw.state = 'dying';
          fw.explosionTimer = 30; // frames
          createExplosion(fw.x, fw.y, '#10b981'); // green
          setScore(s => s + 10);
          typedTextRef.current = "";
          setTypedText("");
          return;
        }
        
        typedTextRef.current = next;
        setTypedText(next);
        return;
      }
      
      // If it doesn't match any active word, clear the typed text completely 
      // so the user doesn't get stuck and have to backspace.
      typedTextRef.current = "";
      setTypedText("");
    }
  }, [gameState]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const updateAndDraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = canvas.parentElement;
    if (container) {
      if (canvas.width !== container.clientWidth || canvas.height !== container.clientHeight) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    }

    const { width, height } = canvas;

    // Clear background
    ctx.fillStyle = '#0f172a'; // dark slate 900
    ctx.fillRect(0, 0, width, height);

    // Draw Rain
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    rainRef.current.forEach(drop => {
      drop.y += drop.vy;
      if (drop.y > height) {
        drop.y = -drop.length;
        drop.x = Math.random() * width;
      }
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x, drop.y + drop.length);
    });
    ctx.stroke();

    if (gameState === 'playing') {
      const now = Date.now();
      const spawnRate = difficulty === 'easy' ? 4500 : 2500;
      if (now - lastSpawnTime.current > spawnRate) {
        spawnWord(width);
        lastSpawnTime.current = now;
      }

      if (wordsRef.current.length === 0 && wordsQueue.current.length === 0) {
        setGameState('gameover');
      }
    }

    // Update and Draw Words
    for (let i = wordsRef.current.length - 1; i >= 0; i--) {
      const fw = wordsRef.current[i];
      if (gameState === 'playing') {
        if (fw.state === 'active') {
          fw.y += fw.vy;
          if (fw.y > height - 50) {
            setLives(l => {
              const newLives = l - 1;
              if (newLives <= 0) setGameState('gameover');
              return newLives;
            });
            createExplosion(fw.x, height - 50, '#ef4444'); // red
            
            // If the user was typing this word, clear their input so they aren't stuck
            if (typedTextRef.current.length > 0 && fw.fullWord.startsWith(typedTextRef.current)) {
              typedTextRef.current = "";
              setTypedText("");
            }
            
            wordsRef.current.splice(i, 1);
            continue;
          }
        } else if (fw.state === 'dying') {
          if (fw.explosionTimer) {
            fw.explosionTimer--;
            if (fw.explosionTimer <= 0) {
              fw.state = 'dead';
              wordsRef.current.splice(i, 1);
              continue;
            }
          }
        }
      }

      ctx.save();
      ctx.translate(fw.x, fw.y);
      
      if (fw.state === 'dying') {
        ctx.globalAlpha = (fw.explosionTimer || 30) / 30;
        ctx.scale(1.2, 1.2);
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(fw.fullWord.toUpperCase(), 0, 0);
      } else {
        const pad = 12;
        ctx.font = '16px sans-serif';
        const defWidth = ctx.measureText(fw.vocab.definition).width;
        ctx.font = 'bold 20px monospace';
        const wordWidth = ctx.measureText(fw.revealedText).width;
        const boxW = Math.max(defWidth, wordWidth) + pad * 2;
        const boxH = 60;
        
        ctx.fillStyle = 'rgba(30, 41, 59, 0.9)'; 
        ctx.strokeStyle = '#3b82f6'; 
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-boxW/2, -boxH/2, boxW, boxH, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(fw.vocab.definition, 0, -10);

        ctx.font = 'bold 20px monospace';
        
        ctx.fillStyle = (typedText && fw.fullWord.startsWith(typedText)) ? "#10b981" : "#fbbf24";
        ctx.fillText(fw.revealedText, 0, 15);
      }
      ctx.restore();
    }

    // Draw Bullets
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ffffff';
    for (let i = bulletsRef.current.length - 1; i >= 0; i--) {
      const b = bulletsRef.current[i];
      if (gameState === 'playing') {
        b.x += b.vx;
        b.y += b.vy;
      }
      
      ctx.beginPath();
      ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
      ctx.fill();

      if (b.y < 0 || b.x < 0 || b.x > width) {
        bulletsRef.current.splice(i, 1);
      }
    }
    ctx.shadowBlur = 0;

    // Draw Particles
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      if (gameState === 'playing') {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life > p.maxLife) {
          particlesRef.current.splice(i, 1);
          continue;
        }
      }
      ctx.globalAlpha = 1 - (p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Draw Neon Cannon & Baseline
    ctx.fillStyle = '#0ea5e9'; // sky 500
    ctx.fillRect(0, height - 10, width, 10); 
    
    ctx.shadowColor = '#0ea5e9';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, height - 12, width, 2);
    ctx.shadowBlur = 0;

    const shooterX = width / 2;
    const shooterY = height - 10;

    // Smoothly interpolate angle
    if (gameState === 'playing') {
      cannonAngleRef.current += (targetCannonAngleRef.current - cannonAngleRef.current) * 0.1;
    }

    ctx.save();
    ctx.translate(shooterX, shooterY - 10);
    
    // Draw Base
    ctx.shadowColor = '#0ea5e9';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI, true);
    ctx.fill();
    ctx.stroke();
    
    // Draw Barrel
    ctx.rotate(cannonAngleRef.current);
    
    const barrelGrad = ctx.createLinearGradient(-12, 0, 12, 0);
    barrelGrad.addColorStop(0, '#0284c7');
    barrelGrad.addColorStop(0.5, '#38bdf8');
    barrelGrad.addColorStop(1, '#0284c7');
    
    ctx.fillStyle = barrelGrad;
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.roundRect(-12, -45, 24, 45, 4); 
    ctx.fill();
    ctx.stroke();
    
    // Neon lines on barrel
    ctx.beginPath();
    ctx.moveTo(-4, -10);
    ctx.lineTo(-4, -30);
    ctx.moveTo(4, -10);
    ctx.lineTo(4, -30);
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.restore();

    // Bottom set tag
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.beginPath();
    ctx.roundRect(shooterX - 100, height - 25, 200, 20, 10);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(testTitle, shooterX, height - 15);

    if (gameState === 'playing' || gameState === 'paused') {
      animationRef.current = requestAnimationFrame(updateAndDraw);
    }
  }, [gameState, difficulty, testTitle, typedText]);

  useEffect(() => {
    if (gameState === 'playing' || gameState === 'paused') {
      animationRef.current = requestAnimationFrame(updateAndDraw);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameState, updateAndDraw]);

  // Determine if current typed text is an error (doesn't match any active word)
  const isError = typedText.length > 0 && wordsRef.current.every(fw => fw.state !== 'active' || !fw.fullWord.startsWith(typedText));

  return (
    <div className="relative w-full h-[600px] bg-slate-900 rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl flex flex-col">
      {gameState === 'menu' && (
        <div className="absolute inset-0 z-20 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-600 text-center max-w-sm w-full">
            <h2 className="text-3xl font-bold text-white mb-2">Mưa Từ Vựng</h2>
            <p className="text-slate-400 mb-8">Đọc nghĩa đang rơi, nhớ ra từ tiếng Anh và gõ để bắn hạ</p>
            <div className="space-y-4">
              <button 
                onClick={() => startGame('easy')}
                className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-lg transition-colors"
              >
                Dễ (Chậm)
              </button>
              <button 
                onClick={() => startGame('hard')}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-lg transition-colors"
              >
                Khó (Nhanh)
              </button>
            </div>
            <button onClick={onBack} className="mt-6 text-slate-400 hover:text-white underline">
              Quay lại
            </button>
          </div>
        </div>
      )}

      {gameState === 'paused' && (
        <div className="absolute inset-0 z-20 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-600 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Tạm dừng</h2>
            <button 
              onClick={() => setGameState('playing')}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-colors"
            >
              Tiếp tục
            </button>
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="absolute inset-0 z-20 bg-slate-900/90 flex flex-col items-center justify-center">
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-600 text-center">
            <h2 className="text-4xl font-bold text-white mb-2">Game Over</h2>
            <p className="text-xl text-slate-300 mb-6">Điểm của bạn: <span className="text-yellow-400 font-bold">{score}</span></p>
            <div className="flex gap-4">
              <button 
                onClick={() => setGameState('menu')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors"
              >
                Chơi lại
              </button>
              <button 
                onClick={onBack}
                className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-xl font-bold transition-colors"
              >
                Thoát
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top HUD */}
      {(gameState === 'playing' || gameState === 'paused') && (
        <>
          <div className="absolute top-4 left-4 z-10 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-600 flex items-center gap-2 shadow-lg">
            <span className="text-yellow-400">🏆</span>
            <span className="text-white font-bold">{score}</span>
          </div>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-600 flex items-center gap-2 shadow-lg">
            <span className="text-green-400">🚩</span>
            <span className="text-white font-medium text-sm">{testTitle}</span>
          </div>
          <div className="absolute top-4 right-16 z-10 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-xl transition-all ${i < lives ? 'text-red-500 scale-100' : 'text-slate-600 scale-90 opacity-50'}`}>
                ❤️
              </span>
            ))}
          </div>
          
          {/* Controls */}
          <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10 flex flex-col gap-3">
            <button 
              onClick={() => setGameState('paused')}
              className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-600 flex items-center justify-center text-white shadow-lg transition-colors"
            >
              ⏸️
            </button>
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-600 flex items-center justify-center text-white shadow-lg transition-colors"
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>

          {/* Typing Indicator */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 text-center">
            <div className={`h-10 text-2xl font-mono font-bold tracking-widest bg-slate-800/80 px-6 py-1 rounded-xl border flex items-center justify-center shadow-lg transition-colors ${isError ? 'border-red-500 text-red-400' : 'border-slate-600 text-white'}`}>
              {typedText}
              <span className="animate-pulse ml-1 text-slate-400">_</span>
            </div>
          </div>
        </>
      )}

      <canvas 
        ref={canvasRef} 
        className="w-full h-full block z-0"
      />
    </div>
  );
};
export default WordRainGame;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VocabItem } from '../types';

interface BubbleGameProps {
  vocabData: VocabItem[];
  onFinish?: (correct: number, wrong: number) => void;
  onBack: () => void;
}

type Difficulty = 'easy' | 'hard';
type GameMode = 'word-meaning' | 'meaning-word';

interface Block {
  id: number;
  text: string;
  isCorrect: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  opacity: number;
  state: 'active' | 'dying' | 'dead';
  color: string;
}

interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
  targetId?: number;
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

export const BubbleGame: React.FC<BubbleGameProps> = ({ vocabData, onFinish, onBack }) => {
  // UI State
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('word-meaning');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lives, setLives] = useState(5);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [shuffledVocabData, setShuffledVocabData] = useState<VocabItem[]>([]);

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  
  // Game State Refs
  const blocksRef = useRef<Block[]>([]);
  const projectileRef = useRef<Projectile>({ x: 0, y: 0, vx: 0, vy: 0, active: false });
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<{x: number, y: number, size: number, alpha: number}[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastShotTimeRef = useRef<number>(0);
  
  const soundEnabledRef = useRef(soundEnabled);
  const livesRef = useRef(5);
  const scoreRef = useRef(0);
  const currentIndexRef = useRef(0);
  const gameOverRef = useRef(false);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const playSound = (type: 'shoot' | 'explosion' | 'correct' | 'wrong') => {
    if (!soundEnabledRef.current) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'shoot') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'explosion') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {
      console.warn("AudioContext not supported", e);
    }
  };

  const wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    const lines = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line.trim());
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());
    
    const startY = y - ((lines.length - 1) * lineHeight) / 2;
    for (let i = 0; i < lines.length; i++) {
      context.fillText(lines[i], x, startY + (i * lineHeight));
    }
  };

  const spawnBlocks = useCallback(() => {
    if (shuffledVocabData.length === 0 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    
    if (currentIndexRef.current >= shuffledVocabData.length) {
      setGameOver(true);
      gameOverRef.current = true;
      if (onFinish) onFinish(scoreRef.current, 5 - livesRef.current);
      return;
    }
    
    const targetWord = shuffledVocabData[currentIndexRef.current];
    const blockCount = 4;
    const speedMultiplier = difficulty === 'hard' ? 2 : 1.2;
    
    const distractors = vocabData.filter(v => v.word !== targetWord.word);
    const shuffledDistractors = [...distractors].sort(() => Math.random() - 0.5);
    
    const newBlocks: Block[] = [];
    const blockWidth = 180;
    const blockHeight = 80;
    const neonColors = ['#06b6d4', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e'];
    
    for (let i = 0; i < blockCount; i++) {
      const isCorrect = i === 0;
      const distractor = distractors.length > 0 
        ? shuffledDistractors[(i - 1 + distractors.length) % distractors.length] 
        : { word: 'Random', definition: 'Random definition' };
        
      const text = isCorrect 
        ? (gameMode === 'word-meaning' ? targetWord.definition : targetWord.word)
        : (gameMode === 'word-meaning' ? distractor.definition : distractor.word);
        
      const x = Math.random() * (canvas.width - blockWidth);
      const y = 150 + Math.random() * (canvas.height * 0.45 - blockHeight); // safely below target word
      const vx = (Math.random() - 0.5) * 2 * speedMultiplier;
      const vy = (Math.random() - 0.5) * 2 * speedMultiplier;
      
      newBlocks.push({
        id: i,
        text,
        isCorrect,
        x,
        y,
        vx,
        vy,
        width: blockWidth,
        height: blockHeight,
        opacity: 1,
        state: 'active',
        color: neonColors[i % neonColors.length]
      });
    }
    
    blocksRef.current = newBlocks.sort(() => Math.random() - 0.5);
  }, [shuffledVocabData, difficulty, gameMode, vocabData, onFinish]);

  // Main Game Loop
  const updateGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameOverRef.current) return;
    
    const parent = canvas.parentElement;
    if (parent) {
      if (canvas.width !== parent.clientWidth) canvas.width = parent.clientWidth;
      if (canvas.height !== parent.clientHeight) canvas.height = parent.clientHeight;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Initialize stars if empty
    if (starsRef.current.length === 0) {
      for (let i = 0; i < 150; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          alpha: Math.random()
        });
      }
    }

    // Draw Stars
    ctx.save();
    starsRef.current.forEach(star => {
      // twinkle effect
      star.alpha += (Math.random() - 0.5) * 0.1;
      if (star.alpha > 1) star.alpha = 1;
      if (star.alpha < 0.1) star.alpha = 0.1;

      // slow movement downwards
      star.y += star.size * 0.2;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }

      ctx.globalAlpha = star.alpha;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
    
    const cannonX = canvas.width / 2;
    const cannonY = canvas.height - 20;

    // Draw Blocks
    blocksRef.current.forEach(block => {
      if (block.state === 'dead') return;
      
      // Movement
      if (block.state === 'active') {
        block.x += block.vx;
        block.y += block.vy;
        
        // Bounce against walls
        if (block.x <= 0) {
            block.x = 0;
            block.vx *= -1;
        } else if (block.x + block.width >= canvas.width) {
            block.x = canvas.width - block.width;
            block.vx *= -1;
        }
        
        if (block.y <= 130) {
            block.y = 130;
            block.vy *= -1;
        } else if (block.y + block.height >= canvas.height - 100) {
            block.y = canvas.height - 100 - block.height;
            block.vy *= -1;
        }

        // Bounce against other active blocks
        for (const other of blocksRef.current) {
          if (other.id > block.id && other.state === 'active') {
            if (
              block.x < other.x + other.width &&
              block.x + block.width > other.x &&
              block.y < other.y + other.height &&
              block.y + block.height > other.y
            ) {
              // Swap velocities for a simple elastic collision (equal mass)
              const tempVx = block.vx;
              const tempVy = block.vy;
              block.vx = other.vx;
              block.vy = other.vy;
              other.vx = tempVx;
              other.vy = tempVy;

              // Move them apart slightly to prevent sticking
              const overlapX = (block.width + other.width) / 2 - Math.abs((block.x + block.width / 2) - (other.x + other.width / 2));
              const overlapY = (block.height + other.height) / 2 - Math.abs((block.y + block.height / 2) - (other.y + other.height / 2));
              
              if (overlapX > 0 && overlapY > 0) {
                if (overlapX < overlapY) {
                  const shift = overlapX / 2 + 1;
                  if (block.x < other.x) {
                    block.x -= shift;
                    other.x += shift;
                  } else {
                    block.x += shift;
                    other.x -= shift;
                  }
                } else {
                  const shift = overlapY / 2 + 1;
                  if (block.y < other.y) {
                    block.y -= shift;
                    other.y += shift;
                  } else {
                    block.y += shift;
                    other.y -= shift;
                  }
                }
              }
            }
          }
        }
      } else if (block.state === 'dying') {
        block.opacity -= 0.05;
        if (block.opacity <= 0) {
          block.state = 'dead';
          // Check if all active blocks are gone (this should happen after a hit)
          if (blocksRef.current.every(b => b.state === 'dead')) {
             currentIndexRef.current++;
             setCurrentIndex(currentIndexRef.current);
             spawnBlocks();
          }
        }
      }
      
      // Hover effect logic
      const isHovered = block.state === 'active' && 
                        mouseRef.current.x >= block.x && mouseRef.current.x <= block.x + block.width &&
                        mouseRef.current.y >= block.y && mouseRef.current.y <= block.y + block.height;
      
      const drawWidth = isHovered ? block.width + 10 : block.width;
      const drawHeight = isHovered ? block.height + 10 : block.height;
      const drawX = isHovered ? block.x - 5 : block.x;
      const drawY = isHovered ? block.y - 5 : block.y;

      // Draw Block
      ctx.save();
      ctx.globalAlpha = block.opacity;
      ctx.beginPath();
      ctx.roundRect(drawX, drawY, drawWidth, drawHeight, 20);
      ctx.fillStyle = '#0f172a'; // slate-900
      ctx.fill();
      
      ctx.lineWidth = isHovered ? 4 : 2;
      ctx.strokeStyle = block.state === 'dying' ? (block.isCorrect ? '#22c55e' : '#ef4444') : block.color; 
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = block.state === 'dying' ? 20 : (isHovered ? 25 : 10);
      ctx.stroke();
      
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#f8fafc'; // slate-50
      ctx.font = isHovered ? 'bold 16px system-ui, sans-serif' : 'bold 15px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      wrapText(ctx, block.text, drawX + drawWidth / 2, drawY + drawHeight / 2, drawWidth - 20, 18);
      
      ctx.restore();
    });
    
    // Update & Draw Projectile
    const proj = projectileRef.current;
    if (proj.active) {
      if (proj.targetId !== undefined && proj.targetId !== -1) {
        const targetBlock = blocksRef.current.find(b => b.id === proj.targetId && b.state === 'active');
        if (targetBlock) {
          const targetX = targetBlock.x + targetBlock.width / 2;
          const targetY = targetBlock.y + targetBlock.height / 2;
          const dx = targetX - proj.x;
          const dy = targetY - proj.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist > 0) {
             const speed = 15;
             proj.vx = (dx / dist) * speed;
             proj.vy = (dy / dist) * speed;
          }
        }
      }
      
      proj.x += proj.vx;
      proj.y += proj.vy;
      
      // Check collision
      for (const block of blocksRef.current) {
        if (block.state === 'active' && (proj.targetId === undefined || proj.targetId === block.id)) {
          if (proj.x > block.x && proj.x < block.x + block.width && 
              proj.y > block.y && proj.y < block.y + block.height) {
            
            proj.active = false;
            block.state = 'dying';
            playSound('explosion');
            
            // Generate particles
            for(let i=0; i<20; i++) {
               particlesRef.current.push({
                 x: proj.x, y: proj.y,
                 vx: (Math.random() - 0.5) * 10,
                 vy: (Math.random() - 0.5) * 10,
                 life: 1, maxLife: 1,
                 color: block.isCorrect ? '#22c55e' : '#ef4444'
               });
            }
            
            if (block.isCorrect) {
              playSound('correct');
              scoreRef.current++;
              setScore(scoreRef.current);
              // Kill all other blocks too
              blocksRef.current.forEach(b => {
                 if (b.state === 'active') b.state = 'dying';
              });
            } else {
              playSound('wrong');
              livesRef.current--;
              setLives(livesRef.current);
              
              if (livesRef.current <= 0) {
                 setGameOver(true);
                 gameOverRef.current = true;
                 if (onFinish) onFinish(scoreRef.current, 5);
              }
            }
            break;
          }
        }
      }
      
      // Off screen
      if (proj.y < 0 || proj.x < 0 || proj.x > canvas.width) {
        proj.active = false;
      }
      
      if (proj.active) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      }
    }
    
    // Draw Particles
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.05;
      
      if (p.life <= 0) {
        particlesRef.current.splice(i, 1);
      } else {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.restore();
      }
    }

    // Draw Aiming Laser
    const dx = mouseRef.current.x - cannonX;
    const dy = mouseRef.current.y - cannonY;
    const dist = Math.sqrt(dx*dx + dy*dy);
    
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([10, 10]);
    ctx.moveTo(cannonX, cannonY);
    ctx.lineTo(cannonX + (dx/dist) * 1000, cannonY + (dy/dist) * 1000);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    
    // Draw Cannon (Sci-Fi 3D)
    ctx.save();
    ctx.translate(cannonX, cannonY);
    const angle = Math.atan2(dy, dx);
    
    // Glowing base aura
    ctx.beginPath();
    ctx.arc(0, 0, 45, 0, Math.PI * 2);
    const baseGlow = ctx.createRadialGradient(0, 0, 15, 0, 0, 45);
    baseGlow.addColorStop(0, 'rgba(6, 182, 212, 0.6)');
    baseGlow.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = baseGlow;
    ctx.fill();

    // Base bottom plate
    ctx.beginPath();
    ctx.ellipse(0, 5, 30, 10, 0, 0, Math.PI * 2);
    const plateGrad = ctx.createLinearGradient(-30, 0, 30, 0);
    plateGrad.addColorStop(0, '#1e293b');
    plateGrad.addColorStop(0.5, '#475569');
    plateGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = plateGrad;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#06b6d4';
    ctx.stroke();

    // Base dome
    ctx.beginPath();
    ctx.arc(0, 0, 25, Math.PI, Math.PI * 2);
    ctx.lineTo(25, 5);
    ctx.ellipse(0, 5, 25, 8, 0, 0, Math.PI);
    ctx.lineTo(-25, 0);
    const domeGrad = ctx.createRadialGradient(0, -10, 5, 0, 0, 25);
    domeGrad.addColorStop(0, '#64748b');
    domeGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = domeGrad;
    ctx.fill();

    // Rotated barrel
    ctx.rotate(angle);
    
    // Barrel shadow
    ctx.beginPath();
    ctx.roundRect(15, -8, 55, 16, 4);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fill();
    
    // Main barrel body (layered for 3D)
    ctx.beginPath();
    ctx.roundRect(10, -12, 50, 24, 6);
    const barrelGrad = ctx.createLinearGradient(10, -12, 10, 12);
    barrelGrad.addColorStop(0, '#94a3b8');
    barrelGrad.addColorStop(0.3, '#f8fafc');
    barrelGrad.addColorStop(0.5, '#475569');
    barrelGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = barrelGrad;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#0284c7';
    ctx.stroke();
    
    // Energy core inside barrel
    ctx.beginPath();
    ctx.roundRect(20, -4, 35, 8, 2);
    ctx.fillStyle = '#22d3ee';
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Barrel front tip
    ctx.beginPath();
    ctx.roundRect(55, -15, 12, 30, 4);
    const tipGrad = ctx.createLinearGradient(55, -15, 55, 15);
    tipGrad.addColorStop(0, '#cbd5e1');
    tipGrad.addColorStop(1, '#334155');
    ctx.fillStyle = tipGrad;
    ctx.fill();
    ctx.strokeStyle = '#06b6d4';
    ctx.stroke();

    // Outer barrel rings
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(25, -14, 6, 28);
    ctx.fillRect(40, -14, 6, 28);
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(27, -14, 2, 28);
    ctx.fillRect(42, -14, 2, 28);

    ctx.restore();
    
    // Cooldown indicator on cannon base
    const now = Date.now();
    const cooldownRatio = Math.min(1, (now - lastShotTimeRef.current) / 500);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cannonX, cannonY, 32, -Math.PI/2, -Math.PI/2 + (Math.PI * 2 * cooldownRatio));
    ctx.strokeStyle = cooldownRatio === 1 ? '#22c55e' : '#ef4444';
    ctx.lineWidth = 4;
    ctx.shadowColor = cooldownRatio === 1 ? '#22c55e' : '#ef4444';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.restore();

    requestRef.current = requestAnimationFrame(updateGame);
  }, [spawnBlocks, onFinish]);

  useEffect(() => {
    if (difficulty && !gameOver && canvasRef.current) {
      // Resize canvas to fit container
      const parent = canvasRef.current.parentElement;
      if (parent) {
         canvasRef.current.width = parent.clientWidth;
         canvasRef.current.height = parent.clientHeight;
      }
      requestRef.current = requestAnimationFrame(updateGame);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [difficulty, gameOver, updateGame]);

  const handleStartGame = (diff: Difficulty) => {
    setShuffledVocabData([...vocabData].sort(() => Math.random() - 0.5));
    setDifficulty(diff);
    setLives(5);
    setScore(0);
    setGameOver(false);
    livesRef.current = 5;
    scoreRef.current = 0;
    currentIndexRef.current = 0;
    gameOverRef.current = false;
    blocksRef.current = [];
    projectileRef.current = { x: 0, y: 0, vx: 0, vy: 0, active: false };
    particlesRef.current = [];
  };

  useEffect(() => {
    if (difficulty && !gameOver && shuffledVocabData.length > 0) {
      spawnBlocks();
    }
  }, [difficulty, shuffledVocabData, spawnBlocks, gameOver]);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    handlePointerMove(e);
    
    const now = Date.now();
    if (now - lastShotTimeRef.current < 500) return; // Cooldown
    if (projectileRef.current.active) return; // Only 1 bullet
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const cannonX = canvas.width / 2;
    const cannonY = canvas.height - 20;
    
    const dx = mouseRef.current.x - cannonX;
    const dy = mouseRef.current.y - cannonY;
    const dist = Math.sqrt(dx*dx + dy*dy);
    
    if (dist === 0) return;
    
    let targetId: number | undefined = undefined;
    for (let i = blocksRef.current.length - 1; i >= 0; i--) {
      const block = blocksRef.current[i];
      if (block.state === 'active' && 
          mouseRef.current.x >= block.x && mouseRef.current.x <= block.x + block.width &&
          mouseRef.current.y >= block.y && mouseRef.current.y <= block.y + block.height) {
        targetId = block.id;
        break;
      }
    }

    // If they clicked empty space, let's say targetId = -1 so it doesn't hit any block.
    if (targetId === undefined) targetId = -1;
    
    const speed = 15;
    projectileRef.current = {
      x: cannonX,
      y: cannonY,
      vx: (dx / dist) * speed,
      vy: (dy / dist) * speed,
      active: true,
      targetId
    };
    
    lastShotTimeRef.current = now;
    playSound('shoot');
  };

  if (!difficulty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-900 rounded-xl shadow p-8 text-center max-w-3xl mx-auto border border-cyan-900">
        <h2 className="text-4xl font-black text-cyan-400 mb-6 tracking-wider" style={{ textShadow: '0 0 10px rgba(34,211,238,0.5)' }}>WORD BLAST</h2>
                
        <div className="mb-8 w-full bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-xl font-bold text-slate-300 mb-4">1. Select Mode</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setGameMode('word-meaning')}
              className={`px-6 py-3 rounded-xl font-bold text-lg transition-all flex-1 max-w-[200px] ${gameMode === 'word-meaning' ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(8,145,178,0.6)]' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            >
              Word → Meaning
            </button>
            <button 
              onClick={() => setGameMode('meaning-word')}
              className={`px-6 py-3 rounded-xl font-bold text-lg transition-all flex-1 max-w-[200px] ${gameMode === 'meaning-word' ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(8,145,178,0.6)]' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            >
              Meaning → Word
            </button>
          </div>
        </div>

        <div className="w-full bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-xl font-bold text-slate-300 mb-4">2. Select Difficulty to Start</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => handleStartGame('easy')}
              className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-lg shadow-[0_0_15px_rgba(22,163,74,0.4)] transition-all flex-1 max-w-[200px]"
            >
              Easy
            </button>
            <button 
              onClick={() => handleStartGame('hard')}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-lg shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all flex-1 max-w-[200px]"
            >
              Hard
            </button>
          </div>
        </div>
        <button onClick={onBack} className="mt-8 px-6 py-2 bg-slate-700 text-slate-300 font-bold rounded-lg hover:bg-slate-600 transition-colors border border-slate-600">
          Go Back
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-900 rounded-xl shadow p-8 border border-cyan-900">
        <h2 className="text-5xl font-black text-cyan-400 mb-4" style={{ textShadow: '0 0 15px rgba(34,211,238,0.6)' }}>GAME OVER</h2>
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl flex flex-col gap-4 w-full max-w-md text-center mb-8 shadow-xl">
          <p className="text-2xl text-slate-300">Final Score: <span className="font-bold text-cyan-400 text-4xl block mt-2">{score}</span></p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setDifficulty(null)}
            className="px-8 py-3 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-500 transition-all shadow-[0_0_15px_rgba(8,145,178,0.5)]"
          >
            Play Again
          </button>
          <button 
            onClick={onBack}
            className="px-8 py-3 bg-slate-700 text-slate-300 font-bold rounded-xl hover:bg-slate-600 transition-colors border border-slate-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentWord = shuffledVocabData[currentIndex];

  return (
    <div className="flex flex-col h-[75vh] min-h-[500px] rounded-xl overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-black shadow-2xl relative border border-cyan-900 select-none">
      
      {/* Header UI */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10 pointer-events-none">
        
        {/* Lives & Score */}
        <div className="flex flex-col gap-2">
           <div className="flex items-center gap-1 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-700 backdrop-blur-sm">
             {Array.from({ length: 5 }).map((_, i) => (
               <span key={i} className={`text-xl ${i < lives ? 'text-red-500' : 'text-slate-700'} drop-shadow-md`}>
                 {i < lives ? '❤️' : '🖤'}
               </span>
             ))}
           </div>
           <div className="bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-700 text-cyan-400 font-bold backdrop-blur-sm shadow-[0_0_10px_rgba(34,211,238,0.2)]">
             Score: {score}
           </div>
        </div>

        {/* Sound Toggle */}
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`pointer-events-auto px-4 py-2 rounded-full font-bold text-sm border backdrop-blur-sm transition-colors ${soundEnabled ? 'bg-cyan-900/50 text-cyan-300 border-cyan-700' : 'bg-slate-800/50 text-slate-400 border-slate-700'}`}
        >
          {soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF'}
        </button>

      </div>

      {/* Target Word */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none w-full max-w-md px-4">
        <div className="bg-slate-900/90 border border-cyan-800/50 p-4 rounded-2xl text-center backdrop-blur-md shadow-[0_0_20px_rgba(8,145,178,0.3)]">
          <h3 className="text-2xl sm:text-3xl font-black text-white drop-shadow-lg">
            {gameMode === 'word-meaning' ? currentWord?.word : currentWord?.definition || ''}
          </h3>
          <div className="text-cyan-400/80 font-bold text-xs mt-2 uppercase tracking-widest">
            TARGET
          </div>
        </div>
      </div>

      <div className="flex-1 w-full h-full relative cursor-crosshair touch-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
        />
      </div>
    </div>
  );
};

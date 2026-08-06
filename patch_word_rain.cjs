const fs = require('fs');
let code = fs.readFileSync('components/WordRainGame.tsx', 'utf8');

// 1. In handleKeyDown, allow Space/Enter to clear
code = code.replace(
`    if (e.key === "Backspace") {
      typedTextRef.current = typedTextRef.current.slice(0, -1);
      setTypedText(typedTextRef.current);
      return;
    }`,
`    if (e.key === "Backspace") {
      typedTextRef.current = typedTextRef.current.slice(0, -1);
      setTypedText(typedTextRef.current);
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      typedTextRef.current = "";
      setTypedText("");
      return;
    }`
);

// 2. In handleKeyDown, if no match, clear instead of appending, OR just don't append. 
// "biến mất ngay lập tức" -> clear it.
code = code.replace(
`      // Return next even if it's wrong, so the user has to backspace their typo
      typedTextRef.current = next;
      setTypedText(next);`,
`      // If it doesn't match any active word, clear the typed text completely 
      // so the user doesn't get stuck and have to backspace.
      typedTextRef.current = "";
      setTypedText("");`
);

// 3. When a word dies (hits the bottom), if it matches the current typed text, clear the typed text
code = code.replace(
`          if (fw.y > height - 50) {
            setLives(l => {
              const newLives = l - 1;
              if (newLives <= 0) setGameState('gameover');
              return newLives;
            });
            createExplosion(fw.x, height - 50, '#ef4444'); // red
            wordsRef.current.splice(i, 1);
            continue;
          }`,
`          if (fw.y > height - 50) {
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
          }`
);

fs.writeFileSync('components/WordRainGame.tsx', code);

const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

if (!code.includes('onBack={() => setAppState(AppState.ReadingHub)}')) {
    code = code.replace(
        "onStartRandomTest={handleStartGrammarRandomTest} \n                    />",
        "onStartRandomTest={handleStartGrammarRandomTest} \n                        onBack={() => setAppState(AppState.ReadingHub)}\n                    />"
    );
    fs.writeFileSync('App.tsx', code);
}

const fs = require('fs');
let code = fs.readFileSync('components/GrammarScreen.tsx', 'utf8');

if (!code.includes('onBack?: () => void;')) {
    code = code.replace(
        "    onStartRandomTest?: (testData: TestData) => void;\n}",
        "    onStartRandomTest?: (testData: TestData) => void;\n    onBack?: () => void;\n}"
    );
    
    code = code.replace(
        "const GrammarScreen: React.FC<GrammarScreenProps> = ({ currentUser, onSelectTopic }) => {",
        "const GrammarScreen: React.FC<GrammarScreenProps> = ({ currentUser, onSelectTopic, onBack }) => {"
    );
    
    code = code.replace(
        "                </div>            </div>        </div>",
        "                </div>\n                {onBack && (\n                    <div className=\"mt-8 text-center\">\n                        <button onClick={onBack} className=\"text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 underline\">\n                            Quay lại\n                        </button>\n                    </div>\n                )}\n            </div>        </div>"
    );
    fs.writeFileSync('components/GrammarScreen.tsx', code);
}

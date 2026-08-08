const fs = require('fs');
let code = fs.readFileSync('components/TestScreen.tsx', 'utf8');

code = code.replace(
    '            </div>\n          )}\n          </div>\n        </div>',
    '            </div>\n          )}\n        </div>'
);
fs.writeFileSync('components/TestScreen.tsx', code);

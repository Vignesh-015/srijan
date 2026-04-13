const fs = require('fs');
const path = require('path');

const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if(!content.includes('<script src="amazon.js"></script>')) {
        content = content.replace('</body>', '  <script src="amazon.js"></script>\n</body>');
        fs.writeFileSync(file, content);
        console.log('Updated ' + file);
    }
});

let scriptContent = fs.readFileSync('script.js', 'utf8');
if(!scriptContent.includes('saveOrderToHistory')) {
    scriptContent = scriptContent.replace(
        `               cart = {};`,
        `               if(typeof saveOrderToHistory === 'function') {
                   saveOrderToHistory(cart, finalTotal);
               }
               cart = {};`
    );
    fs.writeFileSync('script.js', scriptContent);
    console.log('Updated script.js');
}

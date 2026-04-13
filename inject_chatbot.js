const fs = require('fs');
const path = require('path');

const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if(!content.includes('<script src="cara_chatbot.js"></script>')) {
        content = content.replace('</body>', '  <script src="cara_chatbot.js"></script>\n</body>');
        fs.writeFileSync(file, content);
        console.log('Updated ' + file + ' with chatbot widget');
    }
});

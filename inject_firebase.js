const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const firebaseScripts = `
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-database-compat.js"></script>
`;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('firebase-app-compat.js')) {
        content = content.replace('<script src="amazon.js"></script>', firebaseScripts + '\n  <script src="amazon.js"></script>');
        fs.writeFileSync(file, content);
        console.log('Firebase injected into ' + file);
    }
});

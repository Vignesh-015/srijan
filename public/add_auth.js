const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf-8');
    if(!content.includes('firebase-auth-compat.js')) {
        content = content.replace(
            '<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-database-compat.js"></script>',
            '<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-database-compat.js"></script>\n  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js"></script>'
        );
        fs.writeFileSync(f, content);
    }
});
console.log('Done injecting auth script');

const fs = require('fs');
const files = ['account.html', 'wishlist.html', 'order.html', 'seller.html', 'amazon.js'];

files.forEach(file => {
    if(fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        // We need to replace "\${" with "${" 
        // We need to replace "\`" with "`"
        content = content.replace(/\\\$\\{/g, '${');
        content = content.replace(/\\\`/g, '`');
        fs.writeFileSync(file, content);
        console.log('Fixed syntax in ' + file);
    }
});

const fs = require('fs');

// Read the file
const filePath = '/Users/nathanbrisset/Desktop/data_final_no_duplicate_urls.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace duplicate isPremium properties
content = content.replace(/isPremium: 'Free',\s+isPremium: 'Free',/g, "isPremium: 'Free',");

// Write the cleaned content back to a new file
fs.writeFileSync('/Users/nathanbrisset/Desktop/data_final_cleaned.tsx', content); 
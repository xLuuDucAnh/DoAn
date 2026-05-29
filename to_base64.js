const fs = require('fs');
const path = 'C:\Users\azbab\Downloads\Documents\png-clipart-male-model-s-man-wearing-black-button-up-jacket-removebg-preview.png';

try {
    const data = fs.readFileSync(path);
    const base64 = data.toString('base64');
    console.log('BASE64_START');
    console.log(base64);
    console.log('BASE64_END');
} catch (err) {
    console.error(err.message);
}

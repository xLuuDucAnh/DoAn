const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\azbab\\.gemini\\antigravity\\brain\\3decad2a-039a-436b-9e3c-6fd15f630b0e';
const destDir = 'c:\\Users\\azbab\\Downloads\\Compressed\\223508_lebabafullstackecommerceprojectmain_1\\ClothesWeb\\frontend\\src\\assets';

const files = [
    { src: 'mens_fashion_banner_1780035580969.png', dest: 'mens_banner.png' },
    { src: 'mens_shirt_cat_1780035735329.png', dest: 'mens_shirt_cat.png' },
    { src: 'mens_jeans_cat_1780035750401.png', dest: 'mens_jeans_cat.png' },
    { src: 'mens_shoes_cat_1780035767464.png', dest: 'mens_shoes_cat.png' },
    { src: 'mens_accessories_cat_1780035955487.png', dest: 'mens_accessories_cat.png' }
];

files.forEach(file => {
    const srcPath = path.join(srcDir, file.src);
    const destPath = path.join(destDir, file.dest);
    try {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${file.src} to ${file.dest}`);
    } catch (err) {
        console.error(`Error copying ${file.src}:`, err.message);
    }
});

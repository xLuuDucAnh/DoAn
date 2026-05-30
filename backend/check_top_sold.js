const mongoose = require('mongoose');
const Products = require('./src/products/products.model');
require('dotenv').config();

async function checkTopSold() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const topProducts = await Products.find({}).sort({ totalSold: -1 }).limit(5);
        console.log('Top 5 Sold Products:');
        topProducts.forEach(p => {
            console.log(`${p.name}: ${p.totalSold}`);
        });
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkTopSold();

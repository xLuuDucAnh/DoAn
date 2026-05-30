const mongoose = require('mongoose');
const Order = require('./src/orders/orders.model');
const Products = require('./src/products/products.model');
require('dotenv').config();

async function initializeSoldCounts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const products = await Products.find({});
        console.log(`Found ${products.length} products`);

        for (const product of products) {
            const soldCount = await Order.aggregate([
                { $unwind: "$products" },
                {
                    $match: {
                        "products.productId": product._id.toString()
                    }
                },
                { $group: { _id: null, totalSold: { $sum: "$products.quantity" } } }
            ]);

            const totalSold = soldCount.length > 0 ? soldCount[0].totalSold : 0;
            
            product.totalSold = totalSold;
            await product.save();
            console.log(`Updated product ${product.name}: totalSold = ${totalSold}`);
        }

        console.log('Finished updating sold counts');
        process.exit(0);
    } catch (error) {
        console.error('Error during initialization:', error);
        process.exit(1);
    }
}

initializeSoldCounts();

const express = require("express");
const Order = require("./orders.model");
const Products = require("../products/products.model");
const router = express.Router();
const crypto = require("crypto");
const https = require("https");

// Create MoMo Payment
router.post("/create-momo-payment", async (req, res) => {
  const { amount, orderId, orderInfo, products, email } = req.body;
  const partnerCode = process.env.MOMO_PARTNER_CODE;
  const accessKey = process.env.MOMO_ACCESS_KEY;
  const secretKey = process.env.MOMO_SECRET_KEY;
  const redirectUrl = "http://localhost:5173/success";
  const ipnUrl = "http://localhost:5173/success";
  const requestType = "captureWallet";
  const requestId = orderId;
  const extraData = "";

  try {
    // Signature for AIO v2 Create endpoint (Alphabetical order)
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature,
      lang: "vi",
    });

    const options = {
      hostname: "test-payment.momo.vn",
      port: 443,
      path: "/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    };

    // Save order as pending before redirecting to MoMo
    const newOrder = new Order({
        orderId,
        products,
        amount,
        email,
        status: "pending"
    });
    await newOrder.save();

    // Deduct stock immediately when user initiates payment
    for (const item of products) {
      await Products.updateOne(
        { _id: item.productId },
        { $inc: { stock: -item.quantity, totalSold: item.quantity } }
      );
    }

    const momoReq = https.request(options, (momoRes) => {
      let data = "";
      momoRes.on("data", (chunk) => {
        data += chunk;
      });
      momoRes.on("end", () => {
        try {
          const responseData = JSON.parse(data);
          res.status(200).json(responseData);
        } catch (e) {
          res.status(500).json({ error: "Invalid response from MoMo", raw: data });
        }
      });
    });

    momoReq.on("error", (error) => {
      console.error("MoMo Error:", error);
      res.status(500).json({ error: "Failed to create MoMo payment" });
    });

    momoReq.write(requestBody);
    momoReq.end();
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Confirm Payment and update order status
router.post("/confirm-payment", async (req, res) => {
    const { orderId } = req.body;
  
    try {
      const order = await Order.findOne({ orderId });
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }


  
      order.status = "processing"; // Update status to processing after success
      await order.save();
  
      res.status(200).json({ message: "Payment confirmed and order updated", order });
    } catch (error) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

router.get("/:email", async (req, res) => {
  const email = req.params.email;

  if (!email) {
    return res.status(400).json({ message: "Email parameter is required" });
  }
 

  try {
    const orders = await Order.find({ email: email }).sort({ createdAt: -1 });
    if (orders.length === 0 || !orders) {
      return res
        .status(200) // Changed from 404 to 200 as it's a valid data request resulting in empty array
        .json([]);
    }
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/order/:id", async (req, res) => {
  // console.log(req.params.id);
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// get all orders 
router.get('/', async (req, res) => {

  try {
    const orders = await Order.find().sort({createdAt: -1});
    if (orders.length === 0) {
      console.log('No orders found');
      return res.status(200).json([]);
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// update order status
router.patch('/update-order-status/:id', async (req, res) => {
  try {
      const { id } = req.params;
      // console.log(id);
      const { status } = req.body;

      // console.log(status)

      if (!status) {
          return res.status(400).json({ message: "Order status is required" });
      }

      const updatedOrder = await Order.findByIdAndUpdate(
          id,
          { status, updatedAt: Date.now() },
          { new: true, runValidators: true }
      );

      if (!updatedOrder) {
          return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({
          message: "Order status updated successfully",
          order: updatedOrder
      });
  } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Server error" });
  }
});

// delete order
router.delete('/delete-order/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order deleted successfully",
      order: deletedOrder
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;

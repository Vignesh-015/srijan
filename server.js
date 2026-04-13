const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve static HTML/CSS/JS frontend files efficiently from the same domain
app.use(express.static(path.join(__dirname, '.')));

// Initialize Razorpay Instance securely
const razorpay = new Razorpay({
  key_id: 'rzp_live_SOexkv1hAx5mJG',
  key_secret: '8ueN9x1ot6Y1VxRagwQHaOgi'
});

// API endpoint to create a secure order ID 
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    
    if(!amount || amount < 100) {
      return res.status(400).json({ error: "Invalid amount. Must be at least 100 paise (1 INR)" });
    }

    const options = {
      amount: amount, // strictly in paise
      currency: "INR",
      receipt: `receipt_order_${Math.floor(Math.random() * 100000)}`
    };

    const order = await razorpay.orders.create(options);
    
    if(!order) return res.status(500).send("Some error occured");

    res.json(order);
  } catch (error) {
    console.error("Razorpay API Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start the core backend engine
app.listen(PORT, () => {
  console.log(`Backend Server Engine natively running on http://localhost:${PORT}`);
  console.log(`Please go strictly to => http://localhost:${PORT}/index.html in your browser!`);
});

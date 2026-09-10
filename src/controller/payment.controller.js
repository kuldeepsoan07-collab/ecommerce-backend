// Razorpay integration is currently disabled.
// COD / UPI / CARD order flow is handled through the order system.

// Create Payment Order
export const createPaymentOrder = async (req, res) => {
  return res.status(503).json({
    success: false,
    message: "Online payment is currently unavailable",
  });
};

// Verify Payment
export const verifyPayment = async (req, res) => {
  return res.status(503).json({
    success: false,
    message: "Online payment verification is currently unavailable",
  });
};
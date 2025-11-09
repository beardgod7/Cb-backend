const { v4: uuidv4 } = require("uuid");
const { getPaymentService } = require("./paymentService");
const {
  createPayment,
  getPaymentByReference,
  updatePaymentStatus,
  getPaymentsByUser,
  getAllPayments,
  getPaymentStats,
} = require("./repository");

// Initialize payment
exports.initializePayment = async (req, res) => {
  try {
    const {
      email,
      amount,
      bookingType,
      bookingId,
      gateway = "paystack",
      metadata = {},
    } = req.body;

    if (!email || !amount || !bookingType || !bookingId) {
      return res.status(400).json({
        message: "Email, amount, bookingType, and bookingId are required",
      });
    }

    const reference = `${bookingType.toUpperCase()}-${uuidv4()}`;
    const userId = req.userId || null;

    // Create payment record
    const payment = await createPayment({
      transactionReference: reference,
      paymentGateway: gateway,
      amount,
      bookingType,
      bookingId,
      userId,
      email,
      metadata,
    });

    // Initialize payment with gateway
    const paymentService = getPaymentService(gateway);
    const result = await paymentService.initializePayment(
      email,
      amount,
      reference,
      metadata
    );

    if (!result.success) {
      return res.status(400).json({
        message: result.message || "Payment initialization failed",
      });
    }

    res.status(200).json({
      message: "Payment initialized successfully",
      data: {
        reference,
        authorizationUrl: result.authorizationUrl,
        accessCode: result.accessCode,
      },
    });
  } catch (error) {
    console.error("Initialize payment error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const payment = await getPaymentByReference(reference);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Verify with gateway
    const paymentService = getPaymentService(payment.paymentGateway);
    const result = await paymentService.verifyPayment(reference);

    if (result.success) {
      await updatePaymentStatus(reference, "success", result.data);
      
      res.status(200).json({
        message: "Payment verified successfully",
        data: {
          reference,
          status: "success",
          amount: payment.amount,
          bookingType: payment.bookingType,
          bookingId: payment.bookingId,
        },
      });
    } else {
      await updatePaymentStatus(reference, "failed", result.data);
      
      res.status(400).json({
        message: "Payment verification failed",
        data: { reference, status: "failed" },
      });
    }
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get user payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const payments = await getPaymentsByUser(userId);
    
    res.status(200).json({
      message: "Payment history retrieved successfully",
      data: payments,
    });
  } catch (error) {
    console.error("Get payment history error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all transactions (Admin)
exports.getAllTransactions = async (req, res) => {
  try {
    const payments = await getAllPayments();
    
    res.status(200).json({
      message: "Transactions retrieved successfully",
      data: payments,
    });
  } catch (error) {
    console.error("Get all transactions error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get payment statistics (Admin)
exports.getPaymentStatistics = async (req, res) => {
  try {
    const stats = await getPaymentStats();
    
    res.status(200).json({
      message: "Payment statistics retrieved successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Get payment statistics error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Webhook handler for Paystack
exports.paystackWebhook = async (req, res) => {
  try {
    const event = req.body;

    if (event.event === "charge.success") {
      const reference = event.data.reference;
      await updatePaymentStatus(reference, "success", event.data);
    }

    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Paystack webhook error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Webhook handler for Flutterwave
exports.flutterwaveWebhook = async (req, res) => {
  try {
    const event = req.body;

    if (event.event === "charge.completed" && event.data.status === "successful") {
      const reference = event.data.tx_ref;
      await updatePaymentStatus(reference, "success", event.data);
    }

    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Flutterwave webhook error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Webhook handler for Stripe
exports.stripeWebhook = async (req, res) => {
  try {
    const event = req.body;

    if (event.type === "checkout.session.completed") {
      const reference = event.data.object.client_reference_id;
      await updatePaymentStatus(reference, "success", event.data.object);
    }

    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Stripe webhook error:", error);
    res.status(500).json({ message: error.message });
  }
};

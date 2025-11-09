const axios = require("axios");

/**
 * Paystack Payment Service
 */
class PaystackService {
  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY;
    this.baseUrl = "https://api.paystack.co";
  }

  async initializePayment(email, amount, reference, metadata = {}) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        {
          email,
          amount: amount * 100, // Convert to kobo
          reference,
          metadata,
          callback_url: process.env.PAYMENT_CALLBACK_URL,
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        success: true,
        authorizationUrl: response.data.data.authorization_url,
        accessCode: response.data.data.access_code,
        reference: response.data.data.reference,
      };
    } catch (error) {
      console.error("Paystack initialization error:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Payment initialization failed",
      };
    }
  }

  async verifyPayment(reference) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        }
      );

      return {
        success: response.data.data.status === "success",
        data: response.data.data,
      };
    } catch (error) {
      console.error("Paystack verification error:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Payment verification failed",
      };
    }
  }
}

/**
 * Flutterwave Payment Service
 */
class FlutterwaveService {
  constructor() {
    this.secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    this.baseUrl = "https://api.flutterwave.com/v3";
  }

  async initializePayment(email, amount, reference, metadata = {}) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/payments`,
        {
          tx_ref: reference,
          amount,
          currency: "NGN",
          redirect_url: process.env.PAYMENT_CALLBACK_URL,
          customer: {
            email,
          },
          customizations: {
            title: "CBAAC Payment",
            description: "Payment for booking",
          },
          meta: metadata,
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        success: true,
        authorizationUrl: response.data.data.link,
        reference: reference,
      };
    } catch (error) {
      console.error("Flutterwave initialization error:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Payment initialization failed",
      };
    }
  }

  async verifyPayment(transactionId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transactions/${transactionId}/verify`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        }
      );

      return {
        success: response.data.data.status === "successful",
        data: response.data.data,
      };
    } catch (error) {
      console.error("Flutterwave verification error:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Payment verification failed",
      };
    }
  }
}

/**
 * Stripe Payment Service
 */
class StripeService {
  constructor() {
    this.stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  }

  async initializePayment(email, amount, reference, metadata = {}) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "CBAAC Booking",
              },
              unit_amount: amount * 100, // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.PAYMENT_CALLBACK_URL}?reference=${reference}`,
        cancel_url: `${process.env.PAYMENT_CANCEL_URL}`,
        client_reference_id: reference,
        customer_email: email,
        metadata,
      });

      return {
        success: true,
        authorizationUrl: session.url,
        sessionId: session.id,
        reference,
      };
    } catch (error) {
      console.error("Stripe initialization error:", error.message);
      return {
        success: false,
        message: error.message || "Payment initialization failed",
      };
    }
  }

  async verifyPayment(sessionId) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);

      return {
        success: session.payment_status === "paid",
        data: session,
      };
    } catch (error) {
      console.error("Stripe verification error:", error.message);
      return {
        success: false,
        message: error.message || "Payment verification failed",
      };
    }
  }
}

/**
 * Payment Service Factory
 */
function getPaymentService(gateway) {
  switch (gateway) {
    case "paystack":
      return new PaystackService();
    case "flutterwave":
      return new FlutterwaveService();
    case "stripe":
      return new StripeService();
    default:
      throw new Error(`Unsupported payment gateway: ${gateway}`);
  }
}

module.exports = {
  getPaymentService,
  PaystackService,
  FlutterwaveService,
  StripeService,
};

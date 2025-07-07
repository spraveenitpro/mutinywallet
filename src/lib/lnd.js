import axios from "axios";

// Environment variables for lnd connection

const MACAROON = import.meta.env.VITE_MACAROON;
const HOST = import.meta.env.VITE_LND_HOST;

// Create axios instance for lnd api calls

const lnd = axios.create({
  baseURL: `https://${HOST}:8080`,
  headers: {
    "Grpc-Metadata-macaroon": MACAROON,
  },
});

// Get general info from lnd

export const getInfo = async () => {
  try {
    const response = await lnd.get("/v1/getinfo");
    return response.data;
  } catch (error) {
    console.error("Error fetching info: ", error);
  }
};

// Get balance from lnd

export const getBalance = async () => {
  try {
    const response = await lnd.get("/v1/balance/channels");
    return response.data;
  } catch (error) {
    console.error("Error fetching balance: ", error);
    throw error;
  }
};

// Create invoice for a given amount

export const createInvoice = async (amount) => {
  try {
    const response = await lnd.post("/v1/invoices", {
      value: amount,
    });
    console.log("LND response for invoice", response);
    return response.data;
  } catch (error) {
    console.error("Error creating invoice: ", error);
    throw error;
  }
};

// Create a method to pay an invoice

export const payInvoice = async (paymentRequest) => {
  try {
    const response = await lnd.post("/v1/channels/transactions", {
      payment_request: paymentRequest,
      // you should set this to prevent getting fee sniped / siphoned!
      fee_limit: {
        fixed: 1000,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error paying invoice:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

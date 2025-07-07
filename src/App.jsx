import React, { useState, useEffect } from "react";
import "./App.css";
import { getInfo, getBalance, createInvoice, payInvoice } from "./lib/lnd";

function App() {
  const [info, setInfo] = useState({});
  const [lightningBalance, setLightningBalance] = useState(null);
  const [inBound, setInBound] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [invoiceAmount, setInvoiceAmount] = useState(0);
  const [paymentRequest, setPaymentRequest] = useState("");
  const [paymentResponse, setPaymentResponse] = useState(null);

  const fetchInfo = async () => {
    try {
      const fetchedInfo = await getInfo();
      console.log(fetchedInfo);
      setInfo(fetchedInfo);
    } catch (error) {
      console.error("Error fetching info: ", error);
    }
  };

  const handleCreateInvoice = async () => {
    try {
      const createdInvoice = await createInvoice(parseInt(invoiceAmount));
      console.log("👽", createdInvoice);
      setInvoice(createdInvoice);
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  const handlePayInvoice = async () => {
    try {
      const paymentResponse = await payInvoice(paymentRequest);
      console.log(paymentResponse);
      if (paymentResponse.payment_preimage) {
        setPaymentResponse(
          `Payment successful! Payment preimage: ${paymentResponse.payment_preimage}`
        );
      } else {
        setPaymentResponse(
          `Payment failed. Error: ${paymentResponse.payment_error}`
        );
      }
    } catch (error) {
      console.error("Error paying invoice:", error);
      setPaymentResponse(`Error: ${error.message}`);
    }
  };

  const fetchBalances = async () => {
    try {
      const fetchedBalance = await getBalance();
      setLightningBalance(fetchedBalance.local_balance.sat);
      setInBound(fetchedBalance.remote_balance.sat);
      console.log("🧨 Balance: ", fetchedBalance);
    } catch (error) {
      console.error("Error fetching balance: ", error);
    }
  };

  useEffect(() => {
    fetchInfo();
    const pollInterval = setInterval(() => {
      fetchBalances();
    }, 1000);

    return () => clearInterval(pollInterval);
  }, []);

  return (
    <main>
      {info && info?.alias && (
        <div>
          <h1>Connected to {info.alias}</h1>
          <p>PubKey: {info.identity_pubkey}</p>
          <h2>Create Invoice</h2>
          <input
            type="number"
            value={invoiceAmount}
            onChange={(e) => setInvoiceAmount(e.target.value)}
            placeholder="Enter amount in satoshis"
          />
          <button onClick={handleCreateInvoice}>Create Invoice</button>
          {invoice && (
            <div>
              <p>Invoice created: {invoice.payment_request}</p>
            </div>
          )}
        </div>
      )}

      {lightningBalance && inBound && (
        <div>
          <p>Lightning Balance: {lightningBalance}</p>
          <p>Inbound Balance: {inBound}</p>
        </div>
      )}

      {info && (
        <div>
          <h2>Pay Invoice</h2>
          <input
            type="text"
            value={paymentRequest}
            onChange={(e) => setPaymentRequest(e.target.value)}
            placeholder="Enter payment request"
          />
          <button onClick={handlePayInvoice}>Pay Invoice</button>
          {paymentResponse && <p>{paymentResponse}</p>}
        </div>
      )}
    </main>
  );
}

export default App;

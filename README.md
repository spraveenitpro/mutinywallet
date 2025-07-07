# MutinyWallet

A minimal React + Vite Lightning wallet frontend that connects to your own LND node.

## Overview

This project provides a simple web interface to interact with a Lightning Network Daemon (LND) node. It allows you to:

- View node info (alias, pubkey)
- Check your Lightning channel balance
- Create Lightning invoices
- Pay Lightning invoices

All Lightning functionality is handled via the `src/lib/lnd.js` module, which wraps the LND REST API using Axios.

---

## Setup

### 1. Clone and Install

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root (this file is gitignored):

```
VITE_LND_HOST=your-lnd-host-or-ip
VITE_MACAROON=your-macaroon-hex
```

- `VITE_LND_HOST`: Host/IP of your LND node (do not include protocol or port)
- `VITE_MACAROON`: Hex-encoded admin macaroon (see below)

#### Getting Your Macaroon

```bash
xxd -ps -u -c 1000 ~/.lnd/data/chain/bitcoin/mainnet/admin.macaroon
```

---

## Lightning API (`src/lib/lnd.js`)

This module provides the following functions:

### `getInfo()`

Fetches general info about your LND node.

### `getBalance()`

Fetches your Lightning channel balance.

### `createInvoice(amount)`

Creates a Lightning invoice for the given amount (in satoshis).

### `payInvoice(paymentRequest)`

Pays a Lightning invoice using a BOLT11 payment request string.

---

## Example Usage

```
import { getInfo, getBalance, createInvoice, payInvoice } from './lib/lnd';

// Get node info
const info = await getInfo();

// Get channel balance
const balance = await getBalance();

// Create an invoice for 1000 sats
const invoice = await createInvoice(1000);

// Pay an invoice
const result = await payInvoice('lnbc1...');
```

---

## Security & CORS

- This app is for local/testing use. Exposing your LND node to the public internet is dangerous.
- You may need to configure CORS on your LND node for browser access.

---

## License

MIT

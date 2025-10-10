// lib/paypal.ts
import paypal from "@paypal/checkout-server-sdk";

const clientId = process.env.PAYPAL_CLIENT_ID!;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
const isLive = process.env.NODE_ENV === "production";

const environment = isLive
  ? new paypal.core.LiveEnvironment(clientId, clientSecret)
  : new paypal.core.SandboxEnvironment(clientId, clientSecret);

const client = new paypal.core.PayPalHttpClient(environment);

export { client, paypal };

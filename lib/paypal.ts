import * as paypal from "@paypal/checkout-server-sdk";

const isLive = process.env.NODE_ENV === "production";

// Sandbox credentials (for development)
const sandboxClientId = process.env.PAYPAL_SANDBOX_CLIENT_ID;
const sandboxClientSecret = process.env.PAYPAL_SANDBOX_CLIENT_SECRET;

// Live credentials (for production)
const liveClientId = process.env.PAYPAL_LIVE_CLIENT_ID;
const liveClientSecret = process.env.PAYPAL_LIVE_CLIENT_SECRET;

// Validate credentials based on environment
if (!isLive) {
  if (!sandboxClientId || !sandboxClientSecret) {
    throw new Error(
      "Missing PayPal sandbox credentials. Set PAYPAL_SANDBOX_CLIENT_ID and PAYPAL_SANDBOX_CLIENT_SECRET in .env.local."
    );
  }
} else {
  if (!liveClientId || !liveClientSecret) {
    throw new Error(
      "Missing PayPal live credentials. Set PAYPAL_LIVE_CLIENT_ID and PAYPAL_LIVE_CLIENT_SECRET in production environment."
    );
  }
}

// Configure the environment
const environment = isLive
  ? new paypal.core.LiveEnvironment(liveClientId!, liveClientSecret!)
  : new paypal.core.SandboxEnvironment(sandboxClientId!, sandboxClientSecret!);

const client = new paypal.core.PayPalHttpClient(environment);

export { client, paypal };

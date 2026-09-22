import "server-only";

import { Environment, Paddle } from "@paddle/paddle-node-sdk";

// Sandbox and live are separate Paddle accounts: the API key, client-side
// token, webhook secret and price ids must all come from the same one.
export const paddle = new Paddle(process.env.PADDLE_API_KEY ?? "", {
  environment:
    process.env.NEXT_PUBLIC_PADDLE_ENV === "production"
      ? Environment.production
      : Environment.sandbox,
});

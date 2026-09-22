import { initializePaddle, type Paddle } from "@paddle/paddle-js";

let paddlePromise: Promise<Paddle | undefined> | null = null;

/**
 * Loads and initializes Paddle.js once per page load and shares the instance.
 * Resolves to undefined when no client-side token is configured.
 */
export const loadPaddle = () => {
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

  if (!token) return Promise.resolve(undefined);

  paddlePromise ??= initializePaddle({
    token,
    environment:
      process.env.NEXT_PUBLIC_PADDLE_ENV === "production"
        ? "production"
        : "sandbox",
  }).catch((error) => {
    // Let the next click try again instead of caching the failure.
    paddlePromise = null;
    throw error;
  });

  return paddlePromise;
};

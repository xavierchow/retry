type RetryConfig = {
  maxAttempts: number;
  delayInMs?: number;
  shouldRetry?: (err: unknown) => boolean;
  mode?: "linear" | "exp";
};
export async function withRetry(
  config: RetryConfig,
  fn: () => Promise<unknown> | unknown,
) {
  const shouldRetry = config.shouldRetry || (() => true);
  let attempts = 0;

  const exec = async () => {
    try {
      attempts++;
      const r = await fn();
      return r;
    } catch (err: unknown) {
      const toBeRetried = shouldRetry(err);
      if (toBeRetried && attempts <= config.maxAttempts) {
        const timeout = computeTimeout(config, attempts);
        await new Promise((resolve) => setTimeout(resolve, timeout));
        return exec();
      } else {
        throw err;
      }
    }
  };
  return exec();
}

function computeTimeout(config: RetryConfig, attempts: number) {
  config.delayInMs = config.delayInMs || 1000;
  const factor = 2;
  if (config.mode && config.mode === "exp") {
    const timeout = config.delayInMs * Math.pow(factor, attempts);
    return timeout;
  } else {
    return config.delayInMs;
  }
}

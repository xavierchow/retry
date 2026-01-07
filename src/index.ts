type RetryConfig = {
  maxAttempts: number;
  delayInMs?: number;
  shouldRetry?: (err: unknown) => boolean;
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
        if (config.delayInMs && config.delayInMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, config.delayInMs));
        }
        return exec();
      } else {
        throw err;
      }
    }
  };
  return exec();
}

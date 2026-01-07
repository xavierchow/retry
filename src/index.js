"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRetry = withRetry;
async function withRetry(config, fn) {
    const shouldRetry = config.shouldRetry || (() => true);
    let attempts = 0;
    const exec = async () => {
        try {
            attempts++;
            const r = await fn();
            return r;
        }
        catch (err) {
            const toBeRetried = shouldRetry(err);
            if (toBeRetried && attempts <= config.maxAttempts) {
                if (config.delayInMs && config.delayInMs > 0) {
                    await new Promise((resolve) => setTimeout(resolve, config.delayInMs));
                }
                return exec();
            }
            else {
                throw err;
            }
        }
    };
    return exec();
}
//# sourceMappingURL=index.js.map
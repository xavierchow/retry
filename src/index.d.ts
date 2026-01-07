type RetryConfig = {
    maxAttempts: number;
    delayInMs?: number;
    shouldRetry?: (err: unknown) => boolean;
};
export declare function withRetry(config: RetryConfig, fn: () => Promise<unknown> | unknown): Promise<unknown>;
export {};
//# sourceMappingURL=index.d.ts.map
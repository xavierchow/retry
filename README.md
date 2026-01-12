# Retry

This is a tiny library to handle the retry mechanism, it provides

- max attempts, setting to 1 means `do it once and retry it once`
- criteria control for retry or not
- back off for a certain delay or exponential delay


# Install

``` sh
npm install @xavierchow/retry
```


# Usage

Retry with certain delay
``` typescript

const run = async () => {
    // your task here
};

await withRetry({ 
    maxAttempts: 3, 
    delayInMs: 1000  // retry after 1 second, mam 3 times
}, run);


```

Expoential retry with a criteria checker, 
with 1000 as delayInMS and maxAttempts 3, it will be like this:
- the 1st retry happens after 2 seconds, 
- the 2nd retry happens after 4 seconds, 
- the 3rd retry happens after 8 seconds.

The timeout formula:

>  timeout = delayInMs * Math.pow(2, attempts);


``` typescript
const checker = (err: unknown): boolean => {
    // a checker function to decide if it needs retry or not
};

 
await withRetry(
   { maxAttempts: 3, shouldRetry: checker, delayInMs: 1000, mode: "exp" },
   run,
);

```




# Development

## Install Dependence
``` sh
pnpm install
```

## Build

``` sh
pnpm build
```

## Test

``` sh
pnpm test
```

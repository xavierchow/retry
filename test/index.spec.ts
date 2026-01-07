import { withRetry } from "../src/index";

describe("withRetry", () => {
  it("should return result for asynchronized function", async () => {
    const run = () => {
      return Promise.resolve("ipsum");
    };
    const res = await withRetry({ maxAttempts: 1 }, run);
    expect(res).toBe("ipsum");
  });

  it("should return result for synchronized function", async () => {
    const run = () => {
      return "ipsum";
    };
    const res = await withRetry({ maxAttempts: 1 }, run);
    expect(res).toBe("ipsum");
  });

  it("should be able to retry", async () => {
    let cnt = 0;
    const run = async () => {
      cnt++;
      if (cnt === 1) {
        throw new Error("first call");
      }
      return "ipsum";
    };
    const res = await withRetry({ maxAttempts: 1 }, run);
    expect(res).toBe("ipsum");
  });

  it("should be able to succeed within the max attemps", async () => {
    let cnt = 0;
    const run = async () => {
      cnt++;
      if (cnt < 4) {
        throw new Error("some error");
      }
      // succeed on the 4th call
      return "ipsum";
    };
    const res = await withRetry({ maxAttempts: 3 }, run);
    expect(res).toBe("ipsum");
  });

  it("should give up if exceeding the max attempts", async () => {
    let cnt = 0;
    const run = async () => {
      cnt++;
      if (cnt < 4) {
        throw new Error("first 3 calls");
      }
      return "ipsum";
    };
    await expect(withRetry({ maxAttempts: 2 }, run)).rejects.toThrow(
      "first 3 calls",
    );
  });

  it("should be able to delay", async () => {
    let cnt = 0;
    let start: number = Date.now();
    let elapse: number = 0;
    const run = async () => {
      cnt++;
      elapse = Date.now() - start;
      start = Date.now();

      if (cnt === 1) {
        throw new Error("first call");
      }
      if (elapse < 1000) {
        throw new Error("too fast");
      }
      return "ipsum";
    };
    const res = await withRetry({ maxAttempts: 3, delayInMs: 1000 }, run);
    expect(res).toBe("ipsum");
  });
  it("should be able to retry with shouldRetry check", async () => {
    let cnt = 0;
    const run = async () => {
      cnt++;

      if (cnt === 1) {
        throw new Error("first call, need retry");
      }
      return "ipsum";
    };
    const checker = (err: unknown) => {
      if (
        err instanceof Error &&
        err.message &&
        err.message.includes("need retry")
      ) {
        return true;
      }
      return false;
    };
    const res = await withRetry({ maxAttempts: 3, shouldRetry: checker }, run);
    expect(res).toBe("ipsum");
  });
  it("should not retry if encoutering other errors", async () => {
    let cnt = 0;
    const run = async () => {
      cnt++;
      if (cnt === 1) {
        throw new Error("first call, no retry");
      }
      return "ipsum";
    };
    const checker = (err: unknown) => {
      if (
        err instanceof Error &&
        err.message &&
        err.message.includes("need retry")
      ) {
        return true;
      }
      return false;
    };
    await expect(
      withRetry({ maxAttempts: 3, shouldRetry: checker }, run),
    ).rejects.toThrow("first call, no retry");
  });
});

export function logError(err: unknown): void {
    // handles proper error objects and strings
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
}
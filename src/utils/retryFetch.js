/**
 * Utility function to retry async operations with exponential backoff
 * @param {Function} asyncFn - The async function to retry
 * @param {number} maxRetries - Maximum number of retry attempts (default: 2)
 * @param {number} delayMs - Initial delay in milliseconds (default: 500)
 * @returns {Promise} - Resolves with the result or rejects after all retries fail
 */
export const retryFetch = async (asyncFn, maxRetries = 2, delayMs = 500) => {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await asyncFn();
    } catch (error) {
      lastError = error;
      console.warn(
        `Fetch attempt ${attempt + 1}/${maxRetries + 1} failed:`,
        error.message
      );

      // Don't delay after the last attempt
      if (attempt < maxRetries) {
        // Exponential backoff: delay * (2 ^ attempt)
        const delay = delayMs * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // All retries exhausted
  console.error(
    `Failed to fetch after ${maxRetries + 1} attempts:`,
    lastError
  );
  throw lastError;
};

/**
 * Create a fetch wrapper with built-in retry logic
 * @param {Function} asyncFn - The async function to wrap
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Function} - Wrapped function with retry capability
 */
export const withRetry = (asyncFn, maxRetries = 2) => {
  return async (...args) => {
    return retryFetch(() => asyncFn(...args), maxRetries);
  };
};

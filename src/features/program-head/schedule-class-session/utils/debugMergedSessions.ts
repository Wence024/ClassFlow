/**
 * Debugging utilities for merged session rendering.
 * Set DEBUG_MERGED_SESSIONS to true to enable logging.
 */

export const DEBUG_MERGED_SESSIONS = false;

/**
 * Logs data to the console with a context label for debugging purposes.
 * Only logs if DEBUG_MERGED_SESSIONS is true.
 *
 * @param context - A string describing the context of the log message.
 * @param data - The data to be logged.
 */
export const logMergeGroup = (context: string, data: unknown) => {
  if (DEBUG_MERGED_SESSIONS) {
    console.log(`[${context}]`, data);
  }
};

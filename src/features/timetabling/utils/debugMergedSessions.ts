/**
 * Debugging utilities for merged session rendering.
 * Set DEBUG_MERGED_SESSIONS to true to enable logging.
 */

export const DEBUG_MERGED_SESSIONS = false;

export const logMergeGroup = (context: string, data: any) => {
  if (DEBUG_MERGED_SESSIONS) {
    console.log(`[${context}]`, data);
  }
};

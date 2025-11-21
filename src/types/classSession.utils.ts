/**
 * Utility functions for working with ClassSession types.
 * Provides type guards and helper functions for incomplete sessions.
 */

import type {
  ClassSession,
  IncompleteClassSession,
  PartiallyCompleteClassSession,
  CompleteClassSession,
} from './classSession';

/**
 * Type guard to check if a session is incomplete (no resources assigned).
 *
 * @param session - The class session to check
 * @returns True if both instructor and classroom are null
 */
export function isIncompleteSession(
  session: ClassSession
): session is IncompleteClassSession {
  return session.instructor === null && session.classroom === null;
}

/**
 * Type guard to check if a session is partially complete (one resource assigned).
 *
 * @param session - The class session to check
 * @returns True if exactly one of instructor or classroom is assigned
 */
export function isPartiallyComplete(
  session: ClassSession
): session is PartiallyCompleteClassSession {
  return (session.instructor === null) !== (session.classroom === null);
}

/**
 * Type guard to check if a session is complete (both resources assigned).
 *
 * @param session - The class session to check
 * @returns True if both instructor and classroom are assigned
 */
export function isCompleteSession(
  session: ClassSession
): session is CompleteClassSession {
  return session.instructor !== null && session.classroom !== null;
}

/**
 * Gets a list of missing resources for a session.
 *
 * @param session - The class session to check
 * @returns Array of missing resource types
 */
export function getMissingResources(
  session: ClassSession
): ('instructor' | 'classroom')[] {
  const missing: ('instructor' | 'classroom')[] = [];
  if (!session.instructor) missing.push('instructor');
  if (!session.classroom) missing.push('classroom');
  return missing;
}

/**
 * Checks if a session has any resources assigned.
 *
 * @param session - The class session to check
 * @returns True if at least one resource is assigned
 */
export function hasAnyResources(session: ClassSession): boolean {
  return session.instructor !== null || session.classroom !== null;
}

/**
 * Gets a display label for a session's resource completion status.
 *
 * @param session - The class session to check
 * @returns A human-readable status label
 */
export function getResourceCompletionStatus(session: ClassSession): string {
  if (isCompleteSession(session)) return 'Complete';
  if (isIncompleteSession(session)) return 'Needs resources';
  return 'Partially assigned';
}

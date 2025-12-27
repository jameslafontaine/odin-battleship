/**
 * @fileoverview Example enum-like constants for application states.
 *
 * Responsibilities:
 * - Provide centralized, immutable status values for consistent usage across modules
 * - Avoid magic strings scattered throughout the codebase
 *
 * Example:
 *   if (item.status === Status.ACTIVE) { ... }
 *
 * @module Constants
 */
export const Status = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    COMPLETED: "COMPLETED"
};

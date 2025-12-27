/**
 * @fileoverview Centralized date and time utility functions.
 *
 * Responsibilities:
 * - Wrap and simplify common `date-fns` operations for consistency across the app.
 * - Handle date formatting, parsing, and comparisons in one place.
 * - Provide human-readable date and time helpers for UI display.
 * - Serve as the single entry point for all date/time logic (easy to maintain or replace later).
 *
 * Example:
 *   import { formatDueDate, daysUntilDue } from './DateUtils.js';
 *   console.log(formatDueDate(new Date())); // "Nov 1, 2025"
 *
 * Dependencies:
 * - date-fns
 *
 * @module DateUtils
 */

import { format, parseISO, differenceInDays, isBefore, isToday } from "date-fns";

/**
 * Formats a Date object into a human-readable string (e.g., "Nov 1, 2025").
 *
 * @param {Date|string} date - The date to format (Date object or ISO string).
 * @param {string} [pattern='MMM d, yyyy'] - Optional format pattern.
 * @returns {string} The formatted date string.
 */
export function formatDueDate(date, pattern = "MMM d, yyyy") {
    const parsed = typeof date === "string" ? parseISO(date) : date;
    return format(parsed, pattern);
}

/**
 * Calculates how many days remain until a given due date.
 *
 * @param {Date|string} dueDate - The target date.
 * @returns {number} Number of days until the due date (negative if overdue).
 */
export function daysUntilDue(dueDate) {
    const parsed = typeof dueDate === "string" ? parseISO(dueDate) : dueDate;
    return differenceInDays(parsed, new Date());
}

/**
 * Checks if a given date is in the past.
 *
 * @param {Date|string} date - The date to check.
 * @returns {boolean} True if the date is before today, false otherwise.
 */
export function isOverdue(date) {
    const parsed = typeof date === "string" ? parseISO(date) : date;
    return isBefore(parsed, new Date());
}

/**
 * Checks if the given date is today.
 *
 * @param {Date|string} date - The date to check.
 * @returns {boolean} True if today, false otherwise.
 */
export function isDueToday(date) {
    const parsed = typeof date === "string" ? parseISO(date) : date;
    return isToday(parsed);
}

/**
 * Returns a human-readable description for task deadlines.
 *
 * @param {Date|string} dueDate - The task’s due date.
 * @returns {string} A user-friendly label like "Due today", "Overdue", or "In 3 days".
 */
export function getDueStatus(dueDate) {
    const daysLeft = daysUntilDue(dueDate);

    if (daysLeft < 0) return "Overdue";
    if (daysLeft === 0) return "Due today";
    if (daysLeft === 1) return "Due tomorrow";
    return `Due in ${daysLeft} days`;
}

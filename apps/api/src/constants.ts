export const SALT_ROUNDS = 10;

// Task priority constants (1 - 3)
export const PRIORITY_LOW = 1;
export const PRIORITY_MEDIUM = 2;
export const PRIORITY_HIGH = 3;

export const PRIORITY_MIN = PRIORITY_LOW;
export const PRIORITY_MAX = PRIORITY_HIGH;

export const ALLOWED_PRIORITIES = [PRIORITY_LOW, PRIORITY_MEDIUM, PRIORITY_HIGH] as const;
export type Priority = typeof ALLOWED_PRIORITIES[number];

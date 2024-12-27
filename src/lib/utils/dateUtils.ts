// src/lib/dateUtils.ts

export const months: string[] = Array.from({ length: 12 }, (_, i) =>
  new Date(0, i).toLocaleString('default', { month: 'long' })
);

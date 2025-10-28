import type { KanbanColumn } from '../components/KanbanBoard/KanbanBoard.types';

/**
 * Check if a column is at or near its WIP limit
 */
export function isNearWipLimit(column: KanbanColumn, threshold: number = 0.8): boolean {
  if (!column.maxTasks) {
    return false;
  }
  
  return column.taskIds.length >= column.maxTasks * threshold;
}

/**
 * Check if a column has reached its WIP limit
 */
export function isAtWipLimit(column: KanbanColumn): boolean {
  if (!column.maxTasks) {
    return false;
  }
  
  return column.taskIds.length >= column.maxTasks;
}

/**
 * Get WIP limit status message
 */
export function getWipLimitMessage(column: KanbanColumn): string | null {
  if (!column.maxTasks) {
    return null;
  }
  
  const remaining = column.maxTasks - column.taskIds.length;
  
  if (remaining <= 0) {
    return 'WIP limit reached';
  }
  
  if (remaining <= 2) {
    return `${remaining} slot${remaining === 1 ? '' : 's'} remaining`;
  }
  
  return null;
}

/**
 * Generate a unique ID for columns
 */
export function generateColumnId(): string {
  return `column-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Validate column color (hex format)
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

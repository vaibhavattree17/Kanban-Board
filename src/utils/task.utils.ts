import { isAfter, startOfDay } from 'date-fns';
import type { Priority } from '../components/KanbanBoard/KanbanBoard.types';

/**
 * Check if a task is overdue based on its due date
 */
export function isOverdue(dueDate: Date): boolean {
  const today = startOfDay(new Date());
  const due = startOfDay(dueDate);
  return isAfter(today, due);
}

/**
 * Extract initials from a person's name
 */
export function getInitials(name: string): string {
  if (!name || name.trim().length === 0) {
    return '?';
  }

  const parts = name.trim().split(/\s+/);
  
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Get the color associated with a priority level
 */
export function getPriorityColor(priority: Priority): string {
  const colors: Record<Priority, string> = {
    low: '#3b82f6',      // blue
    medium: '#eab308',   // yellow
    high: '#f97316',     // orange
    urgent: '#ef4444',   // red
  };
  
  return colors[priority];
}

/**
 * Get Tailwind classes for priority badge
 */
export function getPriorityClasses(priority: Priority): string {
  const classes: Record<Priority, string> = {
    low: 'bg-blue-100 text-blue-700 border-blue-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    urgent: 'bg-red-100 text-red-700 border-red-200',
  };
  
  return classes[priority];
}

/**
 * Reorder tasks within the same array
 */
export function reorderTasks(
  tasks: string[],
  startIndex: number,
  endIndex: number
): string[] {
  const result = Array.from(tasks);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  
  return result;
}

/**
 * Move a task from one column to another
 */
export function moveTaskBetweenColumns(
  sourceColumn: string[],
  destColumn: string[],
  sourceIndex: number,
  destIndex: number
): { source: string[]; destination: string[] } {
  const sourceClone = Array.from(sourceColumn);
  const destClone = Array.from(destColumn);
  const [removed] = sourceClone.splice(sourceIndex, 1);
  
  destClone.splice(destIndex, 0, removed);
  
  return {
    source: sourceClone,
    destination: destClone,
  };
}

/**
 * Generate a unique ID for tasks
 */
export function generateTaskId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength).trim() + '...';
}

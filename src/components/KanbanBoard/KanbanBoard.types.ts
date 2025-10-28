/**
 * Core type definitions for the Kanban Board component
 */

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: Priority;
  assignee?: string;
  tags?: string[];
  createdAt: Date;
  dueDate?: Date;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  taskIds: string[];
  maxTasks?: number;
}

export interface KanbanViewProps {
  columns: KanbanColumn[];
  tasks: Record<string, KanbanTask>;
  onTaskMove: (taskId: string, fromColumn: string, toColumn: string, newIndex: number) => void;
  onTaskCreate: (columnId: string, task: KanbanTask) => void;
  onTaskUpdate: (taskId: string, updates: Partial<KanbanTask>) => void;
  onTaskDelete: (taskId: string) => void;
  onColumnUpdate?: (columnId: string, updates: Partial<KanbanColumn>) => void;
  onColumnDelete?: (columnId: string) => void;
}

export interface KanbanCardProps {
  task: KanbanTask;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  isDragging?: boolean;
}

export interface KanbanColumnProps {
  column: KanbanColumn;
  tasks: KanbanTask[];
  onTaskMove: (taskId: string, newIndex: number) => void;
  onTaskCreate: () => void;
  onTaskEdit: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
  onColumnUpdate?: (updates: Partial<KanbanColumn>) => void;
  onColumnDelete?: () => void;
}

export interface TaskModalProps {
  task: KanbanTask | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: KanbanTask) => void;
  onDelete?: () => void;
  columns: KanbanColumn[];
}

export interface DragItem {
  id: string;
  columnId: string;
  index: number;
}

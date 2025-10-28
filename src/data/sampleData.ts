import type { KanbanColumn, KanbanTask } from '../components/KanbanBoard/KanbanBoard.types';

export const sampleColumns: KanbanColumn[] = [
  { 
    id: 'todo', 
    title: 'To Do', 
    color: '#6b7280', 
    taskIds: ['task-1', 'task-2', 'task-6'], 
    maxTasks: 10 
  },
  { 
    id: 'in-progress', 
    title: 'In Progress', 
    color: '#3b82f6', 
    taskIds: ['task-3', 'task-7'], 
    maxTasks: 5 
  },
  { 
    id: 'review', 
    title: 'Review', 
    color: '#f59e0b', 
    taskIds: ['task-8'], 
    maxTasks: 3 
  },
  { 
    id: 'done', 
    title: 'Done', 
    color: '#10b981', 
    taskIds: ['task-4', 'task-5'] 
  },
];

export const sampleTasks: Record<string, KanbanTask> = {
  'task-1': {
    id: 'task-1',
    title: 'Implement drag and drop functionality',
    description: 'Add drag and drop functionality to kanban cards using @dnd-kit library',
    status: 'todo',
    priority: 'high',
    assignee: 'John Doe',
    tags: ['frontend', 'feature'],
    createdAt: new Date(2024, 0, 10),
    dueDate: new Date(2024, 0, 20),
  },
  'task-2': {
    id: 'task-2',
    title: 'Design task card component',
    description: 'Create a reusable task card component with proper styling',
    status: 'todo',
    priority: 'medium',
    assignee: 'Jane Smith',
    tags: ['design', 'ui'],
    createdAt: new Date(2024, 0, 11),
    dueDate: new Date(2024, 0, 18),
  },
  'task-3': {
    id: 'task-3',
    title: 'Write unit tests',
    description: 'Add comprehensive unit tests for all components',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Bob Johnson',
    tags: ['testing', 'quality'],
    createdAt: new Date(2024, 0, 9),
    dueDate: new Date(2024, 0, 25),
  },
  'task-4': {
    id: 'task-4',
    title: 'Setup project repository',
    description: 'Initialize git repository and configure CI/CD pipeline',
    status: 'done',
    priority: 'urgent',
    assignee: 'Alice Williams',
    tags: ['devops', 'setup'],
    createdAt: new Date(2024, 0, 5),
    dueDate: new Date(2024, 0, 8),
  },
  'task-5': {
    id: 'task-5',
    title: 'Create project documentation',
    description: 'Write comprehensive README and API documentation',
    status: 'done',
    priority: 'low',
    assignee: 'Charlie Brown',
    tags: ['documentation'],
    createdAt: new Date(2024, 0, 6),
    dueDate: new Date(2024, 0, 12),
  },
  'task-6': {
    id: 'task-6',
    title: 'Implement keyboard navigation',
    description: 'Add full keyboard accessibility support for WCAG 2.1 AA compliance',
    status: 'todo',
    priority: 'high',
    assignee: 'John Doe',
    tags: ['accessibility', 'feature'],
    createdAt: new Date(2024, 0, 12),
    dueDate: new Date(2024, 0, 22),
  },
  'task-7': {
    id: 'task-7',
    title: 'Optimize performance',
    description: 'Profile and optimize rendering performance for large datasets',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'Jane Smith',
    tags: ['performance', 'optimization'],
    createdAt: new Date(2024, 0, 13),
    dueDate: new Date(2024, 0, 28),
  },
  'task-8': {
    id: 'task-8',
    title: 'Code review for modal component',
    description: 'Review and provide feedback on the task modal implementation',
    status: 'review',
    priority: 'medium',
    assignee: 'Bob Johnson',
    tags: ['review', 'quality'],
    createdAt: new Date(2024, 0, 14),
    dueDate: new Date(2024, 0, 16),
  },
};

// Generate large dataset for performance testing
export const generateLargeDataset = (taskCount: number = 100): { 
  columns: KanbanColumn[]; 
  tasks: Record<string, KanbanTask> 
} => {
  const columns: KanbanColumn[] = [
    { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: [], maxTasks: 50 },
    { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: [], maxTasks: 20 },
    { id: 'review', title: 'Review', color: '#f59e0b', taskIds: [], maxTasks: 10 },
    { id: 'done', title: 'Done', color: '#10b981', taskIds: [] },
  ];
  
  const tasks: Record<string, KanbanTask> = {};
  const priorities: Array<'low' | 'medium' | 'high' | 'urgent'> = ['low', 'medium', 'high', 'urgent'];
  const assignees = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams', 'Charlie Brown'];
  const tagOptions = ['frontend', 'backend', 'design', 'testing', 'documentation', 'bug', 'feature'];
  
  for (let i = 0; i < taskCount; i++) {
    const taskId = `task-${i + 1}`;
    const columnIndex = Math.floor(Math.random() * columns.length);
    const column = columns[columnIndex];
    
    const task: KanbanTask = {
      id: taskId,
      title: `Task ${i + 1}: ${['Implement', 'Design', 'Fix', 'Review', 'Test'][Math.floor(Math.random() * 5)]} feature`,
      description: `Description for task ${i + 1}`,
      status: column.id,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      assignee: assignees[Math.floor(Math.random() * assignees.length)],
      tags: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
        tagOptions[Math.floor(Math.random() * tagOptions.length)]
      ),
      createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1),
      dueDate: Math.random() > 0.3 ? new Date(2024, 0, Math.floor(Math.random() * 30) + 15) : undefined,
    };
    
    tasks[taskId] = task;
    column.taskIds.push(taskId);
  }
  
  return { columns, tasks };
};

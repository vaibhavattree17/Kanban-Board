import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { KanbanBoard } from './KanbanBoard';
import type { KanbanColumn, KanbanTask } from './KanbanBoard.types';
import { sampleColumns, sampleTasks, generateLargeDataset } from '../../data/sampleData';

const meta = {
  title: 'Components/KanbanBoard',
  component: KanbanBoard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A production-grade Kanban Board component with drag-and-drop, keyboard navigation, and full accessibility support.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof KanbanBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to handle state
const KanbanBoardWrapper = ({ 
  initialColumns, 
  initialTasks 
}: { 
  initialColumns: KanbanColumn[]; 
  initialTasks: Record<string, KanbanTask> 
}) => {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [tasks, setTasks] = useState<Record<string, KanbanTask>>(initialTasks);

  const handleTaskMove = (
    taskId: string,
    fromColumn: string,
    toColumn: string,
    newIndex: number
  ) => {
    setColumns((prevColumns) => {
      const newColumns = prevColumns.map((col) => ({ ...col, taskIds: [...col.taskIds] }));
      
      const fromCol = newColumns.find((col) => col.id === fromColumn);
      const toCol = newColumns.find((col) => col.id === toColumn);
      
      if (!fromCol || !toCol) return prevColumns;
      
      const taskIndex = fromCol.taskIds.indexOf(taskId);
      if (taskIndex > -1) {
        fromCol.taskIds.splice(taskIndex, 1);
      }
      
      toCol.taskIds.splice(newIndex, 0, taskId);
      
      return newColumns;
    });
    
    setTasks((prevTasks) => ({
      ...prevTasks,
      [taskId]: {
        ...prevTasks[taskId],
        status: toColumn,
      },
    }));
  };

  const handleTaskCreate = (columnId: string, task: KanbanTask) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [task.id]: task,
    }));
    
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId
          ? { ...col, taskIds: [...col.taskIds, task.id] }
          : col
      )
    );
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<KanbanTask>) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [taskId]: {
        ...prevTasks[taskId],
        ...updates,
      },
    }));
    
    if (updates.status && updates.status !== tasks[taskId].status) {
      const oldStatus = tasks[taskId].status;
      handleTaskMove(taskId, oldStatus, updates.status, 0);
    }
  };

  const handleTaskDelete = (taskId: string) => {
    const task = tasks[taskId];
    if (!task) return;
    
    setColumns((prevColumns) =>
      prevColumns.map((col) => ({
        ...col,
        taskIds: col.taskIds.filter((id) => id !== taskId),
      }))
    );
    
    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };
      delete newTasks[taskId];
      return newTasks;
    });
  };

  const handleColumnUpdate = (columnId: string, updates: Partial<KanbanColumn>) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId ? { ...col, ...updates } : col
      )
    );
  };

  const handleColumnDelete = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column) return;
    
    column.taskIds.forEach((taskId) => {
      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };
        delete newTasks[taskId];
        return newTasks;
      });
    });
    
    setColumns((prevColumns) => prevColumns.filter((col) => col.id !== columnId));
  };

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <KanbanBoard
        columns={columns}
        tasks={tasks}
        onTaskMove={handleTaskMove}
        onTaskCreate={handleTaskCreate}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
        onColumnUpdate={handleColumnUpdate}
        onColumnDelete={handleColumnDelete}
      />
    </div>
  );
};

/**
 * Default Kanban Board with sample data showing all features:
 * - 4 columns (To Do, In Progress, Review, Done)
 * - 8 tasks with various priorities and assignees
 * - Drag and drop functionality
 * - Task creation and editing
 */
export const Default: Story = {
  render: () => (
    <KanbanBoardWrapper 
      initialColumns={sampleColumns} 
      initialTasks={sampleTasks} 
    />
  ),
};

/**
 * Empty State - Shows the board with no tasks in any column.
 * Useful for testing the initial state and empty state messages.
 */
export const EmptyState: Story = {
  render: () => {
    const emptyColumns: KanbanColumn[] = [
      { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: [] },
      { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: [] },
      { id: 'review', title: 'Review', color: '#f59e0b', taskIds: [] },
      { id: 'done', title: 'Done', color: '#10b981', taskIds: [] },
    ];
    
    return (
      <KanbanBoardWrapper 
        initialColumns={emptyColumns} 
        initialTasks={{}} 
      />
    );
  },
};

/**
 * Large Dataset - Performance test with 100+ tasks.
 * Tests rendering performance, scrolling, and drag-and-drop with many items.
 */
export const LargeDataset: Story = {
  render: () => {
    const { columns, tasks } = generateLargeDataset(100);
    
    return (
      <KanbanBoardWrapper 
        initialColumns={columns} 
        initialTasks={tasks} 
      />
    );
  },
};

/**
 * Mobile View - Demonstrates responsive behavior on mobile devices.
 * Columns stack vertically on small screens.
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <KanbanBoardWrapper 
      initialColumns={sampleColumns} 
      initialTasks={sampleTasks} 
    />
  ),
};

/**
 * Tablet View - Shows the board on tablet-sized screens.
 * Typically displays 2 columns at a time with horizontal scrolling.
 */
export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  render: () => (
    <KanbanBoardWrapper 
      initialColumns={sampleColumns} 
      initialTasks={sampleTasks} 
    />
  ),
};

/**
 * WIP Limits - Demonstrates Work In Progress limit warnings.
 * Shows visual indicators when columns approach or reach their limits.
 */
export const WithWIPLimits: Story = {
  render: () => {
    const wipColumns: KanbanColumn[] = [
      { 
        id: 'todo', 
        title: 'To Do', 
        color: '#6b7280', 
        taskIds: ['task-1', 'task-2', 'task-6'], 
        maxTasks: 5 
      },
      { 
        id: 'in-progress', 
        title: 'In Progress', 
        color: '#3b82f6', 
        taskIds: ['task-3', 'task-7'], 
        maxTasks: 2  // At limit
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
    
    return (
      <KanbanBoardWrapper 
        initialColumns={wipColumns} 
        initialTasks={sampleTasks} 
      />
    );
  },
};

/**
 * Three Columns - Minimal setup with just 3 columns.
 * Useful for simpler workflows.
 */
export const ThreeColumns: Story = {
  render: () => {
    const threeColumns: KanbanColumn[] = [
      { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: ['task-1', 'task-2', 'task-6'] },
      { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: ['task-3', 'task-7', 'task-8'] },
      { id: 'done', title: 'Done', color: '#10b981', taskIds: ['task-4', 'task-5'] },
    ];
    
    return (
      <KanbanBoardWrapper 
        initialColumns={threeColumns} 
        initialTasks={sampleTasks} 
      />
    );
  },
};

/**
 * Six Columns - Extended workflow with 6 columns.
 * Tests horizontal scrolling and column management.
 */
export const SixColumns: Story = {
  render: () => {
    const sixColumns: KanbanColumn[] = [
      { id: 'backlog', title: 'Backlog', color: '#9ca3af', taskIds: ['task-1'] },
      { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: ['task-2'] },
      { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: ['task-3'] },
      { id: 'review', title: 'Review', color: '#f59e0b', taskIds: ['task-6'] },
      { id: 'testing', title: 'Testing', color: '#8b5cf6', taskIds: ['task-7'] },
      { id: 'done', title: 'Done', color: '#10b981', taskIds: ['task-4', 'task-5', 'task-8'] },
    ];
    
    return (
      <KanbanBoardWrapper 
        initialColumns={sixColumns} 
        initialTasks={sampleTasks} 
      />
    );
  },
};

/**
 * Interactive Playground - Fully functional board for testing all features.
 * Try creating, editing, deleting tasks, and dragging them between columns.
 */
export const InteractivePlayground: Story = {
  render: () => (
    <KanbanBoardWrapper 
      initialColumns={sampleColumns} 
      initialTasks={sampleTasks} 
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'A fully interactive Kanban board. Try:\n- Dragging tasks between columns\n- Creating new tasks with the "Add task" button\n- Editing tasks by clicking on them\n- Deleting tasks with the delete button\n- Using keyboard navigation (Tab, Space, Arrow keys)',
      },
    },
  },
};

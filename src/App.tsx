import { useState } from 'react';
import { KanbanBoard } from './components/KanbanBoard/KanbanBoard';
import type { KanbanColumn, KanbanTask } from './components/KanbanBoard/KanbanBoard.types';
import { sampleColumns, sampleTasks } from './data/sampleData';
import './styles/globals.css';

function App() {
  const [columns, setColumns] = useState<KanbanColumn[]>(sampleColumns);
  const [tasks, setTasks] = useState<Record<string, KanbanTask>>(sampleTasks);

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
      
      // Remove from source
      const taskIndex = fromCol.taskIds.indexOf(taskId);
      if (taskIndex > -1) {
        fromCol.taskIds.splice(taskIndex, 1);
      }
      
      // Add to destination
      toCol.taskIds.splice(newIndex, 0, taskId);
      
      return newColumns;
    });
    
    // Update task status
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
    
    // If status changed, move task to new column
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
    
    // Remove all tasks in the column
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
    <div className="h-screen w-screen">
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
}

export default App;

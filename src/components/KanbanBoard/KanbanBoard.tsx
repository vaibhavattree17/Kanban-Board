import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { KanbanViewProps, KanbanTask } from './KanbanBoard.types';
import { KanbanColumn as KanbanColumnComponent } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { TaskModal } from './TaskModal';
import { generateTaskId } from '../../utils/task.utils';

export const KanbanBoard: React.FC<KanbanViewProps> = ({
  columns,
  tasks,
  onTaskMove,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  onColumnUpdate,
  onColumnDelete,
}) => {
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskColumnId, setNewTaskColumnId] = useState<string | undefined>(undefined);
  
  // Configure drag sensors with keyboard support
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Get tasks for each column
  const getColumnTasks = (columnId: string): KanbanTask[] => {
    const column = columns.find(col => col.id === columnId);
    if (!column) return [];
    
    return column.taskIds
      .map(taskId => tasks[taskId])
      .filter((task): task is KanbanTask => task !== undefined);
  };
  
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks[active.id as string];
    setActiveTask(task || null);
  };
  
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Find the columns
    const activeColumn = columns.find(col => col.taskIds.includes(activeId));
    const overColumn = columns.find(col => 
      col.id === overId || col.taskIds.includes(overId)
    );
    
    if (!activeColumn || !overColumn) return;
    
    // If moving to a different column
    if (activeColumn.id !== overColumn.id) {
      // Moving to different column
      const overIndex = overColumn.taskIds.includes(overId)
        ? overColumn.taskIds.indexOf(overId)
        : overColumn.taskIds.length;
      
      onTaskMove(activeId, activeColumn.id, overColumn.id, overIndex);
    }
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveTask(null);
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Find the columns
    const activeColumn = columns.find(col => col.taskIds.includes(activeId));
    const overColumn = columns.find(col => 
      col.id === overId || col.taskIds.includes(overId)
    );
    
    if (!activeColumn || !overColumn) return;
    
    // If reordering within the same column
    if (activeColumn.id === overColumn.id) {
      const oldIndex = activeColumn.taskIds.indexOf(activeId);
      const newIndex = activeColumn.taskIds.indexOf(overId);
      
      if (oldIndex !== newIndex) {
        onTaskMove(activeId, activeColumn.id, overColumn.id, newIndex);
      }
    }
  };
  
  const handleTaskEdit = (taskId: string) => {
    const task = tasks[taskId];
    if (task) {
      setEditingTask(task);
      setIsModalOpen(true);
    }
  };
  
  const handleTaskCreate = (columnId: string) => {
    setEditingTask(null);
    setNewTaskColumnId(columnId);
    setIsModalOpen(true);
  };
  
  const handleTaskSave = (task: KanbanTask) => {
    if (editingTask) {
      // Update existing task
      onTaskUpdate(task.id, task);
    } else {
      // Create new task
      const columnId = newTaskColumnId || columns[0]?.id;
      if (columnId) {
        onTaskCreate(columnId, task);
      }
    }
    setIsModalOpen(false);
    setEditingTask(null);
    setNewTaskColumnId(undefined);
  };
  
  const handleTaskDuplicate = (taskId: string) => {
    const task = tasks[taskId];
    if (task) {
      const duplicatedTask: KanbanTask = {
        ...task,
        id: generateTaskId(),
        title: `${task.title} (Copy)`,
        createdAt: new Date(),
      };
      onTaskCreate(task.status, duplicatedTask);
    }
  };
  
  return (
    <div className="h-full flex flex-col relative">
      {/* Board Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar relative z-10">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 p-8 h-full min-w-min">
            {columns.map((column) => (
              <KanbanColumnComponent
                key={column.id}
                column={column}
                tasks={getColumnTasks(column.id)}
                onTaskEdit={handleTaskEdit}
                onTaskDelete={onTaskDelete}
                onTaskDuplicate={handleTaskDuplicate}
                onTaskCreate={() => handleTaskCreate(column.id)}
                onColumnUpdate={onColumnUpdate ? (updates) => onColumnUpdate(column.id, updates) : undefined}
                onColumnDelete={onColumnDelete ? () => onColumnDelete(column.id) : undefined}
              />
            ))}
          </div>
          
          {/* Drag Overlay */}
          <DragOverlay>
            {activeTask ? (
              <div className="rotate-3 opacity-90 neon-glow">
                <KanbanCard
                  task={activeTask}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      
      {/* Task Modal */}
      <TaskModal
        task={editingTask}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
          setNewTaskColumnId(undefined);
        }}
        onSave={handleTaskSave}
        onDelete={editingTask ? () => onTaskDelete(editingTask.id) : undefined}
        columns={columns}
        defaultColumnId={newTaskColumnId}
      />
    </div>
  );
};

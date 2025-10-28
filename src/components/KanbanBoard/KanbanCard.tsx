import React from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { KanbanTask } from './KanbanBoard.types';
import { Avatar } from '../primitives/Avatar';
import { isOverdue, getPriorityColor } from '../../utils/task.utils';

export interface KanbanCardProps {
  task: KanbanTask;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate?: () => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  task,
  onEdit,
  onDelete,
  onDuplicate,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const priorityColor = task.priority ? getPriorityColor(task.priority) : undefined;
  const isTaskOverdue = task.dueDate ? isOverdue(task.dueDate) : false;
  
  const [showActions, setShowActions] = React.useState(false);
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onEdit();
    }
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        'glass rounded-xl border border-white/20 p-4 mb-3 cursor-grab active:cursor-grabbing',
        'transition-all duration-300 backdrop-blur-md',
        isDragging ? 'shadow-2xl opacity-50 scale-105 neon-glow' : 'hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1',
        'focus-ring group'
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onKeyDown={handleKeyDown}
      aria-label={`${task.title}. Status: ${task.status}. ${task.priority ? `Priority: ${task.priority}.` : ''} Press space to grab.`}
      aria-grabbed={isDragging}
      {...attributes}
      {...listeners}
    >
      {/* Priority indicator */}
      {priorityColor && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl animate-pulse"
          style={{ 
            backgroundColor: priorityColor,
            boxShadow: `0 0 10px ${priorityColor}, 0 0 20px ${priorityColor}40`
          }}
          aria-hidden="true"
        />
      )}
      
      {/* Card content */}
      <div className="relative">
        {/* Title */}
        <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 pr-8 tracking-wide">
          {task.title}
        </h3>
        
        {/* Quick actions */}
        {showActions && (
          <div className="absolute top-0 right-0 flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1 rounded hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700 focus-ring"
              aria-label="Edit task"
              title="Edit"
            >
              <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            {onDuplicate && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate();
                }}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 focus-ring transition-all"
                aria-label="Duplicate task"
                title="Duplicate"
              >
                <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 focus-ring transition-all"
              aria-label="Delete task"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {task.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-bold bg-gray-100 text-gray-700 rounded-md border border-gray-200"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="px-2 py-1 text-xs font-bold bg-gray-100 text-gray-700 rounded-md border border-gray-200">
                +{task.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between mt-3">
          {/* Assignee */}
          {task.assignee && (
            <Avatar name={task.assignee} size="sm" />
          )}
          
          <div className="flex-1" />
          
          {/* Due date */}
          {task.dueDate && (
            <div
              className={clsx(
                'px-2.5 py-1 text-xs font-bold rounded-lg border',
                isTaskOverdue
                  ? 'bg-red-100 text-red-700 border-red-300 animate-pulse'
                  : 'bg-gray-100 text-gray-700 border-gray-200'
              )}
              title={format(task.dueDate, 'PPP')}
            >
              {format(task.dueDate, 'MMM d')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

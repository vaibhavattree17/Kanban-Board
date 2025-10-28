import React, { useState } from 'react';
import clsx from 'clsx';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { KanbanColumn as KanbanColumnType, KanbanTask } from './KanbanBoard.types';
import { KanbanCard } from './KanbanCard';
import { Button } from '../primitives/Button';
import { isAtWipLimit, isNearWipLimit, getWipLimitMessage } from '../../utils/column.utils';

export interface KanbanColumnProps {
  column: KanbanColumnType;
  tasks: KanbanTask[];
  onTaskEdit: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskDuplicate?: (taskId: string) => void;
  onTaskCreate: () => void;
  onColumnUpdate?: (updates: Partial<KanbanColumnType>) => void;
  onColumnDelete?: () => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  onTaskEdit,
  onTaskDelete,
  onTaskDuplicate,
  onTaskCreate,
  onColumnUpdate,
  onColumnDelete,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });
  
  const atWipLimit = isAtWipLimit(column);
  const nearWipLimit = isNearWipLimit(column);
  const wipMessage = getWipLimitMessage(column);
  
  return (
    <div
      className={clsx(
        'flex flex-col glass rounded-2xl p-5 h-full transition-all duration-300',
        'w-80 flex-shrink-0 hover:shadow-2xl',
        'md:w-88',
        'border border-white/10'
      )}
      role="region"
      aria-label={`${column.title} column. ${tasks.length} tasks.`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 sticky top-0 z-10 pb-3 backdrop-blur-sm">
        <div className="flex items-center gap-2 flex-1">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0 neon-glow animate-pulse"
            style={{ backgroundColor: column.color, boxShadow: `0 0 10px ${column.color}` }}
            aria-hidden="true"
          />
          <h2 className="font-bold text-gray-800 text-lg truncate tracking-wide">
            {column.title}
          </h2>
          <span className="px-2.5 py-1 text-xs font-bold bg-gray-100 text-gray-700 rounded-full border border-gray-200">
            {tasks.length}
            {column.maxTasks && `/${column.maxTasks}`}
          </span>
          
          {/* Collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 focus-ring ml-auto transition-all"
            aria-label={isCollapsed ? 'Expand column' : 'Collapse column'}
            aria-expanded={!isCollapsed}
          >
            <svg
              className={clsx('w-4 h-4 transition-transform', isCollapsed && 'rotate-180')}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Options menu */}
          {(onColumnUpdate || onColumnDelete) && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 focus-ring transition-all"
                aria-label="Column options"
                aria-haspopup="true"
                aria-expanded={showMenu}
              >
                <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-20">
                  {onColumnUpdate && (
                    <>
                      <button
                        onClick={() => {
                          const newTitle = prompt('Enter new column title:', column.title);
                          if (newTitle && newTitle.trim()) {
                            onColumnUpdate({ title: newTitle.trim() });
                          }
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-ring transition-all"
                      >
                        Rename column
                      </button>
                      <button
                        onClick={() => {
                          const maxTasks = prompt('Enter WIP limit (leave empty for no limit):', column.maxTasks?.toString() || '');
                          if (maxTasks !== null) {
                            const limit = maxTasks.trim() === '' ? undefined : parseInt(maxTasks);
                            if (limit === undefined || (!isNaN(limit) && limit > 0)) {
                              onColumnUpdate({ maxTasks: limit });
                            }
                          }
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 focus-ring"
                      >
                        Set WIP limit
                      </button>
                    </>
                  )}
                  {onColumnDelete && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete column "${column.title}"? All tasks will be removed.`)) {
                          onColumnDelete();
                        }
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/20 focus-ring transition-all"
                    >
                      Delete column
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* WIP Limit Warning */}
      {wipMessage && !isCollapsed && (
        <div
          className={clsx(
            'px-3 py-2 rounded-lg text-xs font-bold mb-3 backdrop-blur-sm border',
            atWipLimit ? 'bg-red-500/20 text-red-300 border-red-500/50' : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
          )}
          role="status"
          aria-live="polite"
        >
          {wipMessage}
        </div>
      )}
      
      {/* Tasks Container */}
      {!isCollapsed && (
        <div
          ref={setNodeRef}
          className={clsx(
            'flex-1 overflow-y-auto custom-scrollbar pr-1',
            isOver && 'bg-blue-500/10 rounded-lg ring-2 ring-blue-400/50',
            nearWipLimit && !atWipLimit && 'border-2 border-yellow-400/50 rounded-lg'
          )}
        >
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm font-medium">
                No tasks yet
              </div>
            ) : (
              tasks.map((task) => (
                <KanbanCard
                  key={task.id}
                  task={task}
                  onEdit={() => onTaskEdit(task.id)}
                  onDelete={() => onTaskDelete(task.id)}
                  onDuplicate={onTaskDuplicate ? () => onTaskDuplicate(task.id) : undefined}
                />
              ))
            )}
          </SortableContext>
        </div>
      )}
      
      {/* Add Task Button */}
      {!isCollapsed && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onTaskCreate}
            className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            disabled={atWipLimit}
          >
            <svg className="w-4 h-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 4v16m8-8H4" />
            </svg>
            Add task
          </Button>
        </div>
      )}
    </div>
  );
};

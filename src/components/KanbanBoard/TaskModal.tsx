import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import type { KanbanTask, KanbanColumn, Priority } from './KanbanBoard.types';
import { Modal } from '../primitives/Modal';
import { Button } from '../primitives/Button';
import { generateTaskId } from '../../utils/task.utils';

export interface TaskModalProps {
  task: KanbanTask | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: KanbanTask) => void;
  onDelete?: () => void;
  columns: KanbanColumn[];
  defaultColumnId?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
  onDelete,
  columns,
  defaultColumnId,
}) => {
  const [formData, setFormData] = useState<Partial<KanbanTask>>({
    title: '',
    description: '',
    status: defaultColumnId || columns[0]?.id || '',
    priority: undefined,
    assignee: '',
    tags: [],
    dueDate: undefined,
  });
  
  const [tagInput, setTagInput] = useState('');
  
  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        dueDate: task.dueDate,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: defaultColumnId || columns[0]?.id || '',
        priority: undefined,
        assignee: '',
        tags: [],
        dueDate: undefined,
      });
    }
    setTagInput('');
  }, [task, isOpen, columns, defaultColumnId]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title?.trim()) {
      return;
    }
    
    const taskData: KanbanTask = {
      id: task?.id || generateTaskId(),
      title: formData.title.trim(),
      description: formData.description?.trim(),
      status: formData.status || columns[0]?.id || '',
      priority: formData.priority,
      assignee: formData.assignee?.trim(),
      tags: formData.tags || [],
      createdAt: task?.createdAt || new Date(),
      dueDate: formData.dueDate,
    };
    
    onSave(taskData);
    onClose();
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag !== tagToRemove) || [],
    });
  };
  
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const priorities: Priority[] = ['low', 'medium', 'high', 'urgent'];
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create Task'}
      size="lg"
      footer={
        <>
          {task && onDelete && (
            <Button
              variant="danger"
              onClick={() => {
                if (confirm('Are you sure you want to delete this task?')) {
                  onDelete();
                  onClose();
                }
              }}
              className="mr-auto"
            >
              Delete
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {task ? 'Save' : 'Create'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="task-title" className="block text-sm font-bold text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus-ring text-gray-900"
            placeholder="Enter task title"
            required
            autoFocus
          />
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="task-description" className="block text-sm font-bold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="task-description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus-ring resize-none text-gray-900 placeholder-gray-400"
            placeholder="Enter task description"
            rows={4}
          />
        </div>
        
        {/* Status and Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="task-status" className="block text-sm font-bold text-gray-700 mb-2">
              Status
            </label>
            <select
              id="task-status"
              value={formData.status || ''}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus-ring text-gray-900"
            >
              {columns.map((column) => (
                <option key={column.id} value={column.id}>
                  {column.title}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="task-priority" className="block text-sm font-bold text-gray-700 mb-2">
              Priority
            </label>
            <select
              id="task-priority"
              value={formData.priority || ''}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority || undefined })}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus-ring text-gray-900"
            >
              <option value="">None</option>
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Assignee and Due Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="task-assignee" className="block text-sm font-bold text-gray-700 mb-2">
              Assignee
            </label>
            <input
              id="task-assignee"
              type="text"
              value={formData.assignee || ''}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus-ring text-gray-900"
              placeholder="Enter assignee name"
            />
          </div>
          
          <div>
            <label htmlFor="task-due-date" className="block text-sm font-bold text-gray-700 mb-2">
              Due Date
            </label>
            <input
              id="task-due-date"
              type="date"
              value={formData.dueDate ? format(formData.dueDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value ? new Date(e.target.value) : undefined })}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus-ring text-gray-900"
            />
          </div>
        </div>
        
        {/* Tags */}
        <div>
          <label htmlFor="task-tags" className="block text-sm font-bold text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              id="task-tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus-ring text-gray-900 placeholder-gray-400"
              placeholder="Add a tag"
            />
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleAddTag}
            >
              Add
            </Button>
          </div>
          
          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg border border-gray-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-600 focus-ring rounded"
                    aria-label={`Remove ${tag} tag`}
                  >
                    <svg className="w-3 h-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

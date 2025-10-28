import React from 'react';
import clsx from 'clsx';
import { getInitials } from '../../utils/task.utils';

export interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', className }) => {
  const initials = getInitials(name);
  
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };
  
  // Generate a consistent color based on the name
  const getColorFromName = (name: string): string => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-teal-500',
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  return (
    <div
      className={clsx(
        'inline-flex items-center justify-center rounded-full text-white font-semibold',
        sizeClasses[size],
        getColorFromName(name),
        className
      )}
      title={name}
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </div>
  );
};

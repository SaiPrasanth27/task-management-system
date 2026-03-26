import React from 'react';

const TaskItem = ({ task, onEdit, onDelete, onStatusChange }) => {
  const statusColors = {
    'Todo': 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'Done': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  };
  
  const priorityColors = {
    'High': 'text-red-600 dark:text-red-400',
    'Medium': 'text-indigo-600 dark:text-indigo-400',
    'Low': 'text-slate-500 dark:text-slate-400'
  };

  return (
    <div className="card flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold line-clamp-2">{task.title}</h3>
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusColors[task.status]}`}>
          {task.status}
        </span>
      </div>
      
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-grow line-clamp-3">
        {task.description}
      </p>

      <div className="flex items-center gap-4 text-xs font-medium mb-6">
        <span className={`flex items-center gap-1 ${priorityColors[task.priority]}`}>
          ■ {task.priority} Priority
        </span>
        <span className="text-secondary flex items-center gap-1">
          📅 {new Date(task.dueDate).toLocaleDateString()}
        </span>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-darkborder flex items-center justify-between">
        <select 
          value={task.status} 
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-darkborder rounded px-2 py-1 outline-none"
        >
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Mark Done</option>
        </select>
        
        <div className="flex gap-2">
          <button onClick={onEdit} className="text-primary hover:text-primary-hover text-sm font-medium">Edit</button>
          <button onClick={() => onDelete(task._id)} className="text-danger hover:text-red-700 text-sm font-medium">Delete</button>
        </div>
      </div>
    </div>
  );
};
export default TaskItem;

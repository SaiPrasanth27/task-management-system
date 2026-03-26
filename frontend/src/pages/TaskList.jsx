import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sort, setSort] = useState('createdAt_desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const queryParams = new URLSearchParams({ page, limit: 12 });
      if (keyword) queryParams.append('keyword', keyword);
      if (status) queryParams.append('status', status);
      if (priority) queryParams.append('priority', priority);
      if (sort) queryParams.append('sort', sort);
      
      const tkRes = await api.get(`/tasks?${queryParams.toString()}`);
      setTasks(tkRes.data.tasks);
      setTotalPages(tkRes.data.pages);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [keyword, status, priority, sort, page]);

  const handleOpenModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    await api.put(`/tasks/${id}`, { status: newStatus });
    fetchTasks();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Your Tasks</h2>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <span>+</span> Create New Task
        </button>
      </div>

      {/* Minimal Advanced Toolbar Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-darkborder bg-transparent">
        <input 
          type="text" 
          placeholder="Search by title..." 
          value={keyword} 
          onChange={(e) => { setKeyword(e.target.value); setPage(1); }} 
          className="flex-1 min-w-[200px] border border-slate-300 dark:border-darkborder bg-white dark:bg-slate-800 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        />
        <select 
          value={status} 
          onChange={(e) => { setStatus(e.target.value); setPage(1); }} 
          className="w-max border border-slate-300 dark:border-darkborder bg-white dark:bg-slate-800 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none cursor-pointer"
        >
          <option value="">Status: All</option>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <select 
          value={priority} 
          onChange={(e) => { setPriority(e.target.value); setPage(1); }} 
          className="w-max border border-slate-300 dark:border-darkborder bg-white dark:bg-slate-800 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none cursor-pointer"
        >
          <option value="">Priority: All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select 
          value={sort} 
          onChange={(e) => { setSort(e.target.value); setPage(1); }} 
          className="w-max border border-slate-300 dark:border-darkborder bg-white dark:bg-slate-800 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none cursor-pointer"
        >
          <option value="createdAt_desc">Sort: Newest First</option>
          <option value="dueDate_asc">Sort: Due Earliest</option>
          <option value="dueDate_desc">Sort: Due Latest</option>
          <option value="priority_desc">Sort: High Priority</option>
        </select>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tasks.length === 0 ? (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 dark:border-darkborder rounded-xl">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No tasks found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Try adjusting your filters or search keywords, or create a brand new task to get started.</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskItem 
              key={task._id} 
              task={task} 
              onEdit={() => handleOpenModal(task)}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange} 
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12 mb-8">
          <button className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Page {page} of {totalPages}</span>
          <button className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}

      {/* Create/Edit Modal */}
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        task={editingTask} 
        onTaskSaved={fetchTasks} 
      />
    </div>
  );
};

export default TaskList;

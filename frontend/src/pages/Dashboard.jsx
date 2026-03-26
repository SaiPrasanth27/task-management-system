import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/api';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const anRes = await api.get('/tasks/analytics');
        setAnalytics(anRes.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };
    fetchAnalytics();
  }, []);

  if (!analytics) return <div className="p-16 text-center text-slate-500 font-medium">Loading your dashboard insights...</div>;

  // Data for Pie Chart (Status Distribution)
  const statusData = [
    { name: 'Completed', value: analytics.completed, color: '#10b981' },
    { name: 'Pending', value: analytics.pending, color: '#f59e0b' }
  ].filter(item => item.value > 0);

  // Data for Bar Chart (Priority)
  const priorityData = [
    { name: 'Low', count: analytics.priorities?.Low || 0, fill: '#3b82f6' },
    { name: 'Medium', count: analytics.priorities?.Medium || 0, fill: '#6366f1' },
    { name: 'High', count: analytics.priorities?.High || 0, fill: '#ef4444' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 lg:mt-12">
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-8">Analytics Dashboard</h2>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        
        {/* Status Area */}
        <div className="bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-6 text-center">Status Distribution</h3>
          {analytics.total > 0 ? (
            <>
              <div className="w-full h-[300px]">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie 
                      data={statusData} 
                      innerRadius={70} 
                      outerRadius={110} 
                      paddingAngle={5} 
                      dataKey="value"
                      stroke="none"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 text-sm font-medium mt-4">
                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Completed</span>
                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Pending</span>
              </div>
            </>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400">No tasks to compute metrics for.</div>
          )}
        </div>

        {/* Priority Area */}
        <div className="bg-white dark:bg-darkcard border border-slate-200 dark:border-darkborder p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-6 text-center">Tasks By Priority</h3>
          <div className="w-full h-[300px]">
             {analytics.total > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={priorityData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                    <XAxis dataKey="name" tick={{fill: '#94a3b8', fontSize: 13}} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{fill: '#94a3b8', fontSize: 13}} axisLine={false} tickLine={false} />
                    <RechartsTooltip cursor={{fill: 'rgba(148, 163, 184, 0.1)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ResponsiveContainer>
             ) : (
               <div className="h-full flex items-center justify-center text-slate-400">Begin adding tasks to see charts.</div>
             )}
          </div>
        </div>
      </div>

      {/* Quick Stats section */}
      <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">Quick Overview</h3>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 p-8 rounded-2xl text-center flex flex-col justify-center items-center gap-2 shadow-sm transition-transform hover:-translate-y-1">
          <div className="text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider text-xs">Total Assigned</div>
          <div className="text-5xl font-black text-indigo-700 dark:text-indigo-300">{analytics.total}</div>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 p-8 rounded-2xl text-center flex flex-col justify-center items-center gap-2 shadow-sm transition-transform hover:-translate-y-1">
          <div className="text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider text-xs">Completed Successfully</div>
          <div className="text-5xl font-black text-emerald-700 dark:text-emerald-300">{analytics.completed}</div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-8 rounded-2xl text-center flex flex-col justify-center items-center gap-2 shadow-sm transition-transform hover:-translate-y-1">
          <div className="text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider text-xs">Pending Action</div>
          <div className="text-5xl font-black text-amber-700 dark:text-amber-300">{analytics.pending}</div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;

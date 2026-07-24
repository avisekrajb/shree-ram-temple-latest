import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AdminLogsContext = createContext(null);

export const useAdminLogs = () => {
  const context = useContext(AdminLogsContext);
  if (!context) {
    throw new Error('useAdminLogs must be used within AdminLogsProvider');
  }
  return context;
};

export const AdminLogsProvider = ({ children }) => {
  const { showToast } = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
  });

  // Fetch logs
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/activity');
      const logsData = response.data || [];
      setLogs(logsData);
      
      // Calculate stats
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      setStats({
        total: logsData.length,
        today: logsData.filter(l => new Date(l.timestamp) >= today).length,
        thisWeek: logsData.filter(l => new Date(l.timestamp) >= weekAgo).length,
        thisMonth: logsData.filter(l => new Date(l.timestamp) >= monthAgo).length,
      });
    } catch (error) {
      console.error('Error fetching admin logs:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new log entry
  const addLog = useCallback(async (action, details = {}) => {
    try {
      const response = await api.post('/admin/activity/log', {
        action,
        details,
        timestamp: new Date().toISOString(),
      });
      setLogs(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error adding log:', error);
      // Don't show toast for log errors
      return null;
    }
  }, []);

  // Get logs by type
  const getLogsByType = useCallback((type) => {
    return logs.filter(log => log.action?.includes(type) || log.type === type);
  }, [logs]);

  // Get recent logs
  const getRecentLogs = useCallback((limit = 10) => {
    return logs.slice(0, limit);
  }, [logs]);

  // Clear logs (admin only)
  const clearLogs = useCallback(async () => {
    if (!window.confirm('Are you sure you want to clear all admin logs?')) return;
    try {
      await api.delete('/admin/activity');
      setLogs([]);
      setStats({ total: 0, today: 0, thisWeek: 0, thisMonth: 0 });
      showToast('Admin logs cleared successfully', 'success');
    } catch (error) {
      console.error('Error clearing logs:', error);
      showToast('Failed to clear logs', 'error');
    }
  }, [showToast]);

  // Initial fetch
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <AdminLogsContext.Provider
      value={{
        logs,
        loading,
        stats,
        fetchLogs,
        addLog,
        getLogsByType,
        getRecentLogs,
        clearLogs,
      }}
    >
      {children}
    </AdminLogsContext.Provider>
  );
};
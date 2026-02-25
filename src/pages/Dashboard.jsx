import React from "react";
import { Plus, CheckCircle, Clock, TrendingUp, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = ({ tasks, users, activities }) => {
  const navigate = useNavigate();

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t.progress === 100).length || 0;
  const inProgressTasks = tasks?.filter(t => t.progress > 0 && t.progress < 100).length || 0;
  const notStartedTasks = tasks?.filter(t => t.progress === 0).length || 0;
  const totalUsers = users?.length || 0;
  const activeUsers = users?.filter(u => u.status === "Active").length || 0;

  const currentUser = users?.find(u => u.status === "Active");
  const myTasks = tasks?.filter(t => t.assignedUser === currentUser?.name) || [];

  const avgProgress = totalTasks > 0
    ? Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / totalTasks)
    : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">{getGreeting()}! 👋</h1>
          <p className="dashboard-subtitle">Here's what's happening with your tasks today.</p>
        </div>
        <button onClick={() => navigate("/new-activity")} className="dashboard-primary-btn">
          <Plus size={18} />
          New Task
        </button>
      </div>

      <div className="dashboard-stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon-wrapper stat-icon-primary">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Total Tasks</h3>
            <p className="stat-value">{totalTasks}</p>
            <p className="stat-subtitle">{completedTasks} completed</p>
          </div>
          <div className="stat-progress-ring">
            <svg width="60" height="60" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="26" fill="none" stroke="var(--border-color)" strokeWidth="4" />
              <circle
                cx="30" cy="30" r="26"
                fill="none"
                stroke="var(--accent-primary)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={163.36}
                strokeDashoffset={163.36 - (163.36 * avgProgress / 100)}
                transform="rotate(-90 30 30)"
              />
            </svg>
            <span className="stat-percent">{avgProgress}%</span>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon-wrapper stat-icon-success">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-title">In Progress</h3>
            <p className="stat-value">{inProgressTasks}</p>
            <p className="stat-subtitle">{notStartedTasks} not started</p>
          </div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-icon-wrapper stat-icon-info">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Active Users</h3>
            <p className="stat-value">{activeUsers}</p>
            <p className="stat-subtitle">{totalUsers} total users</p>
          </div>
        </div>
      </div>

      {myTasks.length > 0 && (
        <div className="dashboard-card">
          <div className="card-header-row">
            <h3 className="card-title">My Tasks ({myTasks.length})</h3>
            <span className="card-subtitle">Assigned to {currentUser?.name}</span>
          </div>
          <div className="my-tasks-list">
            {myTasks.slice(0, 3).map((task) => (
              <div key={task.id} className="my-task-item">
                <div className="my-task-info">
                  <h4 className="my-task-title">{task.title}</h4>
                  <div className="my-task-meta">
                    {task.date && <span>Due: {task.date}</span>}
                    {task.priority && <span className={`task-priority-dot priority-${task.priority?.toLowerCase()}`}></span>}
                  </div>
                </div>
                <div className="my-task-progress">
                  <span className="progress-text">{task.progress}%</span>
                  <div className="mini-progress-bar">
                    <div className="mini-progress-fill" style={{ width: `${task.progress}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
            {myTasks.length > 3 && (
              <button onClick={() => navigate("/edit-task")} className="view-all-tasks-btn">
                View all {myTasks.length} tasks →
              </button>
            )}
          </div>
        </div>
      )}

      <div className="dashboard-grid-secondary">
        <div className="dashboard-card quick-actions-card">
          <h3 className="card-title">Quick Actions</h3>
          <div className="quick-actions-grid">
            <button onClick={() => navigate("/new-activity")} className="quick-action-btn">
              <Plus size={20} />
              <span>Create Task</span>
            </button>
            <button onClick={() => navigate("/edit-task")} className="quick-action-btn">
              <CheckCircle size={20} />
              <span>Update Progress</span>
            </button>
            <button onClick={() => navigate("/manage-user")} className="quick-action-btn">
              <Calendar size={20} />
              <span>Manage Users</span>
            </button>
            <button onClick={() => navigate("/report")} className="quick-action-btn">
              <TrendingUp size={20} />
              <span>View Reports</span>
            </button>
          </div>
        </div>

        <div className="dashboard-card recent-activity-card">
          <h3 className="card-title">Recent Activity</h3>
          <div className="recent-activity-list">
            {activities && activities.length > 0 ? (
              activities.slice(0, 4).map((activity) => (
                <div key={activity.id} className="activity-row">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <p className="activity-text">{activity.text}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="activity-empty">
                <p className="text-muted">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

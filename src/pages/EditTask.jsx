import React, { useState, useMemo } from "react";
import { Trash2, AlertCircle, Filter, Tag } from "lucide-react";
import "./EditTask.css";

const EditTask = ({ tasks, onUpdateTask, onDeleteTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tempProgress, setTempProgress] = useState(0);

  // Filter and sort states
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterTag, setFilterTag] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [showFilters, setShowFilters] = useState(false);

  const isTaskOverdue = (taskDate) => {
    if (!taskDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(taskDate);
    return dueDate < today;
  };

  // Get all unique tags from tasks
  const allTags = useMemo(() => {
    const tags = new Set();
    tasks?.forEach(task => {
      task.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [tasks]);

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = [...(tasks || [])];

    // Apply status filter
    if (filterStatus !== "all") {
      if (filterStatus === "completed") {
        filtered = filtered.filter(t => t.progress === 100);
      } else if (filterStatus === "in-progress") {
        filtered = filtered.filter(t => t.progress > 0 && t.progress < 100);
      } else if (filterStatus === "not-started") {
        filtered = filtered.filter(t => t.progress === 0);
      } else if (filterStatus === "overdue") {
        filtered = filtered.filter(t => isTaskOverdue(t.date));
      }
    }

    // Apply priority filter
    if (filterPriority !== "all") {
      filtered = filtered.filter(t => t.priority === filterPriority);
    }

    // Apply tag filter
    if (filterTag !== "all") {
      filtered = filtered.filter(t => t.tags?.includes(filterTag));
    }

    // Sort tasks
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(a.date || 0) - new Date(b.date || 0);
      } else if (sortBy === "priority") {
        const priorityOrder = { "Urgent": 4, "High": 3, "Medium": 2, "Low": 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortBy === "progress") {
        return b.progress - a.progress;
      } else if (sortBy === "name") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return filtered;
  }, [tasks, filterStatus, filterPriority, filterTag, sortBy]);

  const clearFilters = () => {
    setFilterStatus("all");
    setFilterPriority("all");
    setFilterTag("all");
  };

  const openModal = (task) => {
    setSelectedTask(task);
    setTempProgress(task.progress);
    setIsModalOpen(true);
  };

  const openDeleteModal = (task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedTask(null);
  };

  const handleDelete = () => {
    if (onDeleteTask && selectedTask) {
      onDeleteTask(selectedTask.id);
      closeDeleteModal();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleSave = () => {
    if (onUpdateTask && selectedTask) {
      onUpdateTask(selectedTask.id, parseInt(tempProgress));
      closeModal();
    }
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="edit-task-container">
        <h2 className="edit-task-title">Edit Task Progress</h2>
        <div className="empty-tasks">
          <p>No tasks found. Please create a new activity first.</p>
        </div>
      </div>
    );
  }

  const hasActiveFilters = filterStatus !== "all" || filterPriority !== "all" || filterTag !== "all";

  return (
    <div className="edit-task-container">
      <div className="edit-task-header">
        <h2 className="edit-task-title">Edit Task Progress</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
        >
          <Filter size={18} />
          Filters
          {hasActiveFilters && <span className="filter-badge"></span>}
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-grid">
            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Tasks</option>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Priority</label>
              <select
                className="filter-select"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Tag</label>
              <select
                className="filter-select"
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
              >
                <option value="all">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Due Date</option>
                <option value="priority">Priority</option>
                <option value="progress">Progress</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {filteredAndSortedTasks.length === 0 ? (
        <div className="empty-tasks">
          <p>No tasks match your filters.</p>
          {hasActiveFilters && <button onClick={clearFilters} className="text-link">Clear filters</button>}
        </div>
      ) : (
        <div className="tasks-grid">
          {filteredAndSortedTasks.map((task) => (
            <div key={task.id} className={`task-card ${isTaskOverdue(task.date) ? 'overdue' : ''}`}>
              <div className="task-header">
                <div>
                  <div className="task-title-row">
                    <h3 className="task-name">{task.title}</h3>
                    {isTaskOverdue(task.date) && (
                      <span className="overdue-badge">
                        <AlertCircle size={14} />
                        Overdue
                      </span>
                    )}
                    <span className={`priority-badge priority-${task.priority?.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="task-meta">
                    ID: #{task.id}
                    {task.date && ` • Due: ${task.date}`}
                    {task.assignedUser && ` • Assigned to: ${task.assignedUser}`}
                  </p>
                  {task.tags && task.tags.length > 0 && (
                    <div className="task-tags">
                      {task.tags.map(tag => (
                        <span key={tag} className="task-tag">
                          <Tag size={12} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="task-percentage">{task.progress}%</span>
              </div>

              <div className="task-progress-bar">
                <div
                  className="task-progress-fill"
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>

              <div className="task-controls">
                <button onClick={() => openModal(task)} className="update-btn">
                  Update Progress
                </button>
                <button onClick={() => openDeleteModal(task)} className="delete-btn">
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && selectedTask && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Update Progress</h3>
              <p className="modal-subtitle">{selectedTask.title}</p>
            </div>
            <div className="modal-body">
              <div className="progress-display">
                <span className="form-label">Completion</span>
                <span className="progress-value-label">{tempProgress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={tempProgress}
                onChange={(e) => setTempProgress(e.target.value)}
                className="task-range-input"
              />
            </div>
            <div className="modal-footer">
              <button onClick={closeModal} className="modal-btn cancel">
                Cancel
              </button>
              <button onClick={handleSave} className="modal-btn confirm">
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && selectedTask && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Delete Task</h3>
              <p className="modal-subtitle">{selectedTask.title}</p>
            </div>
            <div className="modal-body">
              <p className="delete-warning">Are you sure you want to delete this task? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button onClick={closeDeleteModal} className="modal-btn cancel">
                Cancel
              </button>
              <button onClick={handleDelete} className="modal-btn confirm delete">
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTask;

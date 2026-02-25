import React, { useState } from "react";
import { Trash2, AlertCircle } from "lucide-react";
import "./EditTask.css";

const EditTask = ({ tasks, onUpdateTask, onDeleteTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tempProgress, setTempProgress] = useState(0);

  const isTaskOverdue = (taskDate) => {
    if (!taskDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(taskDate);
    return dueDate < today;
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

  return (
    <div className="edit-task-container">
      <h2 className="edit-task-title">Edit Task Progress</h2>

      <div className="tasks-grid">
        {tasks.map((task) => (
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
                </div>
                <p className="task-id">ID: #{task.id} {task.date && `• Due: ${task.date}`}</p>
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

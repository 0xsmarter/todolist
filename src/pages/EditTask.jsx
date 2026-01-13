import React, { useState } from "react";
import "./EditTask.css";

const EditTask = ({ tasks, onUpdateTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tempProgress, setTempProgress] = useState(0);

  const openModal = (task) => {
    setSelectedTask(task);
    setTempProgress(task.progress);
    setIsModalOpen(true);
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
          <div key={task.id} className="task-card">
            <div className="task-header">
              <div>
                <h3 className="task-name">{task.title}</h3>
                <p className="task-id">ID: #{task.id}</p>
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
    </div>
  );
};

export default EditTask;

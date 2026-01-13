import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NewActivity.css";

const NewActivity = ({ onAddTask }) => {
  const navigate = useNavigate();
  const [activityName, setActivityName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("Low");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAddTask) {
      onAddTask({ title: activityName, description, date, priority });
      navigate("/edit-task");
    }
  };

  return (
    <div className="new-activity-container">
      <h2 className="new-activity-title">Create New Activity</h2>

      <form
        onSubmit={handleSubmit}
        className="activity-form"
      >
        <div className="form-group">
          <label className="form-label">
            Activity Name
          </label>
          <input
            type="text"
            placeholder="e.g., Weekly Sprint Review"
            className="form-input"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Description
          </label>
          <textarea
            rows="4"
            placeholder="Describe the activity..."
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Date
            </label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Priority
            </label>
            <select
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
          >
            Create Activity
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewActivity;

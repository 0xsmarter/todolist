import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import "./NewActivity.css";

const NewActivity = ({ onAddTask, users }) => {
  const navigate = useNavigate();
  const [activityName, setActivityName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [assignedUser, setAssignedUser] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAddTask) {
      onAddTask({
        title: activityName,
        description,
        date,
        priority,
        assignedUser,
        tags
      });
      navigate("/edit-task");
    }
  };

  const handleCancel = () => {
    setActivityName("");
    setDescription("");
    setDate("");
    setPriority("Low");
    setAssignedUser("");
    setTags([]);
    setTagInput("");
    navigate("/dashboard");
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

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Assign To
            </label>
            <select
              className="form-select"
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
            >
              <option value="">Unassigned</option>
              {users?.filter(u => u.status === "Active").map(user => (
                <option key={user.id} value={user.name}>{user.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Tags
          </label>
          <div className="tags-input-container">
            <div className="tags-list">
              {tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="tag-remove"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="tag-input-row">
              <input
                type="text"
                placeholder="Add a tag..."
                className="form-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="add-tag-btn"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
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

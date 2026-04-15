import React, { useState } from "react";
import {
  Plus,
  FolderKanban,
  CheckCircle2,
  Clock,
  ListChecks,
  ChevronDown,
  X,
  Trash2,
  Search,
  Calendar,
  Users,
  AlertTriangle,
} from "lucide-react";
import "./NewProject.css";

const PROJECT_COLORS = [
  "#f97316",
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
  "#8b5cf6",
];

const PRIORITY_LABELS = ["Low", "Medium", "High"];

const initTaskForm = () => ({
  title: "",
  assigneeId: "",
  priority: "Medium",
  dueDate: "",
});

const calcProgress = (tasks) => {
  if (!tasks.length) return 0;
  const done = tasks.filter((t) => t.done).length;
  return Math.round((done / tasks.length) * 100);
};

const getDeadlineInfo = (dateStr, createdAt) => {
  if (!dateStr) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dateStr + "T00:00:00");
  due.setHours(0, 0, 0, 0);
  const diffMs = due - now;
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  let urgency, label, color;
  if (daysLeft < 0) {
    urgency = "overdue";
    label = `${Math.abs(daysLeft)}d overdue`;
    color = "var(--danger)";
  } else if (daysLeft === 0) {
    urgency = "today";
    label = "Due today";
    color = "var(--danger)";
  } else if (daysLeft <= 2) {
    urgency = "urgent";
    label = `${daysLeft}d left`;
    color = "var(--warning)";
  } else if (daysLeft <= 7) {
    urgency = "soon";
    label = `${daysLeft}d left`;
    color = "var(--info)";
  } else {
    urgency = "safe";
    label = `${daysLeft}d left`;
    color = "var(--success)";
  }

  let elapsed = 0;
  if (createdAt) {
    const created = new Date(createdAt);
    created.setHours(0, 0, 0, 0);
    const total = due - created;
    const passed = now - created;
    elapsed = total > 0 ? Math.min(100, Math.round((passed / total) * 100)) : 100;
  }

  return { urgency, label, color, daysLeft, elapsed };
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

function Toast({ msg }) {
  if (!msg) return null;
  return <div className="project-toast">{msg}</div>;
}

function StatsRow({ projects }) {
  const totalTasks = projects.reduce((s, p) => s + p.tasks.length, 0);
  const doneTasks = projects.reduce(
    (s, p) => s + p.tasks.filter((t) => t.done).length,
    0,
  );
  const active = projects.filter((p) => p.status === "Active").length;

  const stats = [
    {
      label: "Projects",
      value: projects.length,
      icon: <FolderKanban />,
      variant: "accent",
    },
    { label: "Active", value: active, icon: <Clock />, variant: "success" },
    { label: "Tasks", value: totalTasks, icon: <ListChecks />, variant: "info" },
    {
      label: "Completed",
      value: doneTasks,
      icon: <CheckCircle2 />,
      variant: "warning",
    },
  ];

  return (
    <div className="projects-stats-grid">
      {stats.map(({ label, value, icon, variant }) => (
        <div className="project-stat-card" key={label}>
          <div className={`project-stat-icon ${variant}`}>{icon}</div>
          <div className="project-stat-label">{label}</div>
          <div className="project-stat-value">{value}</div>
        </div>
      ))}
    </div>
  );
}

function AddTaskForm({ users, onAdd }) {
  const [form, setForm] = useState(initTaskForm());

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    onAdd({ ...form, id: Date.now(), done: false });
    setForm(initTaskForm());
  };

  return (
    <div className="add-task-form">
      <input
        className="task-title-input"
        placeholder="Task title..."
        value={form.title}
        onChange={(e) => set("title", e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <select
        value={form.assigneeId}
        onChange={(e) => set("assigneeId", e.target.value)}
      >
        <option value="">Assignee</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>
      <div className="task-date-inline">
        <Calendar size={13} />
        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => set("dueDate", e.target.value)}
        />
      </div>
      <select
        value={form.priority}
        onChange={(e) => set("priority", e.target.value)}
      >
        {PRIORITY_LABELS.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>
      <button type="button" className="add-task-btn" onClick={handleSubmit}>
        <Plus size={14} style={{ marginRight: 4 }} />
        Add
      </button>
    </div>
  );
}

function TaskDeadlineBadge({ dueDate, done }) {
  if (!dueDate) return null;
  if (done) return <span className="task-due">{formatDate(dueDate)}</span>;
  const dl = getDeadlineInfo(dueDate);
  if (!dl) return <span className="task-due">{formatDate(dueDate)}</span>;
  return (
    <span className={`task-deadline-badge urgency-${dl.urgency}`}>
      {(dl.urgency === "overdue" || dl.urgency === "today") && <AlertTriangle size={11} />}
      {dl.label}
    </span>
  );
}

function ProjectDeadlineStrip({ dueDate, createdAt }) {
  const hasDate = !!dueDate;
  const dl = hasDate ? getDeadlineInfo(dueDate, createdAt) : null;

  return (
    <div className={`project-deadline-strip ${hasDate ? `urgency-${dl.urgency}` : "urgency-none"}`}>
      <div className="deadline-strip-left">
        <Calendar size={13} />
        {hasDate ? (
          <>
            <span className="deadline-strip-date">{formatDate(dueDate)}</span>
            {dl.urgency === "overdue" || dl.urgency === "today"
              ? <AlertTriangle size={13} />
              : <Clock size={13} />
            }
            <span className="deadline-strip-label">{dl.label}</span>
          </>
        ) : (
          <span className="deadline-strip-label no-date">No deadline set</span>
        )}
      </div>
      {hasDate && createdAt && (
        <div className="deadline-time-bar">
          <div
            className="deadline-time-fill"
            style={{
              width: `${dl.elapsed}%`,
              background: dl.color,
            }}
          />
        </div>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  users,
  onDelete,
  onToggleTask,
  onDeleteTask,
  onAddTask,
  onChangeStatus,
}) {
  const [expanded, setExpanded] = useState(true);
  const progress = calcProgress(project.tasks);
  const assigneeName = (id) => {
    const u = users.find((u) => String(u.id) === String(id));
    return u ? u.name.split(" ")[0] : "—";
  };

  return (
    <div className="project-card">
      <div className="project-card-header">
        <div
          className="project-color-bar"
          style={{ background: project.color }}
        />
        <div className="project-info">
          <p className="project-name">{project.name}</p>
          {project.description && (
            <p className="project-desc">{project.description}</p>
          )}
        </div>
        <div className="project-actions">
          <select
            className="project-status-select"
            value={project.status}
            onChange={(e) => onChangeStatus(project.id, e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Done">Done</option>
          </select>
          <button
            className="project-delete-btn"
            onClick={() => onDelete(project.id)}
            title="Delete project"
          >
            <Trash2 size={14} />
          </button>
          <button
            className={`project-chevron ${expanded ? "open" : ""}`}
            onClick={() => setExpanded((v) => !v)}
          >
            <ChevronDown />
          </button>
        </div>
      </div>

      <div className="project-meta">
        <span>
          <span
            className="meta-dot"
            style={{ background: project.color }}
          />
          {project.tasks.length} task{project.tasks.length !== 1 ? "s" : ""}
        </span>
        <span>{project.tasks.filter((t) => t.done).length} done</span>
        <div className="project-progress-wrap">
          <div
            className="project-progress-fill"
            style={{ width: `${progress}%`, background: project.color }}
          />
        </div>
        <span className="project-progress-text">{progress}%</span>
      </div>

      <ProjectDeadlineStrip dueDate={project.dueDate} createdAt={project.createdAt} />

      {expanded && (
        <div className="project-tasks-area">
          <div className="project-tasks-header">
            <span className="project-tasks-title">Tasks</span>
          </div>

          {project.tasks.length === 0 ? (
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
              No tasks yet — add one below.
            </p>
          ) : (
            <div className="project-task-list">
              {project.tasks.map((task) => (
                <div className="project-task-item" key={task.id}>
                  <div
                    className={`task-check ${task.done ? "done" : ""}`}
                    onClick={() => onToggleTask(project.id, task.id)}
                  >
                    {task.done && <CheckCircle2 />}
                  </div>
                  <span className={`task-title ${task.done ? "done" : ""}`}>
                    {task.title}
                  </span>
                  <TaskDeadlineBadge dueDate={task.dueDate} done={task.done} />
                  <span
                    className={`task-priority-badge ${task.priority.toLowerCase()}`}
                  >
                    {task.priority}
                  </span>
                  {task.assigneeId && (
                    <span className="task-assignee">
                      {assigneeName(task.assigneeId)}
                    </span>
                  )}
                  <button
                    className="task-delete-btn"
                    onClick={() => onDeleteTask(project.id, task.id)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <AddTaskForm
            users={users}
            onAdd={(task) => onAddTask(project.id, task)}
          />
        </div>
      )}
    </div>
  );
}

function CreateProjectModal({ users, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "#f97316",
    priority: "Medium",
    dueDate: "",
    status: "Active",
    teamIds: [],
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleMember = (id) => {
    set(
      "teamIds",
      form.teamIds.includes(id)
        ? form.teamIds.filter((x) => x !== id)
        : [...form.teamIds, id],
    );
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onSubmit({
      ...form,
      id: Date.now(),
      tasks: [],
      createdAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div
      className="project-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="project-modal">
        <div className="project-modal-header">
          <span className="project-modal-title">New Project</span>
          <button className="project-modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-form-group">
          <label>Project name *</label>
          <input
            placeholder="e.g. Website Redesign"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            autoFocus
          />
        </div>

        <div className="modal-form-group">
          <label>Description</label>
          <textarea
            placeholder="What is this project about?"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>

        <div className="modal-form-group">
          <label>Priority</label>
          <div className="modal-priority-row">
            {PRIORITY_LABELS.map((p) => (
              <button
                key={p}
                className={`modal-priority-btn p-${p.toLowerCase()} ${form.priority === p ? "selected" : ""}`}
                onClick={() => set("priority", p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-form-group">
          <label>Due date</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => set("dueDate", e.target.value)}
          />
        </div>

        {users.length > 0 && (
          <div className="modal-form-group">
            <label>
              <Users
                size={14}
                style={{
                  marginRight: 6,
                  verticalAlign: "middle",
                  color: "var(--text-muted)",
                }}
              />
              Team members
            </label>
            <div className="modal-team-list">
              {users.map((u) => (
                <label
                  key={u.id}
                  className={`modal-team-item ${form.teamIds.includes(u.id) ? "checked" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={form.teamIds.includes(u.id)}
                    onChange={() => toggleMember(u.id)}
                  />
                  {u.name}
                  <span className="modal-team-role">{u.role}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <hr className="modal-divider" />

        <button type="button" className="modal-submit-btn" onClick={handleSubmit}>
          Create Project
        </button>
      </div>
    </div>
  );
}

export default function NewProject({
  projects,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  users,
  logActivity,
}) {
  const [localProjects, setLocalProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState("");
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  const isControlled = Array.isArray(projects);
  const allProjects = isControlled ? projects : localProjects;
  const setProjects = isControlled ? null : setLocalProjects;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  const handleAddProject = (project) => {
    if (isControlled && onAddProject) {
      onAddProject(project);
    } else {
      setLocalProjects((p) => [project, ...p]);
    }
    if (logActivity) logActivity(`Project '${project.name}' created`);
    showToast(`Project "${project.name}" created`);
  };

  const mutate = (fn) => {
    if (isControlled && onUpdateProject) {
      onUpdateProject(fn(allProjects));
    } else {
      setLocalProjects(fn);
    }
  };

  const handleDeleteProject = (id) => {
    const p = allProjects.find((x) => x.id === id);
    if (isControlled && onDeleteProject) {
      onDeleteProject(id);
    } else {
      setLocalProjects((list) => list.filter((x) => x.id !== id));
    }
    if (p && logActivity) logActivity(`Project '${p.name}' deleted`);
    showToast("Project deleted");
  };

  const handleChangeStatus = (projectId, status) => {
    mutate((list) =>
      list.map((p) => (p.id === projectId ? { ...p, status } : p)),
    );
  };

  const handleAddTask = (projectId, task) => {
    mutate((list) =>
      list.map((p) =>
        p.id === projectId ? { ...p, tasks: [...p.tasks, task] } : p,
      ),
    );
    if (logActivity) logActivity(`Task '${task.title}' added`);
    showToast(`Task "${task.title}" added`);
  };

  const handleToggleTask = (projectId, taskId) => {
    mutate((list) =>
      list.map((p) =>
        p.id === projectId
          ? {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id === taskId ? { ...t, done: !t.done } : t,
              ),
            }
          : p,
      ),
    );
  };

  const handleDeleteTask = (projectId, taskId) => {
    mutate((list) =>
      list.map((p) =>
        p.id === projectId
          ? { ...p, tasks: p.tasks.filter((t) => t.id !== taskId) }
          : p,
      ),
    );
  };

  const filtered = allProjects
    .filter((p) => tab === "all" || p.status === tab)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const tabs = [
    { key: "all", label: "All" },
    { key: "Active", label: "Active" },
    { key: "Paused", label: "Paused" },
    { key: "Done", label: "Done" },
  ];

  return (
    <div className="projects-container">
      <div className="projects-header">
        <div>
          <h1 className="projects-title">Projects</h1>
          <p className="projects-subtitle">
            {allProjects.length} project{allProjects.length !== 1 ? "s" : ""}{" "}
            total
          </p>
        </div>
        <button
          className="projects-primary-btn"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      <div className="projects-toolbar">
        <div className="projects-tabs">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              className={`projects-tab ${tab === key ? "active" : ""}`}
              onClick={() => setTab(key)}
            >
              {label}{" "}
              <span style={{ opacity: 0.6 }}>
                (
                {key === "all"
                  ? allProjects.length
                  : allProjects.filter((p) => p.status === key).length}
                )
              </span>
            </button>
          ))}
        </div>
        <div style={{ position: "relative" }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              pointerEvents: "none",
            }}
          />
          <input
            className="projects-search"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: "2rem" }}
          />
        </div>
      </div>

      <div>
        {filtered.length === 0 ? (
          <div className="projects-empty">
            <div className="projects-empty-icon">
              <FolderKanban size={24} />
            </div>
            <p className="projects-empty-text">
              {allProjects.length === 0
                ? "No projects yet. Create your first one!"
                : "No projects match your filter."}
            </p>
          </div>
        ) : (
          <div className="projects-list">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                users={users || []}
                onDelete={handleDeleteProject}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onAddTask={handleAddTask}
                onChangeStatus={handleChangeStatus}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CreateProjectModal
          users={users || []}
          onClose={() => setShowModal(false)}
          onSubmit={handleAddProject}
        />
      )}

      <Toast msg={toast} />
    </div>
  );
}

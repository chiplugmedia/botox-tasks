import { useCallback, useEffect, useState } from "react";
import {
  baseControlClasses,
  DEFAULT_TASK,
  priorityStyles,
} from "../assets/dummy";
import { PlusCircle, X, Save, AlignLeft, Flag, Calculator } from "lucide-react";

const API_BASE = "http://localhost:4000/api/tasks";

const TaskModel = ({ isOpen, onClose, taskToEdit, onSave, onLogout }) => {
  const [taskData, setTaskData] = useState(DEFAULT_TASK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!isOpen) return;

    if (taskToEdit) {
      const normalizedCompleted =
        taskToEdit.completed === "Yes" || taskToEdit.completed === true
          ? "Yes"
          : "No";

      setTaskData({
        ...DEFAULT_TASK,
        title: taskToEdit.title || "",
        description: taskToEdit.description || "",
        priority: (taskToEdit.priority || "low"),
        dueDate: taskToEdit.dueDate?.split("T")[0] || "",
        completed: normalizedCompleted,
        id: taskToEdit._id,
      });
    } else {
      setTaskData(DEFAULT_TASK);
    }

    setError(null);
  }, [isOpen, taskToEdit]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const getHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (taskData.dueDate < today) {
        setError("Due date cannot be in the past");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const isEdit = Boolean(taskData.id);
        const url = isEdit ? `${API_BASE}/${taskData.id}/gp` : `${API_BASE}/gp`;

        const resp = await fetch(url, {
          method: isEdit ? "PUT" : "POST",
          headers: getHeaders(),
          body: JSON.stringify(taskData),
        });

        if (!resp.ok) {
          if (resp.status === 401) return onLogout?.();
          const err = await resp.json();
          throw new Error(err.message || "Failed to save task");
        }

        const saved = await resp.json();
        onSave?.(saved);
        onClose();
      } catch (err) {
        console.error(err);
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    },
    [taskData, today, getHeaders, onLogout, onSave, onClose]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 bg-white border border-blue-100 rounded-xl shadow animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
            {taskData.id ? (
              <Save className="w-5 h-5 text-blue-500" />
            ) : (
              <PlusCircle className="w-5 h-5 text-blue-500" />
            )}
            {taskData.id ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 transition-colors rounded-lg hover:text-blue-700 hover:bg-blue-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Task Title
            </label>
            <div className="flex items-center px-3 py-2.5 border border-blue-100 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-700">
              <input
                type="text"
                name="title"
                required
                value={taskData.title}
                onChange={handleChange}
                className="w-full text-sm focus:outline-none"
                placeholder="Enter Task title"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-1 mb-1 text-sm font-medium text-gray-700">
              <AlignLeft className="w-4 h-4 text-blue-500" />
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              onChange={handleChange}
              value={taskData.description}
              className={baseControlClasses}
              placeholder="Add details about your task"
            />
          </div>

          {/* Priority & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 mb-1 text-sm font-medium text-gray-700">
                <Flag className="w-4 h-4 text-blue-500" />
                Priority
              </label>
              <select
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
                className={`${baseControlClasses} ${
                  priorityStyles[taskData.priority]
                }`}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-1 mb-1 text-sm font-medium text-gray-700">
                <Calculator className="w-4 h-4 text-blue-500" />
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                required
                min={today}
                value={taskData.dueDate}
                onChange={handleChange}
                className={baseControlClasses}
              />
            </div>
          </div>

          {/* Completed Radio */}
          <div className="flex gap-4">
            {[
              { val: "Yes", label: "Completed" },
              { val: "No", label: "In Progress" },
            ].map(({ val, label }) => (
              <label key={val} className="flex items-center">
                <input
                  type="radio"
                  name="completed"
                  value={val}
                  checked={taskData.completed === val}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-fuchsia-500 to-blue-600 text-white
            font-medium py-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50
            hover:shadow-md transition-all duration-200"
          >
            {loading ? (
              "Saving..."
            ) : taskData.id ? (
              <>
                <Save className="w-4 h-4" />
                Update Task
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                Create Task
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModel;

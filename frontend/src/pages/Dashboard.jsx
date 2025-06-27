import React, { useCallback, useMemo, useState } from "react";
import {
  ADD_BUTTON,
  EMPTY_STATE,
  FILTER_LABELS,
  FILTER_OPTIONS,
  FILTER_WRAPPER,
  HEADER,
  ICON_WRAPPER,
  LABEL_CLASS,
  SELECT_CLASSES,
  STAT_CARD,
  STATS,
  STATS_GRID,
  TAB_ACTIVE,
  TAB_BASE,
  TAB_INACTIVE,
  TABS_WRAPPER,
  VALUE_CLASS,
  WRAPPER,
} from "../assets/dummy";
import { CalculatorIcon, Filter, HomeIcon, Plus } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import TaskItem from "../components/TaskItem";
import axios from "axios";
import TaskModel from "../components/TaskModel";

const API_BASE = "http://localhost:4000/api/tasks";

const Dashboard = () => {
  const { tasks, refreshTasks } = useOutletContext();
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState("all");

  const stats = useMemo(
    () => ({
      total: tasks.length,
      low: tasks.filter((t) => t.priority?.toLowerCase() === "low").length,
      medium: tasks.filter((t) => t.priority?.toLowerCase() === "medium")
        .length,
      high: tasks.filter((t) => t.priority?.toLowerCase() === "high").length,
      completed: tasks.filter(
        (t) =>
          t.completed === true ||
          t.completed === 1 ||
          (typeof t.completed === "string" &&
            t.completed.toLowerCase() === "yes")
      ).length,
    }),
    [tasks]
  );

  // FILTER TASKS
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      switch (filter) {
        case "today":
          return dueDate.toDateString() === today.toDateString();
        case "week":
          return dueDate >= today && dueDate <= nextWeek;
        case "high":
        case "medium":
        case "low":
          return task.priority?.toLowerCase() === filter;
        default:
          return true;
      }
    });
  }, [tasks, filter]);

  // SAVE TASK HANDLER
  const handleTaskSave = useCallback(
    async (taskData) => {
      try {
        if (taskData.id) {
          await axios.put(`${API_BASE}/${taskData.id}/gp`, taskData);
        } else {
          await axios.post(`${API_BASE}/gp`, taskData);
        }
        refreshTasks();
        setShowModal(false);
        setSelectedTask(null);
      } catch (error) {
        console.error("Error Saving tasks", error);
      }
    },
    [refreshTasks]
  );

  return (
    <div className={WRAPPER}>
      {/* HEADER */}
      <div className={HEADER}>
        <div className="min-w-0">
          <h1 className="text-xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <HomeIcon className="text-blue-500 w-5 h-5 md:w-6 md:h-6 shrink-0" />
            <span className="truncate">Task Overview</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-7 truncate">
            Manage Your tasks efficiently
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className={ADD_BUTTON}>
          <Plus size={18} />
          Add New Task
        </button>
      </div>

      {/* STATS */}
      <div className={STATS_GRID}>
        {STATS.map(
          ({
            key,
            label,
            icon: Icon,
            iconColor,
            borderColor = "border-purple-100",
            valueKey,
            textColor,
            gradient,
          }) => (
            <div key={key} className={`${STAT_CARD} ${borderColor}`}>
              <div className="flex items-center gap-2 md:gap-3">
                <div className={`${ICON_WRAPPER} ${iconColor}`}>
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="min-w-0">
                  <p
                    className={`${VALUE_CLASS} ${
                      gradient
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
                        : textColor
                    }`}
                  >
                    {stats[valueKey]}
                  </p>
                  <p className={LABEL_CLASS}>{label}</p>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* TASK CONTENT */}
      <div className="space-y-6">
        {/* FILTER SECTION */}
        <div className={FILTER_WRAPPER}>
          <div className="flex items-center gap-2 min-w-0">
            <Filter className="w-5 h-5 text-blue-500 shrink-0" />
            <h2 className="text-base md:text-lg font-semibold text-gray-800 truncate">
              {FILTER_LABELS[filter]}
            </h2>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={SELECT_CLASSES}
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
          <div className={TABS_WRAPPER}>
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`${TAB_BASE} ${
                  filter === opt ? TAB_ACTIVE : TAB_INACTIVE
                }`}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* TASK LIST */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className={EMPTY_STATE.wrapper}>
              <div className={EMPTY_STATE.iconWrapper}>
                <CalculatorIcon className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No Tasks Found
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {filter === "all"
                  ? "Create your first task to get started"
                  : "No tasks match this filter"}
              </p>
              <button
                onClick={() => setShowModal(true)}
                className={EMPTY_STATE.btn}
              >
                Add New Task
              </button>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id || task._id}
                task={task}
                onRefresh={refreshTasks}
                showCompleteCheckbox
                onEdit={() => {
                  setSelectedTask(task);
                  setShowModal(true);
                }}
              />
            ))
          )}
        </div>

        {/* ADD TASK BUTTON (DESKTOP VIEW) */}
        <div
          onClick={() => setShowModal(true)}
          className="hidden md:flex items-center justify-center p-4 border-2 border-dashed border-blue-100
          rounded-xl hover:border-blue-400 bg-blue-50/50 cursor-pointer transition-colors"
        >
          <Plus className="w-5 h-5 text-blue-500 mr-2" />
          <span className="text-gray-600 font-medium">Add New Task</span>
        </div>
      </div>

      {/* TASK MODAL */}
      <TaskModel
        isOpen={showModal || !!selectedTask}
        onClose={() => {
          setShowModal(false);
          setSelectedTask(null);
        }}
        taskToEdit={selectedTask}
        onSave={handleTaskSave}
      />
    </div>
  );
};

export default Dashboard;

import React, { useMemo, useState } from "react";
import { CT_CLASSES, SORT_OPTIONS } from "../assets/dummy";
import { CheckCircle2, Filter } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import TaskItem from "../components/TaskItem";

const CompletePage = () => {
  const { tasks, refreshTasks } = useOutletContext();
  const [sortBy, setSortBy] = useState("Newest");

  const sortedCompletedTasks = useMemo(() => {
    return tasks
      .filter((task) =>
        [true, 1, "yes"].includes(
          typeof task.completed === "string"
            ? task.completed.toLowerCase()
            : task.completed
        )
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "oldest":
            return new Date(a.createdAt) - new Date(b.createdAt);
          case "priority": {
            const order = { high: 3, medium: 2, low: 1 };
            return (
              order[b.priority?.toLowerCase()] -
              order[a.priority?.toLowerCase()]
            );
          }
          default:
            return 0;
        }
      });
  }, [tasks, sortBy]);

  return (
    <div className={CT_CLASSES.page}>
      {/* Header */}
      <div className={CT_CLASSES.header}>
        <div className={CT_CLASSES.titleWrapper}>
          <h1 className={CT_CLASSES.title}>
            <CheckCircle2 className="text-blue-500 w-5 h-5 md:w-6 md:h-6" />
            <span className="truncate">Completed Tasks</span>
          </h1>
          <p className={CT_CLASSES.subtitle}>
            {sortedCompletedTasks.length} task{" "}
            {sortedCompletedTasks.length !== 1 && "s"} needing your attention
          </p>
        </div>
        {/* SORT COMPLETE */}
        <div className={CT_CLASSES.sortContainer}>
          <div className={CT_CLASSES.sortBox}>
            <div className={CT_CLASSES.filterLabel}>
              <Filter className="w-4 h-4 text-blue-500" />
              <span className="text-sm md:text-sm">Sort By:</span>
            </div>

            {/* Mobile Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={CT_CLASSES.select}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* DESTOP BUTTON*/}
            <div className={CT_CLASSES.btnGroup}>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={[
                    CT_CLASSES.btnGroup,
                    sortBy === opt.id
                      ? CT_CLASSES.btnActive
                      : CT_CLASSES.btnInactive,
                  ].join(" ")}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* TASK LIST */}
      <div className={CT_CLASSES.list}>
        {sortedCompletedTasks.length === 0? (
          <div className={CT_CLASSES.emptyState}>
<div className={CT_CLASSES.emptyIconWrapper}>
<CheckCircle2 className="w-6 h-6 md:w-5 md:h-5 text-blue-500" />
</div>
<h2 className={CT_CLASSES.emptyTitle}>
No completed task yet!
</h2>
<p className={CT_CLASSES.emptyText}>
complete some table and they'll appear here
</p>
          </div>
        ) : (
          sortedCompletedTasks.map(task => (
            <TaskItem key={task._id || task._id }
            task={task}
            onRefresh={refreshTasks}
            showCompleteCheckbox={false}
            className="oparity-50 hover opacity-100 transition-opacity text-sm
            md:text-base" />
          ))
        )}
        </div>
    </div>
  );
};

export default CompletePage;

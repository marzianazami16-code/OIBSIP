/* =========================================================
   TASKFLOW - TO-DO WEB APP
   OASIS INFOBYTE - Level 2 Task 3
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // =====================================================
  // DOM ELEMENTS
  // =====================================================

  const taskForm = document.getElementById("taskForm");
  const taskInput = document.getElementById("taskInput");
  const prioritySelect = document.getElementById("prioritySelect");
  const categorySelect = document.getElementById("categorySelect");
  const dueDateInput = document.getElementById("dueDate");

// Advanced Statistics
const completionRate = document.getElementById("completionRate");
const highPriorityCount = document.getElementById("highPriorityCount");
const dueSoonCount = document.getElementById("dueSoonCount");
const categoryCount = document.getElementById("categoryCount");




  const pendingTasks = document.getElementById("pendingTasks");
  const completedTasks = document.getElementById("completedTasks");

  const pendingCount = document.getElementById("pendingCount");
  const completedCount = document.getElementById("completedCount");
  const totalCount = document.getElementById("totalCount");
  const progressPercentage = document.getElementById("progressPercentage");
  const progressBar = document.getElementById("progressBar");

  const pendingBadge = document.getElementById("pendingBadge");
  const completedBadge = document.getElementById("completedBadge");

  const pendingEmpty = document.getElementById("pendingEmpty");
  const completedEmpty = document.getElementById("completedEmpty");

  const searchInput = document.getElementById("searchInput");
  const filterButtons = document.querySelectorAll(".filter-button");

  const sortSelect = document.getElementById("sortSelect");

  sortSelect.addEventListener("change", () => {
    renderTasks();
});

  const themeToggle = document.getElementById("themeToggle");
  const notificationButton = document.getElementById("notificationButton");

  const progressText = document.getElementById("progressText");
  const largeProgressBar = document.getElementById("largeProgressBar");
  const productivityMessage = document.getElementById("productivityMessage");

  const toast = document.getElementById("toast");
  const toastTitle = document.getElementById("toastTitle");
  const toastMessage = document.getElementById("toastMessage");
  const toastClose = document.getElementById("toastClose");

  // =====================================================
  // STORAGE
  // =====================================================

  const TASK_STORAGE_KEY = "taskflow_tasks";
  const THEME_STORAGE_KEY = "taskflow_theme";

  let tasks = loadTasks();
  let currentFilter = "all";
  let currentSearch = "";
  let toastTimer;

  // =====================================================
  // LOAD TASKS
  // =====================================================

  function loadTasks() {
    try {
      const savedTasks = localStorage.getItem(TASK_STORAGE_KEY);

      if (!savedTasks) {
        return [];
      }

      const parsedTasks = JSON.parse(savedTasks);

      return Array.isArray(parsedTasks) ? parsedTasks : [];
    } catch (error) {
      console.error("Could not load tasks:", error);
      return [];
    }
  }

  // =====================================================
  // SAVE TASKS
  // =====================================================

  function saveTasks() {
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
  }

  // =====================================================
  // CREATE UNIQUE ID
  // =====================================================

  function createTaskId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  // =====================================================
  // ADD TASK
  // =====================================================

  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = taskInput.value.trim();
    const priority = prioritySelect.value || "medium";

    if (!text) {
      showToast("Task Required", "Please enter a task before adding it.");

      taskInput.focus();
      return;
    }

    if (text.length > 120) {
      showToast("Task Too Long", "Please keep your task under 120 characters.");

      return;
    }

    const newTask = {
      id: createTaskId(),
      text,
      priority,
      category: categorySelect.value,
      dueDate: dueDateInput.value || null,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    tasks.unshift(newTask);

    saveTasks();
    render();

    taskInput.value = "";
    prioritySelect.value = "medium";

    taskInput.focus();

    showToast("Task Added", `"${text}" has been added to your pending tasks.`);
  });

  // =====================================================
  // RENDER EVERYTHING
  // =====================================================

  function render() {
    renderTasks();
    updateStatistics();
    updateProgress();
  }

  // =====================================================
  // FILTER TASKS
  // =====================================================

  function getVisibleTasks() {
    const searchTerm = currentSearch.toLowerCase().trim();

    return tasks.filter((task) => {
      const matchesSearch = task.text.toLowerCase().includes(searchTerm);

      let matchesFilter = true;

      if (currentFilter === "pending") {
        matchesFilter = !task.completed;
      }

      if (currentFilter === "completed") {
        matchesFilter = task.completed;
      }

      return matchesSearch && matchesFilter;
    });
  }

  // =====================================================
  // RENDER TASK LISTS
  // =====================================================

  function renderTasks() {
    pendingTasks.innerHTML = "";
    completedTasks.innerHTML = "";

    const visibleTasks = getVisibleTasks();

    const sortValue = sortSelect.value;

    visibleTasks.sort((a, b) => {
      switch (sortValue) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);

        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);

        case "priority": {
          const priorityOrder = {
            high: 3,
            medium: 2,
            low: 1,
          };

          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }

        case "dueDate": {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;

          return new Date(a.dueDate) - new Date(b.dueDate);
        }

        default:
          return 0;
      }
    });

    const visiblePending = visibleTasks.filter((task) => !task.completed);

    const visibleCompleted = visibleTasks.filter((task) => task.completed);

    // Pending
    visiblePending.forEach((task) => {
      pendingTasks.appendChild(createTaskElement(task));
    });

    // Completed
    visibleCompleted.forEach((task) => {
      completedTasks.appendChild(createTaskElement(task));
    });

    updateEmptyStates(visiblePending, visibleCompleted);
  }

  // =====================================================
  // CREATE TASK ELEMENT
  // =====================================================

  function createTaskElement(task) {
    const card = document.createElement("article");

    card.className = `task-card ${task.completed ? "completed" : ""}`;

    card.dataset.id = task.id;

    const priorityLabel = getPriorityLabel(task.priority);

    const completedTime = task.completedAt
      ? `<span class="task-time">
                    Completed ${formatDate(task.completedAt)}
               </span>`
      : `<span class="task-time">
                    Added ${formatDate(task.createdAt)}
               </span>`;

    card.innerHTML = `
            <button
                class="task-check"
                type="button"
                data-action="toggle"
                aria-label="${
                  task.completed
                    ? "Mark task as pending"
                    : "Mark task as complete"
                }"
                title="${
                  task.completed ? "Mark as Pending" : "Mark as Complete"
                }"
            >
                ${task.completed ? '<i class="fa-solid fa-check"></i>' : ""}
            </button>

            <div class="task-info">
                <div class="task-text-wrapper">
                    <p class="task-text">${escapeHTML(task.text)}</p>
                </div>

                <div class="task-meta">

    <span class="priority-tag priority-${task.priority}">
        ${priorityLabel}
    </span>

    <span class="category-tag category-${task.category || "other"}">
        <i class="fa-solid fa-folder"></i>
        ${task.category || "Other"}
    </span>

    ${
      task.dueDate
        ? `<span class="due-date">
                    <i class="fa-solid fa-calendar-days"></i>
                    ${formatDate(task.dueDate)}
               </span>`
        : ""
    }

    ${completedTime}

</div>
            </div>

            <div class="task-actions">
                <button
                    class="task-action edit"
                    type="button"
                    data-action="edit"
                    aria-label="Edit task"
                    title="Edit Task"
                >
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button
                    class="task-action delete"
                    type="button"
                    data-action="delete"
                    aria-label="Delete task"
                    title="Delete Task"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

    return card;
  }

  // =====================================================
  // PRIORITY LABEL
  // =====================================================

  function getPriorityLabel(priority) {
    const labels = {
      low: "Low",
      medium: "Medium",
      high: "High",
    };

    return labels[priority] || "Medium";
  }

  // =====================================================
  // EVENT DELEGATION - PENDING
  // =====================================================

  pendingTasks.addEventListener("click", handleTaskAction);

  // =====================================================
  // EVENT DELEGATION - COMPLETED
  // =====================================================

  completedTasks.addEventListener("click", handleTaskAction);

  // =====================================================
  // HANDLE TASK ACTIONS
  // =====================================================

  function handleTaskAction(event) {
    const button = event.target.closest("[data-action]");

    if (!button) {
      return;
    }

    const card = button.closest(".task-card");

    if (!card) {
      return;
    }

    const taskId = card.dataset.id;
    const action = button.dataset.action;

    if (action === "toggle") {
      toggleTask(taskId);
    }

    if (action === "edit") {
      editTask(card, taskId);
    }

    if (action === "delete") {
      deleteTask(taskId);
    }
  }

  // =====================================================
  // TOGGLE TASK
  // =====================================================

  function toggleTask(taskId) {
    const task = tasks.find((item) => item.id === taskId);

    if (!task) {
      return;
    }

    task.completed = !task.completed;

    if (task.completed) {
      task.completedAt = new Date().toISOString();

      showToast(
        "Task Completed",
        `"${task.text}" has been completed. Great work!`,
      );
    } else {
      task.completedAt = null;

      showToast(
        "Task Reopened",
        `"${task.text}" is back in your pending tasks.`,
      );
    }

    saveTasks();
    render();
  }

  // =====================================================
  // EDIT TASK
  // =====================================================

  function editTask(card, taskId) {
    const task = tasks.find((item) => item.id === taskId);

    if (!task) {
      return;
    }

    const textElement = card.querySelector(".task-text");

    if (!textElement) {
      return;
    }

    // Prevent opening multiple edit inputs
    if (card.querySelector(".edit-input")) {
      return;
    }

    const originalText = task.text;

    const input = document.createElement("input");

    input.type = "text";
    input.className = "edit-input";
    input.value = originalText;
    input.maxLength = 120;
    input.setAttribute("aria-label", "Edit task");

    textElement.replaceWith(input);

    input.focus();
    input.select();

    const actions = card.querySelector(".task-actions");

    const originalActionsHTML = actions.innerHTML;

    actions.innerHTML = `
            <button
                class="task-action save"
                type="button"
                data-edit-action="save"
                title="Save"
                aria-label="Save task"
            >
                <i class="fa-solid fa-check"></i>
            </button>

            <button
                class="task-action cancel"
                type="button"
                data-edit-action="cancel"
                title="Cancel"
                aria-label="Cancel editing"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;

    const finishEdit = (save) => {
      const newText = input.value.trim();

      if (save) {
        if (!newText) {
          showToast("Empty Task", "Task text cannot be empty.");

          input.focus();
          return;
        }

        if (newText.length > 120) {
          showToast(
            "Task Too Long",
            "Please keep your task under 120 characters.",
          );

          input.focus();
          return;
        }

        task.text = newText;

        saveTasks();
        render();

        showToast("Task Updated", "Your task has been updated successfully.");

        return;
      }

      render();
    };

    actions.addEventListener(
      "click",
      (event) => {
        const editButton = event.target.closest("[data-edit-action]");

        if (!editButton) {
          return;
        }

        const editAction = editButton.dataset.editAction;

        if (editAction === "save") {
          finishEdit(true);
        }

        if (editAction === "cancel") {
          finishEdit(false);
        }
      },
      { once: true },
    );

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        finishEdit(true);
      }

      if (event.key === "Escape") {
        event.preventDefault();
        finishEdit(false);
      }
    });
  }

  // =====================================================
  // DELETE TASK
  // =====================================================

  function deleteTask(taskId) {
    const taskIndex = tasks.findIndex((item) => item.id === taskId);

    if (taskIndex === -1) {
      return;
    }

    const task = tasks[taskIndex];

    tasks.splice(taskIndex, 1);

    saveTasks();
    render();

    showToast("Task Deleted", `"${task.text}" has been permanently removed.`);
  }

  // =====================================================
  // SEARCH
  // =====================================================

  searchInput.addEventListener("input", (event) => {
    currentSearch = event.target.value;
    renderTasks();
  });

  // =====================================================
  // FILTER BUTTONS
  // =====================================================

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      currentFilter = button.dataset.filter || "all";

      renderTasks();
    });
  });

  // =====================================================
  // UPDATE STATISTICS
  
  // =====================================================
 
function updateStatistics() {
  const pending = tasks.filter((task) => !task.completed).length;

  const completed = tasks.filter((task) => task.completed).length;

  const total = tasks.length;

  // Basic Statistics
  pendingCount.textContent = pending;
  completedCount.textContent = completed;
  totalCount.textContent = total;

  pendingBadge.textContent = `${pending} pending`;
  completedBadge.textContent = `${completed} completed`;

  // Progress Percentage
  const progress = total > 0
    ? Math.round((completed / total) * 100)
    : 0;

  progressPercentage.textContent = `${progress}%`;
  progressBar.style.width = `${progress}%`;

  // Advanced Statistics: Completion Rate
  completionRate.textContent = `${progress}%`;

  // High Priority: unfinished tasks only
  const highPriority = tasks.filter(
    (task) => !task.completed && task.priority === "high"
  ).length;

  highPriorityCount.textContent = highPriority;

  // Due Soon: unfinished tasks due within 24 hours
  const now = new Date();
  const next24Hours = new Date(
    now.getTime() + 24 * 60 * 60 * 1000
  );

  const dueSoon = tasks.filter((task) => {
    if (!task.dueDate || task.completed) return false;

    const dueDate = new Date(task.dueDate);

    return dueDate >= now && dueDate <= next24Hours;
  }).length;

  dueSoonCount.textContent = dueSoon;

  // Categories: unique categories used by tasks
  const categories = new Set(
    tasks.map((task) => task.category || "other")
  );

  categoryCount.textContent = categories.size;
}
  // =====================================================
  // UPDATE PROGRESS
  // =====================================================

  function updateProgress() {
    const total = tasks.length;

    const completed = tasks.filter((task) => task.completed).length;

    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    progressPercentage.textContent = `${percentage}%`;

    progressBar.style.width = `${percentage}%`;

    if (largeProgressBar) {
      largeProgressBar.style.width = `${percentage}%`;
    }

    if (progressText) {
      if (total === 0) {
        progressText.textContent = "Start adding tasks to track your progress.";
      } else {
        progressText.textContent = `${completed} of ${total} tasks completed`;
      }
    }

    if (productivityMessage) {
      if (total === 0) {
        productivityMessage.textContent =
          "Your productivity journey starts here.";
      } else if (percentage === 100) {
        productivityMessage.textContent =
          "Perfect! You completed everything. 🎉";
      } else if (percentage >= 75) {
        productivityMessage.textContent =
          "Amazing progress! You're almost there.";
      } else if (percentage >= 50) {
        productivityMessage.textContent =
          "Great work! Keep the momentum going.";
      } else if (percentage > 0) {
        productivityMessage.textContent =
          "Nice start! Keep completing your tasks.";
      } else {
        productivityMessage.textContent =
          "Let's get started and make today productive.";
      }
    }
  }

  // =====================================================
  // EMPTY STATES
  // =====================================================

  function updateEmptyStates(visiblePending, visibleCompleted) {
    if (!pendingEmpty || !completedEmpty) {
      return;
    }

    pendingEmpty.style.display = visiblePending.length === 0 ? "" : "none";

    completedEmpty.style.display = visibleCompleted.length === 0 ? "" : "none";

    const hasAnyTask = tasks.length > 0;
    const hasSearch = currentSearch.trim().length > 0;

    if (
      visiblePending.length === 0 &&
      (hasSearch || currentFilter === "completed")
    ) {
      updateEmptyText(pendingEmpty, "No matching pending tasks.");
    } else if (!hasAnyTask) {
      updateEmptyText(
        pendingEmpty,
        "No pending tasks yet. Add your first task!",
      );
    } else {
      updateEmptyText(pendingEmpty, "No pending tasks. Great job!");
    }

    if (
      visibleCompleted.length === 0 &&
      (hasSearch || currentFilter === "pending")
    ) {
      updateEmptyText(completedEmpty, "No matching completed tasks.");
    } else if (!hasAnyTask) {
      updateEmptyText(completedEmpty, "Completed tasks will appear here.");
    } else {
      updateEmptyText(completedEmpty, "No completed tasks yet.");
    }
  }

  // =====================================================
  // UPDATE EMPTY STATE TEXT
  // =====================================================

  function updateEmptyText(element, message) {
    const messageElement = element.querySelector("p");

    if (messageElement) {
      messageElement.textContent = message;
    }
  }

  // =====================================================
  // DATE / TIME FORMAT
  // =====================================================

  function formatDate(dateString) {
    if (!dateString) {
      return "";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  // =====================================================
  // ESCAPE HTML
  // =====================================================

  function escapeHTML(value) {
    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
  }

  // =====================================================
  // TOAST NOTIFICATION
  // =====================================================

  function showToast(title, message) {
    if (!toast) {
      return;
    }

    clearTimeout(toastTimer);

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    toast.classList.add("show");

    toastTimer = setTimeout(() => {
      hideToast();
    }, 4000);
  }

  // =====================================================
  // HIDE TOAST
  // =====================================================

  function hideToast() {
    if (!toast) {
      return;
    }

    toast.classList.remove("show");
  }

  // =====================================================
  // CLOSE TOAST
  // =====================================================

  if (toastClose) {
    toastClose.addEventListener("click", hideToast);
  }

  // =====================================================
  // THEME
  // =====================================================

  function applyTheme(theme) {
    const isLight = theme === "light";

    document.body.classList.toggle("light-theme", isLight);

    if (themeToggle) {
      themeToggle.innerHTML = isLight
        ? '<i class="fa-solid fa-moon"></i>'
        : '<i class="fa-solid fa-sun"></i>';

      themeToggle.setAttribute(
        "aria-label",
        isLight ? "Switch to dark mode" : "Switch to light mode",
      );

      themeToggle.setAttribute("title", isLight ? "Dark Mode" : "Light Mode");
    }
  }

  function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (savedTheme === "light") {
      applyTheme("light");
    } else {
      applyTheme("dark");
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isLight = document.body.classList.contains("light-theme");

      const newTheme = isLight ? "dark" : "light";

      localStorage.setItem(THEME_STORAGE_KEY, newTheme);

      applyTheme(newTheme);

      showToast(
        newTheme === "light" ? "Light Mode" : "Dark Mode",
        `Switched to ${newTheme} mode.`,
      );
    });
  }

  // =====================================================
  // NOTIFICATION BUTTON
  // =====================================================

  if (notificationButton) {
    notificationButton.addEventListener("click", () => {
      const pending = tasks.filter((task) => !task.completed).length;

      const completed = tasks.filter((task) => task.completed).length;

      if (tasks.length === 0) {
        showToast("TaskFlow", "You don't have any tasks yet. Let's add one!");

        return;
      }

      if (pending === 0) {
        showToast("All Done! 🎉", "You completed all your tasks.");

        return;
      }

      showToast(
        "Daily Overview",
        `You have ${pending} pending and ${completed} completed task${
          completed === 1 ? "" : "s"
        }.`,
      );
    });
  }

  // =====================================================
  // KEYBOARD SHORTCUTS
  // =====================================================

  document.addEventListener("keydown", (event) => {
    // "/" focuses search
    if (
      event.key === "/" &&
      document.activeElement !== taskInput &&
      document.activeElement !== searchInput
    ) {
      event.preventDefault();
      searchInput.focus();
    }

    // Escape clears search
    if (event.key === "Escape" && document.activeElement === searchInput) {
      searchInput.value = "";
      currentSearch = "";
      renderTasks();
      searchInput.blur();
    }
  });

  // =====================================================
  // INITIALIZE
  // =====================================================

  loadTheme();
  render();
});

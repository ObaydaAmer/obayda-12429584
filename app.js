// File: js/app.js
// Student: obayda amer (12429584)
// This file is intentionally incomplete.
// Your task is to implement the required behaviour using JavaScript and the Fetch API.

/*
  API ENDPOINTS (already implemented on the server):

  Base URL:
    http://portal.almasar101.com/assignment/api
*/

// Configuration for this student (do not change STUDENT_ID value)
const STUDENT_ID = "12429584";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "https://portal.almasar101.com/assignment/api";

// Grab elements from the DOM
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const statusDiv = document.getElementById("status");
const list = document.getElementById("task-list");

/**
 * Helper to update status message.
 */
function setStatus(message, isError = false) {
  if (!statusDiv) return;
  statusDiv.textContent = message || "";
  statusDiv.style.color = isError ? "#d9363e" : "#666666";
}

/**
 * Clear status message after delay
 */
function clearStatusAfterDelay(delay = 2000) {
  setTimeout(function () {
    setStatus("");
  }, delay);
}

/**
 * Load tasks on page load
 */
document.addEventListener("DOMContentLoaded", function () {
  loadTasks();
});

async function loadTasks() {
  try {
    setStatus("Loading tasks...");

    const url =
      API_BASE +
      "/get.php?stdid=" +
      encodeURIComponent(STUDENT_ID) +
      "&key=" +
      encodeURIComponent(API_KEY);

    const response = await fetch(url);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to load tasks");
    }

    list.innerHTML = "";

    if (Array.isArray(data.tasks)) {
      data.tasks.forEach(function (task) {
        renderTask(task);
      });
    }

    setStatus("");
  } catch (error) {
    setStatus(error.message, true);
  }
}

/**
 * Add new task
 */
if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = input.value.trim();
    if (!title) return;

    try {
      setStatus("Adding task...");

      const url =
        API_BASE +
        "/add.php?stdid=" +
        encodeURIComponent(STUDENT_ID) +
        "&key=" +
        encodeURIComponent(API_KEY);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to add task");
      }

      renderTask(data.task);
      input.value = "";

      setStatus("Task added successfully.");
      clearStatusAfterDelay();
    } catch (error) {
      setStatus(error.message, true);
    }
  });
}

/**
 * Render a single task
 */
function renderTask(task) {
  const li = document.createElement("li");
  li.className = "task-item";

  const titleSpan = document.createElement("span");
  titleSpan.className = "task-title";
  titleSpan.textContent = task.title;

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "task-actions";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "task-delete";
  deleteBtn.textContent = "Delete";

  deleteBtn.addEventListener("click", async function () {
    if (!confirm("Delete this task?")) return;

    try {
      setStatus("Deleting task...");

      const url =
        API_BASE +
        "/delete.php?stdid=" +
        encodeURIComponent(STUDENT_ID) +
        "&key=" +
        encodeURIComponent(API_KEY) +
        "&id=" +
        encodeURIComponent(task.id);

      const response = await fetch(url);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to delete task");
      }

      li.remove();
      setStatus("Task deleted successfully.");
      clearStatusAfterDelay();
    } catch (error) {
      setStatus(error.message, true);
    }
  });

  actionsDiv.appendChild(deleteBtn);
  li.appendChild(titleSpan);
  li.appendChild(actionsDiv);
  list.appendChild(li);
}

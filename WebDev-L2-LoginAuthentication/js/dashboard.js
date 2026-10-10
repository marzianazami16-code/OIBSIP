

/* =========================================
   AUTHNOVA — DASHBOARD & SESSION GUARD
   OASIS INFOBYTE | LEVEL 2 | TASK 4
   ========================================= */

const USERS_KEY = "authNovaUsers";
const SESSION_KEY = "authNovaSession";
const REMEMBERED_SESSION_KEY = "authNovaRememberedSession";

const usernameElement = document.getElementById("dashboardUsername");
const emailElement = document.getElementById("dashboardEmail");
const createdAtElement = document.getElementById("dashboardCreatedAt");
const logoutButton = document.getElementById("logoutButton");

/* Find the active session */
function getActiveSession() {
  try {
    const sessionData =
      sessionStorage.getItem(SESSION_KEY) ||
      localStorage.getItem(REMEMBERED_SESSION_KEY);

    if (!sessionData) {
      return null;
    }

    return JSON.parse(sessionData);
  } catch (error) {
    console.error("Unable to read the current session:", error);
    return null;
  }
}

/* Read saved accounts */
function getUsers() {
  try {
    const storedUsers = localStorage.getItem(USERS_KEY);
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.error("Unable to read account data:", error);
    return [];
  }
}

/* Protect the dashboard */
function protectDashboard() {
  const session = getActiveSession();

  if (!session || !session.userId) {
    window.location.replace("index.html");
    return;
  }

  const users = getUsers();

  const currentUser = users.find(function (user) {
    return user.id === session.userId;
  });

  if (!currentUser) {
    clearUserSession();
    window.location.replace("index.html");
    return;
  }

  displayUserInformation(currentUser);
}

/* Display account information safely */
function displayUserInformation(user) {
  if (usernameElement) {
    usernameElement.textContent = user.username || "User";
  }

  if (emailElement) {
    emailElement.textContent = user.email || "Email not available";
  }

  if (createdAtElement) {
    if (user.createdAt) {
      const date = new Date(user.createdAt);

      createdAtElement.textContent = Number.isNaN(date.getTime())
        ? "Recently joined"
        : date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric"
          });
    } else {
      createdAtElement.textContent = "Recently joined";
    }
  }
}

/* Clear authentication session */
function clearUserSession() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(REMEMBERED_SESSION_KEY);
}

/* Log out */
if (logoutButton) {
  logoutButton.addEventListener("click", function () {
    clearUserSession();
    window.location.replace("index.html?logout=1");
  });
}

/* Run the dashboard protection check */
protectDashboard();


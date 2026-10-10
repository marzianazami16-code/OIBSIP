

/* =========================================
   AUTHNOVA — LOGIN & AUTHENTICATION
   OASIS INFOBYTE | LEVEL 2 | TASK 4
   ========================================= */

const loginForm = document.getElementById("loginForm");
const identifierInput = document.getElementById("loginIdentifier");
const passwordInput = document.getElementById("loginPassword");
const identifierError = document.getElementById("identifierError");
const passwordError = document.getElementById("passwordError");
const loginMessage = document.getElementById("loginMessage");
const togglePasswordButton = document.getElementById("toggleLoginPassword");
const passwordHelp = document.getElementById("passwordHelp");
const rememberMeCheckbox = document.getElementById("rememberMe");

const USERS_KEY = "authNovaUsers";
const SESSION_KEY = "authNovaSession";
const REMEMBERED_SESSION_KEY = "authNovaRememberedSession";

/* Show or hide the password */
if (togglePasswordButton && passwordInput) {
  togglePasswordButton.addEventListener("click", function () {
    const showPassword = passwordInput.type === "password";

    passwordInput.type = showPassword ? "text" : "password";

    togglePasswordButton.setAttribute(
      "aria-label",
      showPassword ? "Hide password" : "Show password"
    );
  });
}

/* Display field errors */
function showFieldError(element, message) {
  if (element) {
    element.textContent = message;
  }
}

/* Display form messages */
function showLoginMessage(message, type) {
  if (!loginMessage) return;

  loginMessage.textContent = message;
  loginMessage.className = type
    ? "form-message " + type
    : "form-message";
}

/* Clear messages */
function clearLoginMessages() {
  showFieldError(identifierError, "");
  showFieldError(passwordError, "");
  showLoginMessage("", "");
}

/* Read registered users */
function getRegisteredUsers() {
  try {
    const storedUsers = localStorage.getItem(USERS_KEY);
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    return Array.isArray(users) ? users : null;
  } catch (error) {
    console.error("Unable to read account storage:", error);
    return null;
  }
}

/* Hash the password using the same method as registration */
async function hashPassword(password) {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error(
      "Secure hashing is unavailable. Open the project using VS Code Live Server."
    );
  }

  const encodedPassword = new TextEncoder().encode(password);

  const hashBuffer = await window.crypto.subtle.digest(
    "SHA-256",
    encodedPassword
  );

  return Array.from(new Uint8Array(hashBuffer))
    .map(function (byte) {
      return byte.toString(16).padStart(2, "0");
    })
    .join("");
}

/* Save a session after successful login */
function saveUserSession(user, rememberMe) {
  const session = {
    userId: user.id,
    signedInAt: new Date().toISOString()
  };

  /* Remove any previous session first */
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(REMEMBERED_SESSION_KEY);

  if (rememberMe) {
    localStorage.setItem(
      REMEMBERED_SESSION_KEY,
      JSON.stringify(session)
    );
  } else {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}

/* Clear errors while typing */
if (identifierInput) {
  identifierInput.addEventListener("input", function () {
    showFieldError(identifierError, "");
    showLoginMessage("", "");
  });
}

if (passwordInput) {
  passwordInput.addEventListener("input", function () {
    showFieldError(passwordError, "");
    showLoginMessage("", "");
  });
}

/* Password help */
if (passwordHelp) {
  passwordHelp.addEventListener("click", function (event) {
    event.preventDefault();

    showLoginMessage(
      "Please register an account first, then return here to log in.",
      "error"
    );
  });
}

/* Show registration success or logout messages */
const urlParameters = new URLSearchParams(window.location.search);

if (urlParameters.get("registered") === "1") {
  showLoginMessage(
    "Registration successful! You can now log in.",
    "success"
  );
} else if (urlParameters.get("logout") === "1") {
  showLoginMessage("You have been logged out successfully.", "success");
}

/* Login */
if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearLoginMessages();

    const identifier = identifierInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    let valid = true;

    if (!identifier) {
      showFieldError(
        identifierError,
        "Please enter your username or email."
      );
      valid = false;
    }

    if (!password.trim()) {
      showFieldError(passwordError, "Please enter your password.");
      valid = false;
    }

    if (!valid) {
      showLoginMessage("Please complete the required fields.", "error");
      return;
    }

    const users = getRegisteredUsers();

    if (users === null) {
      showLoginMessage(
        "Account storage could not be accessed. Please try again.",
        "error"
      );
      return;
    }

    const user = users.find(function (account) {
      return (
        (typeof account.username === "string" &&
          account.username.toLowerCase() === identifier) ||
        (typeof account.email === "string" &&
          account.email.toLowerCase() === identifier)
      );
    });

    /* Use one generic message for incorrect credentials */
    if (!user) {
      showLoginMessage(
        "Invalid username/email or password. Please try again.",
        "error"
      );
      return;
    }

    const submitButton = loginForm.querySelector(
      'button[type="submit"]'
    );

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      const enteredPasswordHash = await hashPassword(password);

      if (enteredPasswordHash !== user.passwordHash) {
        showLoginMessage(
          "Invalid username/email or password. Please try again.",
          "error"
        );
        return;
      }

      saveUserSession(user, Boolean(rememberMeCheckbox?.checked));

      showLoginMessage(
        "Login successful! Opening your dashboard...",
        "success"
      );

      window.setTimeout(function () {
        window.location.href = "dashboard.html";
      }, 700);
    } catch (error) {
      console.error("Login error:", error);

      showLoginMessage(
        error.message || "Login failed. Please try again.",
        "error"
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}


```javascript
"use strict";

/* AUTHNOVA - REGISTRATION SYSTEM */

const registerForm = document.getElementById("registerForm");
const usernameInput = document.getElementById("registerUsername");
const emailInput = document.getElementById("registerEmail");
const passwordInput = document.getElementById("registerPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");

const usernameError = document.getElementById("usernameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("registerPasswordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");
const registerMessage = document.getElementById("registerMessage");

const togglePasswordButton = document.getElementById("toggleRegisterPassword");
const toggleConfirmButton = document.getElementById("toggleConfirmPassword");

const USERS_KEY = "authNovaUsers";

/* Password visibility */

function setupPasswordToggle(button, input) {
  if (!button || !input) return;

  button.addEventListener("click", function () {
    const showPassword = input.type === "password";

    input.type = showPassword ? "text" : "password";

    button.setAttribute(
      "aria-label",
      showPassword ? "Hide password" : "Show password"
    );
  });
}

setupPasswordToggle(togglePasswordButton, passwordInput);
setupPasswordToggle(toggleConfirmButton, confirmPasswordInput);

/* Error messages */

function showFieldError(element, message) {
  if (element) {
    element.textContent = message;
  }
}

function showRegisterMessage(message, type) {
  if (!registerMessage) return;

  registerMessage.textContent = message;
  registerMessage.className = type
    ? "form-message " + type
    : "form-message";
}

function clearMessages() {
  showFieldError(usernameError, "");
  showFieldError(emailError, "");
  showFieldError(passwordError, "");
  showFieldError(confirmPasswordError, "");

  showRegisterMessage("", "");
}

/* Read registered users */

function getRegisteredUsers() {
  try {
    const storedUsers = localStorage.getItem(USERS_KEY);

    if (!storedUsers) {
      return [];
    }

    const users = JSON.parse(storedUsers);

    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.error("Unable to read registered users:", error);
    return null;
  }
}

/* Hash password using SHA-256 */

async function hashPassword(password) {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error(
      "Password hashing is unavailable. Please run the project with VS Code Live Server."
    );
  }

  const data = new TextEncoder().encode(password);

  const result = await window.crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(result))
    .map(function (byte) {
      return byte.toString(16).padStart(2, "0");
    })
    .join("");
}

/* Clear field errors while typing */

if (usernameInput) {
  usernameInput.addEventListener("input", function () {
    showFieldError(usernameError, "");
  });
}

if (emailInput) {
  emailInput.addEventListener("input", function () {
    showFieldError(emailError, "");
  });
}

if (passwordInput) {
  passwordInput.addEventListener("input", function () {
    showFieldError(passwordError, "");
  });
}

if (confirmPasswordInput) {
  confirmPasswordInput.addEventListener("input", function () {
    showFieldError(confirmPasswordError, "");
  });
}

/* Registration */

if (registerForm) {
  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearMessages();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    let valid = true;

    if (username.length < 3) {
      showFieldError(
        usernameError,
        "Username must contain at least 3 characters."
      );
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      showFieldError(emailError, "Please enter a valid email address.");
      valid = false;
    }

    if (password.length < 8 || !/\d/.test(password)) {
      showFieldError(
        passwordError,
        "Password must contain at least 8 characters and one number."
      );
      valid = false;
    }

    if (password !== confirmPassword) {
      showFieldError(confirmPasswordError, "Passwords do not match.");
      valid = false;
    }

    if (!valid) {
      showRegisterMessage("Please correct the highlighted fields.");
      return;
    }

    const users = getRegisteredUsers();

    if (users === null) {
      showRegisterMessage("Unable to read account storage. Try again.");
      return;
    }

    const usernameExists = users.some(function (user) {
      return (
        typeof user.username === "string" &&
        user.username.toLowerCase() === username.toLowerCase()
      );
    });

    const emailExists = users.some(function (user) {
      return (
        typeof user.email === "string" &&
        user.email.toLowerCase() === email
      );
    });

    if (usernameExists || emailExists) {
      showRegisterMessage(
        "This username or email is already registered."
      );
      return;
    }

    const submitButton = registerForm.querySelector(
      'button[type="submit"]'
    );

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      const passwordHash = await hashPassword(password);

      const newUser = {
        id: Date.now().toString(),
        username: username,
        email: email,
        passwordHash: passwordHash,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);

      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      registerForm.reset();

      showRegisterMessage(
        "Account created successfully! Redirecting to login...",
        "success"
      );

      window.setTimeout(function () {
        window.location.href = "index.html?registered=1";
      }, 1400);
    } catch (error) {
      console.error("Registration error:", error);

      showRegisterMessage(
        error.message || "Registration failed. Please try again."
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}
```

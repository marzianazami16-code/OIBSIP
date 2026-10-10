
/* =========================================
   AUTHNOVA — LOGIN FORM INTERACTIONS
   OASIS INFOBYTE | LEVEL 2 | TASK 4
   ========================================= */

"use strict";

const loginForm = document.getElementById("loginForm");
const identifierInput = document.getElementById("loginIdentifier");
const passwordInput = document.getElementById("loginPassword");
const identifierError = document.getElementById("identifierError");
const passwordError = document.getElementById("passwordError");
const loginMessage = document.getElementById("loginMessage");
const togglePasswordButton = document.getElementById("toggleLoginPassword");
const passwordHelp = document.getElementById("passwordHelp");

/* Show or hide the password */
if (togglePasswordButton && passwordInput) {
  togglePasswordButton.addEventListener("click", () => {
    const willShow = passwordInput.type === "password";

    passwordInput.type = willShow ? "text" : "password";
    togglePasswordButton.setAttribute(
      "aria-label",
      willShow ? "Hide password" : "Show password"
    );
  });
}

/* Display a field error */
function showFieldError(element, message) {
  if (element) {
    element.textContent = message;
  }
}

/* Display a form-level message */
function showLoginMessage(message, type = "error") {
  if (!loginMessage) return;

  loginMessage.textContent = message;
  loginMessage.className = `form-message ${type}`;
}

/* Clear old messages while typing */
if (identifierInput) {
  identifierInput.addEventListener("input", () => {
    showFieldError(identifierError, "");
    loginMessage.textContent = "";
    loginMessage.className = "form-message";
  });
}

if (passwordInput) {
  passwordInput.addEventListener("input", () => {
    showFieldError(passwordError, "");
    loginMessage.textContent = "";
    loginMessage.className = "form-message";
  });
}

/* Demo help message */
if (passwordHelp) {
  passwordHelp.addEventListener("click", (event) => {
    event.preventDefault();
    showLoginMessage(
      "For this demo, create an account on the registration page first."
    );
  });
}

/* Validate the login form */
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    showFieldError(identifierError, "");
    showFieldError(passwordError, "");
    loginMessage.textContent = "";
    loginMessage.className = "form-message";

    const identifier = identifierInput.value.trim();
    const password = passwordInput.value;

    let isValid = true;

    if (!identifier) {
      showFieldError(identifierError, "Please enter your username or email.");
      isValid = false;
    }

    if (!password.trim()) {
      showFieldError(passwordError, "Please enter your password.");
      isValid = false;
    }

    if (!isValid) {
      showLoginMessage("Please complete the required fields.");
      return;
    }

    /*
      Authentication will be connected after registration
      and the demo account storage are implemented.
    */
    showLoginMessage(
      "Login validation is ready. Account authentication will be enabled in the next step."
    );
  });
}
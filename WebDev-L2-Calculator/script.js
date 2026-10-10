/* =========================================
   OIBSIP Calculator
   JavaScript Functionality
   ========================================= */

// Get calculator display elements
const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");

// Get all calculator buttons
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const actionButtons = document.querySelectorAll(".action");
const equalsButton = document.querySelector('[data-action="calculate"]');


// =========================================
// 1. Calculator State
// =========================================

// Store the current number entered by the user
let currentNumber = "0";

// Store the previous number before an operation
let previousNumber = null;

// Store the selected mathematical operation
let operation = null;

// Check whether the calculator is waiting for a new number
let waitingForNewNumber = false;


// =========================================
// 2. Update Display
// =========================================

function updateDisplay() {

    currentDisplay.textContent = currentNumber;

    if (previousNumber !== null && operation !== null) {

        previousDisplay.textContent =
            `${formatNumber(previousNumber)} ${getOperationSymbol(operation)}`;

    } else {

        previousDisplay.textContent = "";
    }
}


// =========================================
// 3. Format Numbers
// =========================================

function formatNumber(number) {

    const numericNumber = Number(number);

    if (!Number.isFinite(numericNumber)) {
        return number;
    }

    return numericNumber.toLocaleString("en-US", {
        maximumFractionDigits: 10
    });
}


// =========================================
// 4. Get Operation Symbol
// =========================================

function getOperationSymbol(operator) {

    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷",
        "%": "%"
    };

    return symbols[operator] || operator;
}


// =========================================
// 5. Enter Numbers
// =========================================

function enterNumber(number) {

    // Start a new number after an operation
    if (waitingForNewNumber) {

        currentNumber = number;

        waitingForNewNumber = false;

    } else {

        // Prevent multiple leading zeros
        if (currentNumber === "0" && number === "0") {
            return;
        }

        // Replace the first zero with another number
        if (currentNumber === "0") {

            currentNumber = number;

        } else {

            currentNumber += number;
        }
    }

    updateDisplay();
}


// =========================================
// 6. Enter Decimal
// =========================================

function enterDecimal() {

    // Start a new decimal number
    if (waitingForNewNumber) {

        currentNumber = "0.";
        waitingForNewNumber = false;

        updateDisplay();

        return;
    }

    // Do not allow more than one decimal point
    if (!currentNumber.includes(".")) {

        currentNumber += ".";

        updateDisplay();
    }
}


// =========================================
// 7. Select Operation
// =========================================

function selectOperation(selectedOperation) {

    // Ignore invalid operations
    if (
        selectedOperation !== "+" &&
        selectedOperation !== "-" &&
        selectedOperation !== "*" &&
        selectedOperation !== "/"
    ) {
        return;
    }

    // If an operation already exists and the user
    // enters another operation, calculate first
    if (operation !== null && !waitingForNewNumber) {

        calculateResult();
    }

    previousNumber = currentNumber;

    operation = selectedOperation;

    waitingForNewNumber = true;

    updateDisplay();
}


// =========================================
// 8. Calculate Result
// =========================================

function calculateResult() {

    // Make sure a complete calculation exists
    if (
        previousNumber === null ||
        operation === null
    ) {
        return;
    }

    const firstNumber = Number(previousNumber);
    const secondNumber = Number(currentNumber);

    let result;


    // Perform the selected operation
    switch (operation) {

        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":

            // Prevent division by zero
            if (secondNumber === 0) {

                currentNumber = "Cannot divide by 0";

                previousNumber = null;
                operation = null;
                waitingForNewNumber = true;

                updateDisplay();

                return;
            }

            result = firstNumber / secondNumber;
            break;
    }


    // Check whether the result is a valid number
    if (!Number.isFinite(result)) {

        currentNumber = "Error";

    } else {

        // Remove unnecessary decimal digits
        currentNumber = String(
            Number(result.toFixed(10))
        );
    }

    previousNumber = null;
    operation = null;

    waitingForNewNumber = true;

    updateDisplay();
}


// =========================================
// 9. Percentage
// =========================================

function calculatePercentage() {

    const number = Number(currentNumber);

    if (!Number.isFinite(number)) {
        return;
    }

    currentNumber = String(number / 100);

    updateDisplay();
}


// =========================================
// 10. Clear Calculator
// =========================================

function clearCalculator() {

    currentNumber = "0";

    previousNumber = null;

    operation = null;

    waitingForNewNumber = false;

    updateDisplay();
}


// =========================================
// 11. Delete Last Character
// =========================================

function deleteLastCharacter() {

    // Start from zero if waiting for a new number
    if (waitingForNewNumber) {

        currentNumber = "0";

        waitingForNewNumber = false;

        updateDisplay();

        return;
    }

    // Remove the last character
    if (currentNumber.length > 1) {

        currentNumber = currentNumber.slice(0, -1);

    } else {

        currentNumber = "0";
    }

    updateDisplay();
}


// =========================================
// 12. Number Button Events
// =========================================

numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        const number = button.dataset.number;

        if (number === ".") {

            enterDecimal();

        } else {

            enterNumber(number);
        }
    });
});


// =========================================
// 13. Operator Button Events
// =========================================

operatorButtons.forEach(button => {

    button.addEventListener("click", () => {

        const selectedOperation = button.dataset.operation;

        // Handle percentage separately
        if (selectedOperation === "%") {

            calculatePercentage();

        } else {

            selectOperation(selectedOperation);
        }
    });
});


// =========================================
// 14. Action Button Events
// =========================================

actionButtons.forEach(button => {

    button.addEventListener("click", () => {

        const action = button.dataset.action;

        if (action === "clear") {

            clearCalculator();

        } else if (action === "delete") {

            deleteLastCharacter();
        }
    });
});


// =========================================
// 15. Equals Button
// =========================================

equalsButton.addEventListener("click", () => {

    calculateResult();
});


// =========================================
// 16. Keyboard Support
// =========================================

document.addEventListener("keydown", (event) => {

    const key = event.key;


    // Number keys
    if (key >= "0" && key <= "9") {

        enterNumber(key);

        return;
    }


    // Decimal point
    if (key === ".") {

        enterDecimal();

        return;
    }


    // Mathematical operators
    if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {

        selectOperation(key);

        return;
    }


    // Enter or = for calculation
    if (key === "Enter" || key === "=") {

        event.preventDefault();

        calculateResult();

        return;
    }


    // Backspace for delete
    if (key === "Backspace") {

        deleteLastCharacter();

        return;
    }


    // Escape for clear
    if (key === "Escape") {

        clearCalculator();
    }


    // Percentage
    if (key === "%") {

        calculatePercentage();
    }
});


// =========================================
// 17. Initial Display
// =========================================

updateDisplay();
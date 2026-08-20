class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousText = previousOperandTextElement;
    this.currentText = currentOperandTextElement;
    this.clear();
  }

  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.resetDisplay = false;
  }

  delete() {
    if (this.currentOperand === '0') return;
    if (this.currentOperand.length === 1) {
      this.currentOperand = '0';
    } else {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;
    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number;
    } else if (this.resetDisplay) {
      this.currentOperand = number;
      this.resetDisplay = false;
    } else {
      this.currentOperand += number;
    }
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return;
    if (this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  compute() {
    let computation;

    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '×': // Fixed: matched to standard multiplication glyph '×'
        computation = prev * current;
        break;
      case '÷':
        if (current === 0) {
          alert("Cannot divide by zero");
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    this.currentOperand = Number(computation.toFixed(8)).toString();
    this.operation = undefined;
    this.previousOperand = '';
    this.resetDisplay = true;
  }

  updateDisplay() {
    this.currentText.innerText = this.currentOperand;
    if (this.operation != null) {
      this.previousText.innerText = `${this.previousOperand} ${this.operation}`;
    } else {
      this.previousText.innerText = '';
    }
  }
} // Class definition safely closed here

// DOM Instantiation & Bindings
const calculator = new Calculator(
  document.querySelector('[data-previous-operand]'),
  document.querySelector('[data-current-operand]')
);

document.querySelector('.buttons').addEventListener('click', (e) => {
  const target = e.target;
  if (!target.matches('button')) return;

  if (target.dataset.number !== undefined) {
    calculator.appendNumber(target.innerText);
  } else if (target.dataset.operator !== undefined) {
    calculator.chooseOperation(target.dataset.operator);
  } else if (target.dataset.action === 'clear') {
    calculator.clear();
  } else if (target.dataset.action === 'delete') {
    calculator.delete();
  } else if (target.dataset.action === 'calculate') {
    calculator.compute();
  }
  calculator.updateDisplay();
});
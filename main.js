// select all buttons and text fields

const buttonNumbers = document.querySelectorAll('.button-numbers');
const buttonDot = document.querySelector('.button-dot');
const buttonClear = document.querySelector('.button-clear');
const buttonBackspace = document.querySelector('.button-backspace');
const buttonMultiply = document.querySelector('.button-multiply');
const buttonDivide = document.querySelector('.button-divide')
const buttonAdd = document.querySelector('.button-add');
const buttonSubtract = document.querySelector('.button-subtract');
const buttonEqual = document.querySelector('.button-equal');

const buttonPlusminus = document.querySelector('.button-plusminus');
const buttonFactorial = document.querySelector('.button-factorial');
const buttonSqrt = document.querySelector('.button-sqrt');

const computations = document.querySelector('#computations');
const result = document.querySelector('#result');

// one neat array with all functions and associated operator strings and types

const add = {'fn': (a, b = 0) => +(a + b), 'operator': '+ ', 'operatorType': 0, 'node': buttonAdd};
const subtract = {'fn': (a, b = 0) => +(b - a), 'operator': '- ', 'operatorType': 1, 'node': buttonSubtract};
const multiply = {'fn': (a, b = 1) => +(a * b), 'operator': '* ', 'operatorType': 2, 'node': buttonMultiply};
const divide = {'fn': (a, b = 1) => +(b / a), 'operator': '/ ', 'operatorType': 3, 'node': buttonDivide};

const operations = [add, subtract, multiply, divide];

// test used for order of operations

const testOperator = operator => {
  if (operator === '* ' || operator === '/ ') return true;
  else return false;
}

// general variables

let currentInput = '';
let currentResult = '';
let operatorSwitch = 1;   // used to disable multiple operators in a row
let operatorType;
let dotSwitch = 0;    // only one dot per input
let equalSwitch = 0;

// variables for multiply/divide

let reduceArray = [];
let operatorsArray = [2];
let reduceSwitch = 0;   // checks for multiply/divide inputs to compute when equal/add/subtract is clicked

// functions for all main operations

const operation = (type) => {
  ifSwitch();
  if (operatorSwitch == 0) {
    operations[type]['node'].classList.add('onUse');
    computations.textContent += `${currentInput} ${operations[type]['operator']}`;
    if (!testOperator(operations[type]['operator'])) {
      if (currentResult === '' && reduceSwitch == 0) currentResult = currentInput;   // checks if it's the first input
      else if (reduceSwitch == 0) {
        currentResult = operations[operatorType]['fn'](+currentInput, +currentResult)
        result.textContent = currentResult;
      }
      else if (reduceSwitch == 1) {         // checks for add/subtract after multiply/divide
        multiplyDivide(reduceArray, operatorsArray)
      }
      operatorType = type;    // stores add/subtract to use after a multiply/divide
    }
    else {
      if (currentResult === '') currentResult = +currentInput;
      reduceArray.push(currentInput);     // populates two arrays (one with each input, the other with each operator used)
      operatorsArray.push(operations[type]['operatorType'])
      reduceSwitch = 1;
    }
    currentInput = '';
    dotSwitch = 0;
    operatorSwitch = 1;
  }
}


const multiplyDivide = (array1, array2) => {
  array1.push(currentInput);
  let arrayResult = array1.reduce((acc, result, index) => {   // computes the multiplication
    return operations[array2[index]]['fn'](+result, +acc)
  }, 1);
  if (operatorType !== undefined) {
    currentResult = +operations[operatorType]['fn'](arrayResult, +currentResult);
  } else {
    currentResult = +arrayResult;
  }
  result.textContent = `${+currentResult}`;
  reduceSwitch = 0;
  reduceArray.length = 0;
  operatorsArray = [2];
}


const equal = () => {
  if (operatorSwitch == 0 && equalSwitch == 0) {
    computations.textContent += `${currentInput}`;
    if (operatorType === undefined) currentResult = currentInput;
    if (reduceSwitch == 0 && operatorType !== undefined) {        // finish current computation
      currentResult = operations[operatorType]['fn'](+currentInput, +currentResult)
      result.textContent = currentResult;
    }
    else if (reduceSwitch == 1) {
      multiplyDivide(reduceArray, operatorsArray)
    }
    currentInput = '';
    equalSwitch = 1;
  }
}

const ifSwitch = () => {
  if (equalSwitch == 1) {
    currentInput = currentResult;
    currentResult = '';
    equalSwitch = 0;
    operatorSwitch = 0;
    computations.textContent = '';
  }
}

// numbers listeners

let numbers = (a) => {
  if (equalSwitch == 1) {   // resets if a number is input after an equal operation
    currentResult = '';
    currentInput == '';
    computations.textContent = '';
    equalSwitch = 0;
  }
  if (document.querySelector('.onUse')) {
    document.querySelector('.onUse').classList.remove('onUse')
  }
  if (currentInput.length < 15) {  
    buttonNumbers[a].classList.add('playing');
    operatorSwitch = 0;
    currentInput += `${a}`;
    result.textContent = currentInput;
  }
}

for (let i = 0; i < buttonNumbers.length; i++) {
  buttonNumbers[i].addEventListener('click', () => numbers(i));
  window.addEventListener('keydown', e => {
    if (e.key == `${i}`) numbers(i);
  })
}

let dot = () => {
  buttonDot.classList.add('playing');
  operatorSwitch = 0;
  if (dotSwitch == 0) {
    currentInput += `.`;
    result.textContent = currentInput;
  }
  dotSwitch = 1;
}

buttonDot.addEventListener('click', () => {
  buttonDot.classList.add('playing');
  dot();
})
window.addEventListener('keydown', e => {
  if (e.key == '.') {
    buttonDot.classList.add('playing');
    dot();
  }
})

// main operations listeners 

buttonAdd.addEventListener('click', () => {
  operation(0);
})
window.addEventListener('keydown', e => {
  if (e.key == '+') operation(0);
  if (e.key == '-') operation(1);
  if (e.key == '*') operation(2);
  if (e.key == '/') operation(3);
  if (e.key == '=') equal();
  if (e.keyCode == 8) {
    buttonBackspace.classList.add('playing');
    backspace();
  };
  if (e.key == 'c') clear();
  if (e.key == '!') {
    buttonFactorial.classList.add('playing');
    factorial();
  }
})
buttonSubtract.addEventListener('click', () => {
  operation(1);
})
buttonMultiply.addEventListener('click', () => {
  operation(2);
})
buttonDivide.addEventListener('click', () => {
  operation(3);
})

buttonEqual.addEventListener('click', () => {
  equal();
})

// backspace and clear 

let backspace = () => { 
  if (currentInput !== '' && operatorSwitch == 0 && equalSwitch == 0) {
    currentInput = currentInput.slice(0, -1);     // cuts the last character
    result.textContent = currentInput;
  }
}
buttonBackspace.addEventListener('click', () => {
  buttonBackspace.classList.add('playing');
  backspace()
})

let clear = () => {     // reset everything
  equalSwitch = 0;
  operatorSwitch = 0;
  operatorType = undefined;
  reduceSwitch = 0;
  reduceArray.length = 0;
  operatorsArray = [2];
  currentInput = '';
  dotSwitch = 0;
  currentResult = '';
  result.textContent = '';
  computations.textContent = '';
}
buttonClear.addEventListener('click', () => {
  clear();
})

// plusminus

let plusminus = () => {
  if (operatorSwitch == 0) {
    if (currentInput === '') {
    currentResult = currentResult*(-1);
    result.textContent = currentResult;
    }
    else {
      currentInput = `${+currentInput*(-1)}`;
      result.textContent = currentInput;
    }
  }
}

buttonPlusminus.addEventListener('click', () => {
  buttonPlusminus.classList.add('playing');
  plusminus();
})

// square root

let sqrt = () => {
  if (operatorSwitch == 0)
    if ((currentResult === '') || (currentResult != '' && currentInput !== '')) {
      currentInput = `${Math.sqrt(+currentInput)}`;
      result.textContent = currentInput;
    } else {
      currentResult = `${Math.sqrt(+currentResult)}`;
      result.textContent = currentResult;
    }
}

buttonSqrt.addEventListener('click', () => {
  buttonSqrt.classList.add('playing');
  sqrt();
})

// factorial


let factorial = () => {  
  let facN = n => {
    if (n===0){
      return 1;
    }
    return n * facN(n-1);
  }
  if (operatorSwitch == 0) {
  if (currentInput !== '' && +currentInput % 1 == 0 && currentResult !== '') {
    currentInput = `${facN(+currentInput)}`;
    result.textContent = currentInput;
  } else if (+currentResult % 1 == 0 && currentResult !== '' && currentInput === ''){
    currentResult = facN(+currentResult)
    result.textContent = currentResult;
  } else if (currentInput !== '' && +currentInput % 1 == 0 && currentResult === '') {
    currentResult = facN(+currentInput);
    result.textContent = currentResult;
    currentInput = '';
  }
}}


buttonFactorial.addEventListener('click', () => {
  buttonFactorial.classList.add('playing');
  factorial();
})

// transitions

function removeTransition(e) {
  if(e.propertyName == 'background-color' || e.propertyName == 'outline-width')
  this.classList.remove('playing');
  else return;
}
const buttonsTransition = document.querySelectorAll('.button-transition');
buttonsTransition.forEach(key => key.addEventListener('transitionend', removeTransition))

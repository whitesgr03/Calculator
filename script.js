// function calcMethods(str) {
//     const methods = {
//         "-": (a, b) => a - b,
//         "+": (a, b) => a + b,
//         "x": (a, b) => a * b,
//         "÷": (a, b) => a / b,
//     }
    
//     let split = str.split(' ');
//     let a = +split[0];
//     let op = split[1];
//     let b = +split[2];

//     return methods[op](a, b);
// }

function operate(op, a, b) {
    const display = document.querySelector('.result').textContent
    const isOperatorActive = document.querySelector('.active');
    if (isOperatorActive) {
        isOperatorActive.classList.remove('active')
    }
    this.classList.add('active'); 
    

    // const methods = {
    //     "-": (a, b) => a - b,
    //     "+": (a, b) => a + b,
    //     "x": (a, b) => a * b,
    //     "÷": (a, b) => a / b,
    // }

    // return methods[op](a, b);
}

function getNumber() {
    const display = document.querySelector('.result')
    display.textContent = this.textContent;
}

// function changeBGC() { 
//     if (this.classList.contains('clicking')) {
//         this.classList.remove('clicking')
//     }
//     this.classList.add('clicking')
// }

function getButtons() {
    const numButtons = [...document.querySelectorAll('.num button')];
    const operatorButton = [...document.querySelectorAll('.operator button')];

    for (let button of numButtons) {
        button.addEventListener('click', getNumber);
        // button.addEventListener('mousedown mouseup', changeBGC) 滑鼠點擊變色事件還沒好
    }
    for (let button of operatorButton) {
        button.addEventListener('click', operate);
    }
}

getButtons();
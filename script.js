function checkScreenWidth() {
    const display = document.querySelector('.result');
    const screen = document.querySelector('.screen');
    const [paddingRight, paddingLeft] = [ // screen padding
        parseInt(window.getComputedStyle(screen)['padding-right']),
        parseInt(window.getComputedStyle(screen)['padding-left'])
    ];
    const fontSize = 16

    display.style['opacity'] = 0;
    display.style['font-size'] = `${ fontSize * 5 }px`;

    // 數字是否超過父元素寬度
    let isOverWidth = display.offsetWidth >= screen.offsetWidth - (paddingRight + paddingLeft)
    
    while (isOverWidth) {
        const currentFontSize = parseInt(window.getComputedStyle(display)['font-size']);

        if (currentFontSize === fontSize) { 
            calculator.reset();
            alert('The number is too large, the calculator will reset!')
        } else {
            display.style['font-size'] = `${currentFontSize - fontSize}px`
        }

        isOverWidth = display.offsetWidth >= screen.offsetWidth - (paddingRight + paddingLeft)
    }
    display.style['opacity'] = 1;
}

function checkOperatorActive() {
        const isOperatorActive = document.querySelector('.active');
        if (isOperatorActive) {
            isOperatorActive.classList.remove('active');
        }
}

function rgbToHsl(rgb){

    let [r, g, b] = rgb.map(color => color / 255);

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h = 0;
    let s = 0;
    let l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = d / (1 - Math.abs(2 * l - 1));
        switch(max){
            case r:
                h = (g - b) / d % 6;
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
    }

    h = Math.round(h * 60);
        
    if (h < 0)
        h += 360;

    s = Math.round((s * 100));
    l = Math.round((l * 100));

    return [h, s, l];
}



function getNumber(key) {
    calculator.setNumber(key);
    checkScreenWidth();
}

function getFunc(key) {
    switch (key) {
        case 'AC':
            checkOperatorActive()
            calculator.reset();
            checkScreenWidth();
            break;
        case '.':
            calculator.addDecimal()
            break;
    }
}

function getOperate() {
    checkOperatorActive()
    
    if (this.textContent === '=') {
        calculator();
        checkScreenWidth();
        return
    }

    this.classList.add('active');
    calculator.setOperator(this.textContent);
    checkScreenWidth();
}

function changeButtonBGC(e) {
    if (e.type === 'mouseup') {
        this.removeAttribute('style');
        return
    }

    const rgb = window.getComputedStyle(this)['background-color'];
    const rgbCode = rgb.match(/\d+/g, "");
    let [Hue, Saturation, Lightness] = rgbToHsl(rgbCode);

    if (this.parentNode.classList.contains('operator')) {
        Lightness -= 15;
    } else {
        Lightness += 15
    }

    const newColor = `hsl(${Hue}, ${Saturation}%, ${Lightness}%)`;

    this.style['background-color'] = newColor;
}


function calc() {
    const display = document.querySelector('.result');

    let a = 0;
    let op = '';
    let b = 0;

    const methods = {
        "-": (a, b) => a - b,
        "+": (a, b) => a + b,
        "x": (a, b) => a * b,
        "÷": (a, b) => a / b,
    }

    function calculate() {
        if (b === '') {
            return;
        }

        let result = null;

        if (op === "÷" && b === '0') {
            result = '不是數字'
        } else {
            result = methods[op](+a, +b)
            a = result;
        }
        b = '';
        
        display.textContent = result;
        return;
    }

    calculate.setNumber = (n) => {
        if (op) {
            b += n
            display.textContent = b;
            console.log(a, op, b)
            return 
        }
        if (!a) {
            a = n

        } else {
        a += n

        }
        display.textContent = a;
    }

    calculate.setOperator = (item) => {
        if (op) {
            calculate();
        };
        op = item
        console.log(a, op, b)
    }

    // calculate.addDecimal = () => {
    //     if (a === '' && b === '') {
    //         return;
    //     }

    //     if (op && !b.includes('.')) {
    //         b += '.'
    //         display.textContent = b;
    //         return 
    //     } 
    //     if (!a.includes('.')) {
    //         a += '.'
    //         display.textContent = a;
    //         return 
    //     } 
    // }

    calculate.reset = () => {
        display.textContent = '0';
        a = '';
        op = '';
        b = '';
    }
    
    return calculate
}

function getButtons() {
    const menuButtons = [...document.querySelectorAll('.menu button')]; // 計算機左邊的所有按鈕 (數字與功能)
    const operatorButtons = [...document.querySelectorAll('.operator button')];// 計算機右邊的所有按鈕 (運算符)

    for (let button of menuButtons) {
        button.addEventListener('click', function () {
            isFinite(this.textContent) ? getNumber(this.textContent) : getFunc(this.textContent)
        });
    }

    for (let button of operatorButtons) {
        button.addEventListener('click', getOperate);
    }

    for (let button of [...menuButtons, ...operatorButtons]) {
        ['mousedown', 'mouseup'].forEach(event => button.addEventListener(event, changeButtonBGC))
    }
}

const calculator = calc();

getButtons();
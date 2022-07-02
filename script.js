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
        checkScreenWidth();
        return;
    }

    calculate.setNumber = (n) => {
        if (op) {
            b += n
            display.textContent = b;
            console.log(a, op, b)
            return 
        }
        a += n
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
        display.style['font-size'] = '80px';
        a = '';
        op = '';
        b = '';
    }
    
    return calculate
}

function getOperate() {
    const isOperatorActive = document.querySelector('.active');

    if (isOperatorActive) {
        isOperatorActive.classList.remove('active')
    }

    if (this.textContent !== '=') {
        calculator.setOperator(this.textContent);
        this.classList.add('active');
        return
    }
    calculator();
}

function getNumber(num) {
    calculator.setNumber(num);
    checkScreenWidth();
}

function checkScreenWidth() {
    const display = document.querySelector('.result');

    const [paddingRight, paddingLeft] = [
        parseInt(window.getComputedStyle(display.parentNode)['padding-right']),
        parseInt(window.getComputedStyle(display.parentNode)['padding-left'])
    ];

    // 數字是否超過父元素寬度
    const isOverWidth = display.offsetWidth >= display.parentNode.offsetWidth - (paddingRight + paddingLeft)
    const fontSize = 16
    if (isOverWidth) {
        const currentFontSize = parseInt(window.getComputedStyle(display)['font-size']);

        if (currentFontSize === fontSize) {
            // reset
            display.style['font-size'] = `${ fontSize * 5 }px`;
            return 
        }

        display.style['font-size'] = `${currentFontSize - fontSize}px`
        
    }
}

function getFunc(key) {
    if (key === 'AC') {
        const isOperatorActive = document.querySelector('.active');
        if (isOperatorActive) {
            isOperatorActive.classList.remove('active');
        }
        calculator.reset();
    }
    if (key === '.') { 
        calculator.addDecimal()
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

function getButtons() {
    const menuButtons = [...document.querySelectorAll('.menu button')];
    const operatorButtons = [...document.querySelectorAll('.operator button')];

    for (let button of menuButtons) {
        button.addEventListener('click', function () {
            isFinite(this.textContent) ? getNumber(+this.textContent) : getFunc(this.textContent)
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
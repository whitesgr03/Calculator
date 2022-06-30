function calc() {
    const display = document.querySelector('.result');

    let a = '';
    let op = '';
    let b = '';

    const methods = {
        "-": (a, b) => a - b,
        "+": (a, b) => a + b,
        "x": (a, b) => a * b,
        "÷": (a, b) => a / b,
    }

    // 在家簡塵除裡面寫if

    function calculate() {
        const result = methods[op](+a, +b)
        a = result;
        display.textContent = result;
        return;
    }

    calculate.setNumber =  (n) => {
        if (op) {
            b += n
            display.textContent = b;
            return;
        }

        a += n
        display.textContent = a
    }

    calculate.setOperator = (item) => {
        op = item;
    }

    calculate.reset = () => {
        display.textContent = '0';
        a = '';
        op = '';
        b = '';
    }

    return calculate
}

function operate() {
    const isOperatorActive = document.querySelector('.active');

    if (isOperatorActive) {
        isOperatorActive.classList.remove('active')
    }

    if (this.textContent !== '=') {
        this.classList.add('active');
        calculator.setOperator(this.textContent);
        return
    }

    calculator();
}

function getNumber() {

    const display = document.querySelector('.result');

    const [paddingRight, paddingLeft] = [
        parseInt(window.getComputedStyle(display.parentNode)['padding-right']),
        parseInt(window.getComputedStyle(display.parentNode)['padding-left'])
    ];

    // 數字是否超過父元素寬度
    const isOverWidth = display.offsetWidth >= display.parentNode.offsetWidth - (paddingRight + paddingLeft)

    if (isOverWidth) {
        const currentFontSize = parseInt(window.getComputedStyle(display)['font-size']);

        if (currentFontSize === 16) {
            calculator.reset();
            display.style['font-size'] = '80px';
            return 
        }
        
        display.style['font-size'] = `${currentFontSize - 16}px`;
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
    const numButtons = [...document.querySelectorAll('.num button')];
    const operatorButtons = [...document.querySelectorAll('.operator button')];

    for (let button of numButtons) {
        button.addEventListener('click', function () {
            calculator.setNumber(this.textContent)
            getNumber()
        });
    }

    for (let button of operatorButtons) {
        button.addEventListener('click', operate);
    }

    for (let button of [...menuButtons, ...operatorButtons]) {
        ['mousedown', 'mouseup'].forEach(event => button.addEventListener(event, changeButtonBGC))
    }
}

const calculator = calc();

getButtons();
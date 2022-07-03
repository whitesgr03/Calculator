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
            calculator.setDecimal()
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

    let a = '';
    let op = '';
    let b = '';

    const methods = {
        "-": (a, b) => (a * 10 - b * 10) / 10,
        "+": (a, b) => (a * 10 + b * 10) / 10,
        "x": (a, b) => a * b,
        "÷": (a, b) => a / b,
    }
    // 乘法與除法的精確小數點
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
    }

    calculate.setNumber = (n) => {
        if (op) {   // a 與 op 都選擇後改為顯示 b
            b += n
            display.textContent = b;
            return 
        }

        if (!a || a === '0') {   // 第一次取代 0
            a = n
        } else {
            a += n
        }
        display.textContent = a;
    }

    calculate.setOperator = (item) => {
        if (op) {
            calculate();
        }
        op = item
    }

    calculate.setDecimal = () => {

        if (op) {

            if (b && b % 1 === 0 && (b + '').at(-1) !== '.') {
                b += '.'
                display.textContent = b;
                return
            }
        }

        if (a && a % 1 === 0 && (a + '').at(-1) !== '.') {
                a += '.'
                display.textContent = a;
            }
    }

    calculate.reset = () => {
        display.textContent = '0';
        a = '';
        op = '';
        b = '';
    }
    // 只有 a 的時候按等於沒作用
    // 只有 a 和 op 的時候按等於沒作用
    // 有 a, op, b 的時候按等於可以計算, 計算完畢後 b 清空
    // 有 a, 並且 op 是除, b 是 0 的時候, 會警告不是數字
    // 有 a op, b 的時候按下運算符可以計算, 計算完畢後 b 清空, 可以連續使用運算符計算
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
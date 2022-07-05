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
            alert('The number is too large, the calculator will reset!')
            calculator.reset();
            display.style['font-size'] = `${ fontSize * 5 }px`;
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

function appendNumber() {
    console.log()
    switch (this.textContent) {
        case '.':
            calculator.setDecimal()
            break
        default:
            calculator.setNumber(this.textContent);
    }
    checkScreenWidth();
}

function chooseFunc() {
    switch (this.textContent) {
        case 'AC':
            checkOperatorActive()
            calculator.reset();
            break;
    }
    checkScreenWidth();
}

function chooseOperate() {
    checkOperatorActive()
    switch (this.textContent) {
        case '=':
            calculator();
            break;
        default:
            this.classList.add('active');
            calculator.setOperator(this.textContent);
    }

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
            result = +methods[op](+a, +b).toFixed(15)
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
            if (b &&
                b % 1 === 0 &&
                (b + '').at(-1) !== '.') {
                b += '.'
                display.textContent = b;
                return
            }
        }

        if (a &&
            a % 1 === 0 &&
            (a + '').at(-1) !== '.') {
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
    const buttons = [...document.querySelectorAll('.buttons button')];

    for (let button of buttons) {
        const parentClass = button.parentNode.classList[0];
        switch (parentClass) {
            case 'func':
                button.addEventListener('click', chooseFunc);
                break;
            case 'operator':
                button.addEventListener('click', chooseOperate);
                break;
            default:
                button.addEventListener('click', appendNumber);
        }

        ['mousedown', 'mouseup'].forEach(event => button.addEventListener(event, changeButtonBGC))
    }

    // document.addEventListener('keydown', (e) => {
    //     let key = null

    //     switch (e.key) {
    //         case 'Enter': 
    //             key = buttons.find(btn => btn.textContent === '=')
    //             document.activeElement.blur();
    //             chooseOperate.call(key)
    //             break
    //         case 'Escape': 
    //             key = buttons.find(btn => btn.textContent === 'AC')
    //             chooseFunc.call(key)   
    //             break
    //     }

    //     key = buttons.find(btn => btn.dataset.key === e.key || btn.textContent === e.key)
    //     if (!key) return

    //     const parentClass = key.parentNode.classList[0];
    //     switch (parentClass) {
    //         case 'operator':
    //             chooseOperate.call(key)
    //             break;
    //         default:
    //             appendNumber.call(key)
    //     }
    //             changeButtonBGC.call(key, e)

    // });
}

const calculator = calc();

getButtons();
'use strict'

const calculator = calc();  // 建立一個常數儲存閉包函式

getButtons();  // 監聽所有按鈕

function getButtons() {
    const buttons = [...document.querySelectorAll('.buttons button')]; //建立一個常數取得所有按鈕元素

    for (let button of buttons) {
        button.addEventListener('click', calculator)
        button.addEventListener('transitionend', function () {
            this.removeAttribute('style');
        })
    }
    document.addEventListener('keydown', calculator)
}

function calc() {
    const displayResult = document.querySelector('.result'); // 建立一個常數取得結果輸出的元素

    let a = ''; // 建立一個變數用來儲存第一筆數字
    let op = ''; // 建立一個變數用來儲存運算符
    let b = ''; // 建立一個變數用來儲存第二比數字

    const methods = { // 建立一個常數儲存運算式
        "-": (a, b) => a - b,
        "+": (a, b) => a + b,
        "x": (a, b) => a * b,
        "÷": (a, b) => a / b,
    }

    function fn(e) {
        let el = null; // 建立一個變數用來儲存觸發的元素
        let key = null // 建立一個常數用來儲存事件所傳遞的按鍵

        if (e.type === 'keydown') { // 如果觸發鍵盤事件, 進行 switch 條件判斷, 否則直接獲取 el 和 key
            switch (e.key) {
                case 'Escape':
                case 'Backspace':
                    el = document.querySelector(`button[data-key="AC"]`)
                    break;
                case 'Enter':
                    el = document.querySelector(`button[data-key="="]`)
                    break;
                default:
                el = document.querySelector(`button[data-key="${e.key}"]`)
            }
            if (!el) return  // 如果 el 是 null 的話終止函式
            key = el.textContent;
        } else {
            el = this;
            key = this.textContent
        }

        if (isFinite(key)) { // 如果事件傳遞的按鍵是整數字串的話, 則輸入數字到運算式中
            fn.setNumber(key);
        } else { // 否則進行 switch 條件判斷
            switch (key) {
                case '.':
                    fn.setDecimal()
                    break
                case 'AC':
                    fn.reset();
                    break;
                case '=':
                    fn.getResult();
                    break;
                default:
                    checkOperatorActive(el)
                    fn.setOperator(key);
            }
        }
        changeButtonBGC(el) // 執行按鈕背景顏色切換
        checkScreenWidth(); // 檢查數字是否超出元素的最大寬度
    }

    fn.getResult = () => { // 計算結果
        if (b === '') {
            return;
        }

        let result = null; // 建立一個變數來儲存結果

        if (op === "÷" && b === '0' || b === '0.') { // 如果除以 0 的話顯示文字
            result = '不是數字'
        } else {
            result = +methods[op](+a, +b).toFixed(14)
            a = result;
        }
        b = '';
        
        displayResult.textContent = result;
    }
    fn.setNumber = (n) => { // 輸入數字
        if (op) {   // a 與 op 都選擇後改為顯示 b
            b += n
            displayResult.textContent = b;
            return
        }

        if (!a || a === '0') {   // 第一次輸入時取代 0
            a = n
        } else {
            a += n
        }
        displayResult.textContent = a;
    }
    fn.setOperator = (item) => { // 設定運算符
        if (op) {
            fn.getResult();
        }
        op = item
    }
    fn.setDecimal = () => { // 設定小數點
        if (op) {
            if (b &&
                b % 1 === 0 &&
                (b + '').at(-1) !== '.') {
                b += '.'
                displayResult.textContent = b;
            }
            return
        }

        if (a &&
            a % 1 === 0 &&
            (a + '').at(-1) !== '.') {
                a += '.'
                displayResult.textContent = a;
            }
    }
    fn.reset = () => { // 重置全部
        displayResult.textContent = '0';
        a = '';
        op = '';
        b = '';
    }
    return fn
}

function changeButtonBGC(button) {
    const rgb = window.getComputedStyle(button)['background-color']; // 建立一個常數獲取按鈕元素的 rgb
    const rgbCode = rgb.match(/\d+/g, "");  // 建立一個元素來獲取 rgb 的 3 數值
    let [Hue, Saturation, Lightness] = rgbToHsl(rgbCode); // 建立三個元素來獲取 HSL 

    if (button.parentNode.classList.contains('operator')) { // 如果是 'operator' class 的話減少亮度, 否則增加亮度
        Lightness -= 15;
    } else {
        Lightness += 15
    }

    const newColor = `hsl(${Hue}, ${Saturation}%, ${Lightness}%)`; // 建立一個常數來儲存新 HSL

    button.style['background-color'] = newColor; // 給按鈕元素設定新顏色
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

function checkScreenWidth() {
    const displayResult = document.querySelector('.result'); // 建立一個常數來儲存結果元素
    const screen = document.querySelector('.screen'); // 建立一個常數來儲存螢幕元素
    const [paddingRight, paddingLeft] = [ // 建立一個常數來儲存螢幕元素的寬度
        parseInt(window.getComputedStyle(screen)['padding-right']),
        parseInt(window.getComputedStyle(screen)['padding-left'])
    ];
    const fontSize = parseInt(window.getComputedStyle(document.body)['font-size']) // 建立一個常數來儲存原始文字大小

    displayResult.style['opacity'] = 0; // 設定結果元素的透明度為 0
    displayResult.style['font-size'] = `${ fontSize * 5 }px`; // 設定結果元素的文字預設為預設大小
    
    while (displayResult.offsetWidth >= screen.offsetWidth - (paddingRight + paddingLeft)) { // 如果結果元素的寬度超過螢幕元素的寬度的話就執行迴圈
        const currentFontSize = parseInt(window.getComputedStyle(displayResult)['font-size']); // 建立一個常數來獲取目前結果元素的文字大小

        if (currentFontSize === fontSize) { // 如果結果元素的文字大小和原始文字大小相等的話, 重置計算機與文字大小, 否則果元素的文字大小剪掉原始文字大小
            alert('The number is too large, the calculator will reset!')
            calculator.reset();
            displayResult.style['font-size'] = `${ fontSize * 5 }px`;
        } else {
            displayResult.style['font-size'] = `${currentFontSize - fontSize}px`
        }
    }
    displayResult.style['opacity'] = 1;
}

function checkOperatorActive(button) {
    const isOperatorActive = document.querySelector('.active'); // 建立一個常數來儲存啟用中的運算符按鈕
    if (isOperatorActive) { // 如果有啟用中的按鈕就將 class 移除, 否則加上 class
        isOperatorActive.classList.remove('active');
    }
    button.classList.add('active');
}
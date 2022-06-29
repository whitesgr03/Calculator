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
    const fisrtNumber = document.querySelector('.result').textContent
    
    const isOperatorActive = document.querySelector('.active');

    if (isOperatorActive) {
        isOperatorActive.classList.remove('active')
    }
    if (this.textContent !== '=') {
        this.classList.add('active'); 
    }
    

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
    const numButtons = [...document.querySelectorAll('.num button')];
    const operatorButtons = [...document.querySelectorAll('.operator button')];

    for (let button of numButtons) {
        button.addEventListener('click', getNumber);
    }

    for (let button of operatorButtons) {
        button.addEventListener('click', operate);
    }
}

getButtons();
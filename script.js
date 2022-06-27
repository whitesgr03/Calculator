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

    const methods = {
        "-": (a, b) => a - b,
        "+": (a, b) => a + b,
        "x": (a, b) => a * b,
        "÷": (a, b) => a / b,
    }

    return methods[op](a, b);
}
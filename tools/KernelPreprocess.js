
var fs = require('fs');


let unprocessedK = //might want to remake
[[0,  0,  1,  1,  2,  1,  1,  0,  0],
 [0,  1,  2,  2,  3,  2,  2,  1,  0],
 [1,  2,  3,  3,  4,  3,  3,  2,  1],
 [1,  2,  3,  4,  5,  4,  3,  2,  1],
 [2,  3,  4,  5,  6,  5,  4,  3,  2],
 [1,  2,  3,  4,  5,  4,  3,  2,  1],
 [1,  2,  3,  3,  4,  3,  3,  2,  1],
 [0,  1,  2,  2,  3,  2,  2,  1,  0],
 [0,  0,  1,  1,  2,  1,  1,  0,  0]];  

let invPow2 = (n) => {
    return 1 / Math.pow(2, n)
}

let linear = (n, allN) => {
    return allN.length - n;
}

let preprocess = (kernel, f) => {

    //if(!f) f = invPow2;

    let elems = [];
    for(let i = 0; i < kernel.length; i++){
        for(let j = 0; j < kernel[0].length; j++){
            elems.includes(kernel[i][j]) ? null : elems.push(kernel[i][j]);        
        }
    }
    for(let i = 0; i < kernel.length; i++){
        for(let j = 0; j < kernel[0].length; j++){
            if(kernel[i][j] !== 0){
                kernel[i][j] = kernel[i][j] * kernel[i][j]; 
            }
        }
    }
}

let k = unprocessedK;

preprocess(k)


fs.writeFile(`kernel-${"output"}.json`, JSON.stringify(k), 'utf8', (err) => { err ? console.log("An error occured while writing JSON Object to File.") : null});
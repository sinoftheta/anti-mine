/**
 * Kernel Generator tool for AntiMine
 * 
 * This tool generates a square coeffincent matrix for a given input diameter
 * 
 * 
 */
var fs = require('fs');


if(!process.argv[2]){
    console.log("error: please provide a canter value");
    return;
}

let diameter = Number(process.argv[2] * 2 - 1);

if(diameter % 2 == undefined || diameter % 2 === 0){
    console.log("error: canter value must be an integer");
    return;
}
//console.log("diameter = " + diameter);

let k = [];

let radius = Math.floor(diameter / 2);

for(let i = 0; i < diameter; i++){
    k[i] = [];
    for(let j = 0; j < diameter; j++){

        //compute inverse  taxicab distance
        k[i][j] = Math.max(Math.abs(Math.abs(i - radius) + Math.abs( j - radius) - diameter) - radius, 0);

        //compute king distance
        //k[i][j] = 1 + radius - Math.max(Math.abs(i - radius), Math.abs(j - radius));
    }
}


fs.writeFile(`kernel-${process.argv[2]}.json`, JSON.stringify(k), 'utf8', (err) => { err ? console.log("An error occured while writing JSON Object to File.") : null});

/**
 * Kernel Generator tool for AntiMine
 * 
 * This tool generates a square coeffincent matrix for a given input diameter
 * 
 * 
 */
var fs = require('fs');


if(!process.argv[2]){
    console.log("error: please provide a diameter");
    return;
}

let diameter = Number(process.argv[2]);

if(diameter % 2 == undefined || diameter % 2 === 0){
    console.log("error: diameter must be an odd integer");
    return;
}
//console.log("diameter = " + diameter);

let k = [];

let radius = Math.floor(diameter / 2);

for(let i = 0; i < diameter; i++){
    k[i] = [];
    for(let j = 0; j < diameter; j++){

        //compute taxicab distance
        k[i][j] = Math.max(Math.abs(Math.abs(i - radius) + Math.abs( j - radius) - diameter) - radius, 0);
    }
}


fs.writeFile(`kernel-${diameter}.json`, JSON.stringify(k), 'utf8', (err) => { err ? console.log("An error occured while writing JSON Object to File.") : null});

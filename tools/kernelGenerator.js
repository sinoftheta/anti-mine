/**
 * Kernel Generator tool for Anti Mine
 * 
 * This tool generates a square coeffincent matrix for a given diameter
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



//let r = Math.floor(diameter / 2);
for(let i = 0; i < diameter; i++){
    k[i] = [];
    for(let j = 0; j < diameter; j++){

        //k[i][j] = 0;

        //pythagorean theorem to find distance from origin ... this algorithm sucks
        //let distance = Math.pow(Math.pow((i - r), 2) + Math.pow((j - r), 2), 0.5);
        //if(i === Math.floor(diameter / 2) && j === Math.floor(diameter / 2)) k[i][j] = 1;
            
    }
}


fs.writeFile(`kernel-${diameter}.json`, JSON.stringify(k), 'utf8', (err) => { err ? console.log("An error occured while writing JSON Object to File.") : null});

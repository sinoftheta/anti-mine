import { rasterizeGradient } from './ColorMap.js';
/*
derrive settings data from settings
console log current settings
*/
export const deriveSettingsData = (settings) => {
    if(!settings) return;

    console.log("mines: " + settings.numMines)

    // derive board dimensions from preset board 
    if(settings.presetBoard){
        settings.rows = settings.presetBoard.length;
        settings.columns = settings.presetBoard[0].length;
    }
    console.log('rows: ' + settings.rows)
    console.log('columns: ' + settings.columns)

    //random seed
    settings.seed = Math.floor(Math.random() * 420691337);
    console.log('using seed: ' + settings.seed);

    // derive kernel weight
    let kernelWeight = 0;
    let k = settings.kernels[settings.kernelSize][settings.kernelDecay];
    for(let i = 0; i < k.length; i++){
        for(let j = 0; j < k[0].length; j++){
            kernelWeight += k[i][j];
        }
    }
    settings.kernelWeight = kernelWeight;
    
    //rasterizeGradient 
    settings.gradientRaster = rasterizeGradient(settings.themes[settings.theme].data);
    console.log("theme: " + settings.themes[settings.theme].title);


    if(settings.debug && settings.debug.active) console.log(settings.debug);
}
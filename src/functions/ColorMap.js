/*
* gradientPointValue()
*
* inputs: gradient object, weight (integer in [1,100])
*
* output: hex color code string of generated color
*/
let gradientPointValue = (gradient, weight) => {
    //find colors surounding weight
    if(weight === gradient[0].weight){
        return `rgb(${gradient[0].r}, ${gradient[0].g}, ${gradient[0].b})`;
    }
    /*if(weight === gradient[100].weight){
        return `rgb(${gradient[100].r}, ${gradient[100].g}, ${gradient[100].b})`;
    }*/
    let i;
    for(i = 0; i < gradient.length; i++){
        if(weight >= gradient[i].weight) break;
    }

    let c1 = gradient[i];
    let c0 = gradient[i - 1];
    
    //console.log(c1);
    //console.log(c0);

    let npw = weight - c0.weight; // normalize point weight
    let ncw = c1.weight - c0.weight // normalize color weight

    // normalize weight, multiply by slope, add to first color
    let r = Math.round(c0.r + npw * (c1.r - c0.r) / ncw); 
    let g = Math.round(c0.g + npw * (c1.g - c0.g) / ncw); 
    let b = Math.round(c0.b + npw * (c1.b - c0.b) / ncw); 

    return `rgb(${r}, ${g}, ${b})`;
    //return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`; //hex code is kinda broken, results in RGBA values in some cases
}


/*
* gradientSetGenerator()
*
* inputs: gradient object,
*
* outputs: rasterized gradient (array of color values)
*/
export const rasterizeGradient = (g) => {

    let raster = [];
    for(let i = 0; i < 100; i++){
        raster.push(gradientPointValue(g, i));
    }
    return raster;
}



//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=COLOR MAPPING LOGIC=-==-=-==-=-=-=-=-===-=-=-=-=-==-=-=-=-=-=-=-
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-==-=-==-=-=-=-=-===-=-=-=-=-==-=-=-=-=-=-=-=-=-=
// cutoff is the ratio of kernelWeight that will be treated as the maximum color value
        //for example, if cutoff is 0.2, then any tile with weight >= 0.2 * kernelWeight will be drawn with the darkest/lightest color

export const colorMap = (tileVal, kWeight, cutoff, multiplier) => {

    //cutoff should be based on a lot of things, but a reasonable value is roughly around 0.12 to 0.06
    !cutoff ? cutoff = 0.07 : null;
    !multiplier ? multiplier = 1 : null;

    //cap value based on cutoff
    let cappedVal = Math.min(cutoff * kWeight, Math.max (-1 * cutoff * kWeight, tileVal * multiplier));

    //transform value into n [0,99]
    cappedVal += cutoff * kWeight; //shift value to be in [0, 2 * cutoff * kWeight]
    return Math.floor(cappedVal * 99 / (2 * cutoff * kWeight));
}

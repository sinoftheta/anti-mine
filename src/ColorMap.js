let gradients = [

    [
        {weight: 0,
            r: 255, g: 255, b: 255,},
        {weight: 20,
            r: 50, g: 250, b: 150,},
        {weight: 80,
            r: 50, g: 150, b: 250,},
        {weight: 100,
            r: 0, g: 0, b: 0,},
    ],

    [
        {weight: 0,
            r: 255, g: 0, b: 40,},
        {weight: 50,
            r: 255, g: 255, b: 255,},
        {weight: 100,
            r: 0, g: 40, b: 255,},
    ],

    [
        {weight: 0,
            r: 255, g: 255, b: 200,},
        {weight: 50,
            r: 100, g: 200, b: 150,},
        {weight: 100,
            r: 60, g: 52, b: 45,},
    ],
    [
        {weight: 0,
            r: 255, g: 240, b: 250,},
        {weight: 25,
            r: 50, g: 255, b: 40,},
        {weight: 50,
            r: 120, g: 125, b: 135,},
        {weight: 75,
            r: 20, g: 20, b: 200,},
        {weight: 100,
            r: 0, g: 0, b: 0,},
    ]
];


const gradientPointValue = (gradient, weight) => {
    let i;
    //find colors surounding weight
    for(i = 0; i < gradient.length; i++){
        if(gradient[i].weight > weight) break;
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
}

export const gradientPointValueFromChoice = (gradientChoice, weight) => gradientPointValue(gradients[gradientChoice], weight);
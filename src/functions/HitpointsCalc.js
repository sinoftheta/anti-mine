export const hitpointsCalc = (Kweight, mines, area) => {

    console.log("kweight: " + Kweight)
    console.log("Mines: " + mines)

    let hp = Math.ceil(mines * 0.25 * Kweight * 0.1); //formula needs improvement. gives 1hp for early levels.
    return hp; 

}
export default [

    {
        levelText: 'level 1', //other titles could be: 'tutorial' 'free play' 'chellenge'
        /*board settings */
        rows: 10,
        columns: 10,
        presetBoard: false, //boolean indicating the existance of a preset board
        boardPreset: [], //the preset board obj TODO: MAKE THESE 1 VAR
        randMines: true,
        numMines: 3,
        haveAntiMines: false,
        seed: Math.floor(Math.random() * 1337),
        
        /*kernel settings */ //need to change how kernels are referenced
        kernelSize: "_3x3",
        kernelDecay: "taxi",
        kernels: kernels,
        kernelWeight: 0,

        //this wont change by the level
        /*graphics settings */
        cellSizePreset: false,
        themes: ColorSchemes,
        theme: Math.floor(Math.random() * ColorSchemes.length),
        gradientRaster: [], //rasterized gradient
        cutoff: 0.7, //cutoff = 0.7 and multiplier = 4.5 are good defaults
        multiplier: 4.5,
        displayNums: true,
    },
    {
        levelText: 'level 2', 
        numMines: 4,
        seed: Math.floor(Math.random() * 1337),
    },
    {
        levelText: 'level 3', 
        numMines: 5,
        seed: Math.floor(Math.random() * 1337),
    },
    {
        levelText: 'level 4', 
        numMines: 6,
        seed: Math.floor(Math.random() * 1337),
    },
    {
        levelText: 'level 5',
        numMines: 3,
        haveAntiMines: true,
        seed: /*find a seed with 2 mines and 1 anti mine*/ 5,

    },


];
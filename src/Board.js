import Cell from './Cell.js';
import seedrandom from 'seedrandom';


// note: "gravity strength" roughly relates to the radius/size of the kernel
let kernel_vanillaMS = [[1, 1, 1],
                        [1, 1, 1],
                        [1, 1, 1]];

let kernel_gauss =   [[1, 2, 1],
                      [2, 4, 2],
                      [1, 2, 1]];

let my_kernel1 =       [[0.5,0.75,0.5],
                        [0.75,1,0.75],
                        [0.5,0.75,0.5]];

let kernel_gauss_comp = [1,2,1];

let my_kernel2 =         [[0, 0.25, 0.25, 0.25, 0],
                        [0.25, 0.5, 0.5, 0.5, 0.25],
                        [0.25, 0.5, 1, 0.5, 0.25],
                        [0.25, 0.5, 0.5, 0.5, 0.25],
                        [0, 0.25, 0.25, 0.25, 0]];



export default class Board{
    //contains all game logic
    constructor(settings){ //may change to num mines + num anti mines, maybe a mine will just have random value 

        this.seed = settings.seed;
        this.columns = settings.rows; //NEEDS REFACTOR, ROWS AND COLUMNS MISLABELED
        this.rows = settings.columns;
        this.numMines = settings.mines;

        //instantiate field of cells
        this.field = [];
        for(let i = 0; i < this.columns; i++){
            this.field[i] = [];
            for(let j = 0; j < this.rows; j++){
                this.field[i][j] = new Cell(i,j);
            }
        }

        //PLACES ALL MINES... good for testing max value after place numbers
        //this.iterateOverBoard((i,j) => {this.field[i][j].value = -1; this.field[i][j].isMine = true})
        this.placeMines();

        //choose a kernel as an argument for placeNumbers or make one up
        //https://en.wikipedia.org/wiki/Kernel_(image_processing)

        //this.placeNumbersConvolute([1,1,1], 1);
        //this.placeNumbersConvolute([1,1,1]);

        this.placeNumbersKernel(my_kernel2, 1); //total kernel weight = sum of all elements in kernel. Tile values will never exceed this weight as long as mine values are within [-1, 1]

        

    }
    iterateOverBoard(fi, fo){
        for(let i = 0; i < this.columns; i++){
            if(fo){fo(i);}
            for(let j = 0; j < this.rows; j++){
                fi(i, j);
            }
        }
    }
    placeMines(){ 
        let n = this.numMines, x, y, target,
        rng = seedrandom('' + this.seed + this.rows + this.columns);


        while(n > 0){
            y = Math.floor(rng() * this.columns );
            x = Math.floor(rng() * this.rows );
            target = this.field[y][x];


            //if no mine at x,y
            if(!target.isMine){

                //place mine at target
                //possibilities values (m) for mines are:

                //m = 1
                //target.value = 1;

                //m is a random element of {1, -1}
                target.value = rng() > .5 ? 1 : -1 ;


                //m is a weighted value in (0,1] (tends to be one)
                //let r = rng();
                //target.value = 1 - r * r;


                //m is a value in [-1, 1]
                //target.value = (rng() * 2) - 1;


                /***need to playtest each!!!***/

                target.isMine = true;
                --n;
            }
        }
        
    }
    //let kernel_gauss_comp = [1,2,1];
    placeNumbersConvolute(k0, normalize, k_option){ //REWRITE IN C WITH WEBASSEMBLY...?
        //https://www.youtube.com/watch?v=SiJpkucGa1o
        //https://www.youtube.com/watch?v=C_zFhWdM4ic
        //https://en.wikipedia.org/wiki/Multidimensional_discrete_convolution
        //performs a convolution with kernel k 


        //error checking to see if second arg exists/is valid
        let k1 = k0;
        if(typeof k_option === "array"){
            k1 = k_option;
        }


        let field = this.field;

        let tempField = [];
        
        
        //instantiate temp field within first iteration

        //CONVOLVE FROM ORIG INTO TEMP ARRAY
        for(let i = 0; i < this.columns; i++){ //vertical
            
            tempField[i] = [];

            for(let j = 0; j < this.rows; j++){ //horizontal

                let terms = 0;

                tempField[i][j] = 0;

                for(let m = 0; m < k0.length; m++){

                    let offset = m - Math.floor(k0.length/2);

                    //check if kernel is out of bounds
                    if(field[i + offset] && field[i + offset][j]){

                        //convolve on (i,j)
                        tempField[i][j] += field[i + offset][j].value * k0[m]; 
                        ++terms;
                    }
                }
            }
        }

        //CONVOLVE FROM TEMP INTO/OVERWRITITNG ORIG ARRAY
        for(let i = 0; i < this.columns; i++){ //vertical
            for(let j = 0; j < this.rows; j++){ //horizontal

                let terms = 0, csum = 0;
                field[i][j].value = 0;

                for(let m = 0; m < k1.length; m++){

                    let offset = m - Math.floor(k1.length/2);

                    //check if kernel is out of bounds
                    if(field[i] && field[i][j + offset]){

                        //convolve on (i,j)
                        field[i][j].value += tempField[i][j + offset] * k1[m] / normalize; 
                        ++terms;
                    }   
                }
            }
        }
    }
    placeNumbersKernel(k, normalize){
        let field = this.field;

        let tempField = [];
        
        
        //instantiate temp field within first iteration

        //iterate through image
        for(let i = 0; i < this.columns; i++){ //vertical
            tempField[i] = [];
            for(let j = 0; j < this.rows; j++){ //horizontal
                
                tempField[i][j] = 0;

                //iterate through kernel
                for(let m = 0; m < k.length; m++){

                    let offset_i = m - Math.floor(k.length/2);

                    for(let n = 0; n < k[0].length; n++ ){

                        let offset_j = n - Math.floor(k[0].length/2);
                    
                        //check if kernel is out of bounds & not mine
                        if(field[i + offset_i] && field[i + offset_i][j + offset_j]){

                            //compute new val
                            tempField[i][j] += field[i + offset_i][j + offset_j].value * k[m][n]; 
                        }
                    }
                }
            }
        }

        //put temp values in field
        for(let i = 0; i < this.columns; i++){ //vertical
            for(let j = 0; j < this.rows; j++){ //horizontal
                this.field[i][j].value = tempField[i][j] / normalize;
            }
        }

    }


    uncoverTile(x,y, prevMagnitude){
        let field = this.field;

        //check if field[x][y] exists
        if(!(field[x] && field[x][y])){
            return;
        }
        
        let target = field[x][y];

        //check if tile is covered
        if(target.uncovered) return;

        //check that previous magnitude exists and is greater or equal to target magnitude 
        if(prevMagnitude && prevMagnitude < Math.abs(target.val)){
            console.log("boundary condition met");
            return;
        }

        //reveal tile
        target.uncovered = true;
        console.log(`${x},${y} revealed`);


        //check lose condition
        if(target.isMine){
            //lose
            return;
        }

        //check win condition
        let gameWon = false;
        if(gameWon) return;

        //recurse over all neighbors that are not mines 
        //AND that have a smaller ABSOLUTE value than the target

        let magnitude = Math.abs(target.value);

        //east
        this.uncoverTile(x + 1, y, magnitude);

        //northeast
        this.uncoverTile(x + 1, y + 1, magnitude);

        //north
        this.uncoverTile(x, y + 1, magnitude);

        //northwest
        this.uncoverTile(x - 1, y + 1, magnitude);

        //west
        this.uncoverTile(x - 1, y, magnitude);

        //southwest
        this.uncoverTile(x - 1, y - 1, magnitude);

        //south
        this.uncoverTile(x, y - 1, magnitude);

        //southeast
        this.uncoverTile(x + 1, y - 1, magnitude);


    }

}
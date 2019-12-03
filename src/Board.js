import Cell from './Cell.js';
import seedrandom from 'seedrandom';

export default class Board{
    //handles board memory + operations
    constructor(seed, rows, columns, numMines){ //may change to num mines + num anti mines, maybe a mine will just have random value 

        this.seed = seed;
        this.rows = rows;
        this.columns = columns;
        this.numMines = numMines;
        this.totalTiles = columns * rows;

        //instantiate field of cells
        this.field = [];
        for(let i = 0; i < this.columns; i++){
            this.field[i] = [];
            for(let j = 0; j < this.rows; j++){
                this.field[i][j] = new Cell(i,j);
            }
        }

        this.placeMines();

        //choose a kernel as an argument for placeNumbers or make one up
        //https://en.wikipedia.org/wiki/Kernel_(image_processing)
        this.placeNumbers([1,1,1]);

    }
    iterateOverBoard(fi, fo){
        for(let i = 0; i < this.columns; i++){
            fo(i);
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
    placeNumbers(k){ //REWRITE IN C WITH WEBASSEMBLY
        //https://www.youtube.com/watch?v=SiJpkucGa1o
        //https://www.youtube.com/watch?v=C_zFhWdM4ic
        //https://en.wikipedia.org/wiki/Multidimensional_discrete_convolution
        //performs a convolution with kernel k 

        let field = this.field;

        let tempField = [];
        
        
        //instantiate temp field within first iteration

        //CONVOLVE FROM ORIG INTO TEMP ARRAY
        for(let i = 0; i < this.columns; i++){ //vertical
            
            tempField[i] = [];

            for(let j = 0; j < this.rows; j++){ //horizontal

                let terms = 0;

                tempField[i][j] = 0;

                for(let m = 0; m < k.length; m++){

                    let offset = m - Math.floor(k.length/2);

                    //check if kernel is out of bounds
                    if(field[i + offset] && field[i + offset][j]){

                        //convolve on (i,j)
                        tempField[i][j] += field[i + offset][j].value * k[m]; 
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

                for(let m = 0; m < k.length; m++){

                    let offset = m - Math.floor(k.length/2);

                    //check if kernel is out of bounds
                    if(field[i] && field[i][j + offset]){

                        //convolve on (i,j)
                        field[i][j].value += tempField[i][j + offset] * k[m]; 
                        ++terms;
                    }
                    
                }
                
            }
        }
        
        

        /*        
        for(let i = 0; i < this.columns; i++){ //vertical

            //tempField2[i] = [];

            for(let j = 0; j < this.rows; j++){ //horizontal

                let csum = 0, terms = 0;

                for(let m = 0; m < k.length; m++){

                    let offset = m - Math.floor(k.length/2);

                    //check if kernel is out of bounds
                    if(field[i] && field[i][j + offset]){

                        //calc cumulative weighted sum for (i,j)
                        //csum += field[i][j + offset].value * k[m]; 
                        csum += tempField[i][j + offset];
                        ++terms;
                    }
                    
                }

                //calc weighted average for cell
                tempField[i][j] = csum;// / terms;

            }
        }
        */
        /*
        this.iterateOverBoard((y, x) => {
                this.field[y][x].value = tempField[y][x];// + tempField2[y][x];
        }, (i)=>{})
        */


    }

}
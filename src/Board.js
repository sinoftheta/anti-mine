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

    }
    iterateOverBoard(i, o){ //unused / not needed
        for(let i = 0; i < this.columns; i++){
            o? o(i) : null;
            for(let j = 0; j < this.rows; j++){
                i(i, j);
            }
        }
    }

    placeMines(){ 
        let n = this.numMines, x, y, target,
        rng = seedrandom('' + this.seed + this.rows + this.columns);


        while(n > 0){
            x = Math.floor(rng() * this.columns );
            y = Math.floor(rng() * this.rows );
            target = this.field[x][y];


            //if no mine at x,y
            if(!target.isMine){
                /* possibilities values (m) for mines are:
                m = 1
                m is an element of {1, -1}
                m is a value in (0,1], possibly weighted (towards 1)
                m is a value in [-1, 1]

                need to playtest each
            */
                //place mine at target
                this.target.value = 1;
                this.target.isMine = true;
                --n;
            }
        }
        
    }
    //let kernel_gauss_comp = [1,2,1];
    placeNumbers(k){
        //https://www.youtube.com/watch?v=SiJpkucGa1o
        //https://www.youtube.com/watch?v=C_zFhWdM4ic
        //performs a 2 pass convolution with kernel k 




    }


}
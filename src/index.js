import css from './style.css';

let kernel_vanillaMS = [[1, 1, 1],
                        [1, 0, 1],
                        [1, 1, 1]];

let kernel_gauss_1 =   [[1, 2, 1],
                        [2, 4, 2],
                        [1, 2, 1]];

let kernel_1 =         [[0.25, 0.25, 0.25, 0.25, 0.25],
                        [0.25, 0.5, 0.5, 0.5, 0.25],
                        [0.25, 0.5, 0, 0.5, 0.25],
                        [0.25, 0.5, 0.5, 0.5, 0.25],
                        [0.25, 0.25, 0.25, 0.25, 0.25]];
class Cell{
    //if a cell is a mine, then its value will be 1, -1, or possibly in the range [-1,1]
    //if a cell is not a mine, then its value will be based off the local/surounding mine values
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.mine = false;
        this.uncovered = false;
        this.value = 0; 
    }
    id(){
        return `cell-${this.x}-${this.y}`;
    }
}
class Board{

    constructor(seed, rows, columns, numMines){
        this.seed = seed;
        this.rows = rows;
        this.columns = columns;
        this.numMines = numMines;
        this.totalTiles = columns * rows;

        //instantiate field of cells...
        this.field = [];
        for(let i = 0; i < this.columns; i++){
            this.field[i] = [];
            for(let j = 0; j < this.rows; j++){
                this.field[i][j] = new Cell(i,j);
            }
        }

    }
    iterateOverBoard(i, o){ //not needed tbh
        for(let i = 0; i < this.columns; i++){
            o? o(i) : null;
            for(let j = 0; j < this.rows; j++){
                i(i, j);
            }
        }
    }

    placeMines(){
        let n = this.numMines;

        while(n > 0){
            
        }
        
    }
    placeNumbers(k){
        //https://www.youtube.com/watch?v=SiJpkucGa1o
        //https://www.youtube.com/watch?v=C_zFhWdM4ic
        //performs a convolution with kernel k 
        this.iterateOverBoard((i, j) => {
            
        });
    }


}
class Board_render{
    constructor(container, board){
        this.container = container;
        this.board = board;

        for(let i = 0; i < this.board.columns; i++){

            let row = container.appendChild(document.createElement("div"));
            row.id = `row-${i}`;
            row.className = `game-row`;

            for(let j = 0; j < this.board.rows; j++){

                let cell = row.appendChild(document.createElement("div"));
                cell.id = this.board.field[i][j].id;
                cell.className = `game-cell`;
                cell.onClick = () => {

                };

            }
        }
    }
}

class Game_manager{

}


console.log('Hello World!');

let board = new Board(0, 5, 5, 5);
let board_render = new Board_render(document.getElementById("game-board"), board);



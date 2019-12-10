import css from './style.css';
import Board from './Board.js';
import BoardRender from './BoardRender.js';
import GameManager from './GameManager.js';
//import fontawesome from 'fontawesome';

//http://antimi.ne/ want but its like $420 a year lmao
//https://www.youtube.com/watch?v=SiJpkucGa1o
//https://www.youtube.com/watch?v=C_zFhWdM4ic
//https://en.wikipedia.org/wiki/Multidimensional_discrete_convolution
//https://en.wikipedia.org/wiki/Kernel_(image_processing)

// note: "gravity strength" roughly relates to the radius/size of the kernel
let kernel_vanillaMS = [[1, 1, 1],
                        [1, 1, 1],
                        [1, 1, 1]];

let kernel_gauss =   [[1, 2, 1],
                      [2, 4, 2],
                      [1, 2, 1]];

let my_kernel_1 =       [[0.5,0.75,0.5],
                        [0.75,1,0.75],
                        [0.5,0.75,0.5]];

let kernel_gauss_comp = [1,2,1];

let my_kernel_2 =         [[0, 0.25, 0.25, 0.25, 0],
                        [0.25, 0.5, 0.5, 0.5, 0.25],
                        [0.25, 0.5, 1, 0.5, 0.25],
                        [0.25, 0.5, 0.5, 0.5, 0.25],
                        [0, 0.25, 0.25, 0.25, 0]];

let my_kernel_3 =  [[0,     0,      0.125,  0.25,   0.125,  0,      0   ],
                    [0,     0.125,  0.25,   0.5,    0.25,   0.125,  0   ],
                    [0.125, 0.25,   0.5,    0.5,    0.5,    0.25,   .125],
                    [0.25, 0.5,   0.5,      1,      0.5,    0.5,    0.25],
                    [0.125, 0.25,   0.5,    0.5,    0.5,    0.25,   .125],
                    [0,     0.125,  0.25,   0.5,    0.25,   0.125,  0   ],
                    [0,     0,      0.125,  0.25,  0.125,  0,       0   ]];

let my_kernel_4 =  [[0,     0,      0.125,  0.25,   0.125,  0,      0   ], //diagonal bands seem to work the best for kernels...
                    [0,     0.125,  0.25,   0.5,    0.25,   0.125,  0   ],
                    [0.125, 0.25,   0.5,    0.75,   0.5,    0.25,   0.125],
                    [0.25,  0.5,    0.75,   1,      0.75,   0.5,    0.25],
                    [0.125, 0.25,   0.5,    0.75,   0.5,    0.25,   0.125],
                    [0,     0.125,  0.25,   0.5,    0.25,   0.125,  0   ],
                    [0,     0,      0.125,  0.25,   0.125,  0,      0   ]];



/** FUCK IT
 *       _______________________ > Y AXIS, USE j TO ITERATE, COLUMNS
 *      |
 *      |
 *      |
 *      |
 *      |
 *      V X AXIS, USE i TO ITERATE, ROWS
 * 
 */
                
let my_settings = {
    rows: 25,
    columns: 40,
    mines: Math.floor((Math.random() * 18) + 3),
    seed: Math.floor(Math.random() * 1000),
    kernel: my_kernel_4,
}

class Broadcaster{
    constructor(){
        this.subscribers = [];
    }
    subscribe(subscriber){

        this.subscribers.push(subscriber);
    }
    dispatchEvent(event, data){
        this.subscribers.forEach((subscriber) =>{
            subscriber.dispatchEvent(event, data);
        });
    }
}

let boardContainer = document.getElementById("game-board");
let broadcaster = new Broadcaster;

let game_manager = new GameManager(boardContainer, my_settings, broadcaster);
broadcaster.subscribe(game_manager);

let board = new Board(my_settings, broadcaster);
broadcaster.subscribe(board);

let board_render = new BoardRender(boardContainer, board, broadcaster);
broadcaster.subscribe(board_render);

//lol dont do this...
//broadcaster.dispatchEvent(new CustomEvent('tileClick', { detail: {x: 1, y: 2 }}));

/**
 * events:
 * gameWon
 * gameLost
 * tileClicked
 * tileStateUpdated
 * tilesRendered
 * 
 */
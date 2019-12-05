import css from './style.css';
import Board from './Board.js';
import BoardRender from './BoardRender.js';
//import fontawesome from 'fontawesome';

//http://antimi.ne/ want but its like $420 a year lmao

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

let my_kernel_3 =   [[0,     0,      0.125,  0.125,  0.125,  0,      0],
                    [0,     0.125,  0.25,   0.5,    0.25,   0.125,  0],
                    [0.125, 0.25,   0.5,    0.5,    0.5,    0.25,   1.25],
                    [0.125, 0.25,   0.5,    1,      0.5,    0.25,   1.25],
                    [0.125, 0.25,   0.5,    0.5,    0.5,    0.25,   1.25],
                    [0,     0.125,  0.25,   0.5,    0.25,   0.125,  0],
                    [0,     0,      0.125,  0.125,  0.125,  0,      0]];



let my_settings = {
    rows: 10,
    columns: 15,
    mines: Math.floor(Math.random() * 12 + 3),
    seed: Math.floor(Math.random() * 1000),
    kernel: kernel_vanillaMS,
}
console.log(my_settings);


let board = new Board(my_settings);
let board_render = new BoardRender(document.getElementById("game-board"), board);



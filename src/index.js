import css from './style.css';
import Board from './Board.js';
import BoardRender from './BoardRender.js';
//import fontawesome from 'fontawesome';

//import { callbackify } from 'util'; //???
//http://antimi.ne/ want

let kernel_vanillaMS = [[1, 1, 1],
                        [1, 1, 1],
                        [1, 1, 1]];

let kernel_gauss =   [[1, 2, 1],
                      [2, 4, 2],
                      [1, 2, 1]];

let kernel_gauss_comp = [1,2,1];

let kernel_1 =         [[0.25, 0.25, 0.25, 0.25, 0.25],
                        [0.25, 0.5, 0.5, 0.5, 0.25],
                        [0.25, 0.5, 1, 0.5, 0.25],
                        [0.25, 0.5, 0.5, 0.5, 0.25],
                        [0.25, 0.25, 0.25, 0.25, 0.25]];



class Game_manager{

}


console.log('Hello World!');

let board = new Board(1, 10, 10, 5);
let board_render = new BoardRender(document.getElementById("game-board"), board);



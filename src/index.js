import css from './style.css';
//components
import Board from './components/Board.js';
import BoardRender from './components/BoardRender.js';
import GameManager from './components/GameManager.js';
import Broadcaster from './components/Broadcaster.js';
import OptionsMenu from './components/OptionsMenu.js';
import TileSelector from './components/TileSelector.js';

//assets
import * as kernel from './assets/Kernels.js';
import * as gradient from './assets/Gradients.js';

//functions
import {rasterizeGradient} from './functions/ColorMap.js'



//initial game settings
let init_settings = {
    rows: 5,
    columns: 5,
    presetBoard: false,
    randMines: true,
    mines: 2,//Math.floor(Math.random() * 30) + 45,
    seed: 2,//Math.floor(Math.random() * 1337),
    cellSize: 20,
    kernel: kernel._5x5_exp2,
    kernelWeight: 0,
    gradients: [],
    displayNums: false,
    boardPreset: [],
    /*debug: {
        active: false,
        uncoverAll: true,
        showMines: false,

    }*/
}
console.log("mines: " + init_settings.mines)
console.log("seed: " + init_settings.seed)

/*
* Settings Prepreocessing
*/
if(init_settings.presetBoard){
    init_settings.rows = init_settings.presetBoard[0].length;
    init_settings.columns = init_settings.presetBoard.length;
}

// derive kernel weight
let kernelWeight = 0;
for(let i = 0; i < init_settings.kernel.length; i++){
    for(let j = 0; j < init_settings.kernel[0].length; j++){
        kernelWeight += init_settings.kernel[i][j];
    }
}
init_settings.kernelWeight = kernelWeight;

// generate raster for gradients
init_settings.gradients.push(rasterizeGradient(gradient.g1));
init_settings.gradients.push(rasterizeGradient(gradient.g2));
init_settings.gradients.push(rasterizeGradient(gradient.g3));
init_settings.gradients.push(rasterizeGradient(gradient.g4));
init_settings.gradients.push(rasterizeGradient(gradient.g5));
init_settings.gradients.push(rasterizeGradient(gradient.g6));




/*
* Instantiate components
*/

let boardContainer = document.getElementById("game-board");
let broadcaster = new Broadcaster;

let game_manager = new GameManager(document.body, init_settings, broadcaster);
broadcaster.subscribe(game_manager);

let board = new Board(init_settings, broadcaster);
broadcaster.subscribe(board);

let board_render = new BoardRender(boardContainer, board, init_settings, broadcaster);
broadcaster.subscribe(board_render);

let options_menu = new OptionsMenu(document.body, init_settings, broadcaster);

let tile_selector = new TileSelector(boardContainer, init_settings, broadcaster);
broadcaster.subscribe(tile_selector);


/**
 * events:
 * gameWon
 * gameLost
 *      - gameWon and GameLost could carry game stats objects
 * tileClicked
 *      - carries x and y data fo click
 * tileStateUpdated
 *      - could carry a list of coordinates that were updated
 * tilesRendered
 * 
 */


//http://antimi.ne/ want but its like $420 a year lmao
//https://www.youtube.com/watch?v=SiJpkucGa1o
//https://www.youtube.com/watch?v=C_zFhWdM4ic
//https://en.wikipedia.org/wiki/Multidimensional_discrete_convolution
//https://en.wikipedia.org/wiki/Kernel_(image_processing)


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


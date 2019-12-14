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
    rows: 30,
    columns: 40,
    randMines: true,
    mines: Math.floor(Math.random() * 30) + 45,
    seed: Math.floor(Math.random() * 1337),
    cellSize: 30,
    kernel: kernel._15x15_geo2,
    kernelWeight: 0,
    gradients: [],
    displayNums: false,
    boardPreset: [],
}
console.log("mines: " + init_settings.mines)

/*
* Init kernel and gradients
*/


// derive kernel weight
// weight does not need to be normalized if kernel is already normalized
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


//presetBoard:


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


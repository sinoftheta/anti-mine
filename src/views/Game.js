//components
import GameLogic from '../components/GameLogic.js';
import BoardRender from '../components/BoardRender.js';
import GameManager from '../components/GameManager.js';
import Broadcaster from '../components/Broadcaster.js';
import OptionsMenu from '../components/OptionsMenu.js';
import TileSelector from '../components/TileSelector.js';
import HealthBar from '../components/HealthBar.js';

//assets
import * as kernel from '../assets/Kernels.js';
import * as gradient from '../assets/Gradients.js';
import * as boards from '../assets/PresetBoards.js';

//functions
import {rasterizeGradient} from '../functions/ColorMap.js';


/************************************************************** 
        SOME OF THIS GOES IN ANOTHER VIEW
********V*V*V*V*V*V*V*V*V*V*V*V*V*V*V*V*V*V*V*V*V*V*V*V*V*V*V**/

export default function(){

    //initial game settings
    let init_settings = {
        rows: 12,
        columns: 12,
        presetBoard: false,
        randMines: true,
        mines: 7,//Math.floor(Math.random() * 30) + 45,
        seed: 7,//Math.floor(Math.random() * 1337),
        cellSize: 20,
        kernel: kernel._9x9_exp2,
        kernelWeight: 0,
        gradients: [],
        displayNums: false,
        boardPreset: [],
        debug: {
            active: false,
            uncoverAll: false,
            showMines: false,
            indicate_hidden_mine: true,
        }
    }
    console.log("mines: " + init_settings.mines)
    console.log("seed: " + init_settings.seed)

    /*
    * Settings Prepreocessing
    */
    if(init_settings.presetBoard){
        init_settings.rows = init_settings.presetBoard.length;
        init_settings.columns = init_settings.presetBoard[0].length;
    }
    console.log('rows: ' + init_settings.rows)
    console.log('columns: ' + init_settings.columns)

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

    let game_logic = new GameLogic(init_settings, broadcaster);
    broadcaster.subscribe(game_logic);

    let board_render = new BoardRender(boardContainer, game_logic, init_settings, broadcaster);
    broadcaster.subscribe(board_render);

    let healthbar = new HealthBar(document.body, game_logic, init_settings, broadcaster);
    broadcaster.subscribe(healthbar);

    let options_menu = new OptionsMenu(document.body, init_settings, broadcaster);

    let tile_selector = new TileSelector(boardContainer, init_settings, broadcaster);
    broadcaster.subscribe(tile_selector);


}



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


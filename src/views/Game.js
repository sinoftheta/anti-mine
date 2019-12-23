//components
import GameLogic from '../components/GameLogic.js';
import BoardRender from '../components/BoardRender.js';
import GameManager from '../components/GameManager.js';
import Broadcaster from '../components/Broadcaster.js';
import OptionsMenu from '../components/OptionsMenu.js';
import TileSelector from '../components/TileSelector.js';
import HealthBar from '../components/HealthBar.js';
import MinesCounter from '../components/MinesCounter.js';

//assets
import {kernels} from '../assets/Kernels.js';
import * as gradient from '../assets/Gradients.js';
import * as boards from '../assets/PresetBoards.js';

//functions
import {rasterizeGradient} from '../functions/ColorMap.js';
import {deriveSettingsData} from '../functions/DeriveSettingsData.js';


/************************************************************** 
        SOME OF THIS GOES IN ANOTHER VIEW
********V*V*V*V*V*V*V*V*V*V*V*V*V*V*V*V*V*V*V*V*V*V*V*V*V*V*V**/

export default function(){

    //initial game settings
    let init_settings = {

        /*board settings */
        rows: 12,
        columns: 20,
        presetBoard: false, //boolean indicating the existance of a preset board
        boardPreset: [], //the preset board obj TODO: MAKE THESE 1 VAR
        randMines: true,
        mines: Math.floor(Math.random() * 10) + 5,
        seed: Math.floor(Math.random() * 1337),
        
        /*kernel settings */
        kernelSize: "_7x7",
        kernelDecay: "exp2",
        kernels: kernels,
        kernelWeight: 0,

        /*graphics settings */
        cellSize: 20,
        gradients: [],
        cutoff: 0.7, //cutoff = 0.7 and multiplier = 4.5 are good defaults
        multiplier: 4.5,
        displayNums: false, //might turn into a debug feature idk

        /*debug */
        debug: {
            active: false,
            uncoverAll: false,
            showMines: false,
            indicate_hidden_mine: true,
        }
    }


    // generate raster for gradients
    init_settings.gradients.push(rasterizeGradient(gradient.g1));
    init_settings.gradients.push(rasterizeGradient(gradient.g2));
    init_settings.gradients.push(rasterizeGradient(gradient.g3));
    init_settings.gradients.push(rasterizeGradient(gradient.g4));
    init_settings.gradients.push(rasterizeGradient(gradient.g5));
    init_settings.gradients.push(rasterizeGradient(gradient.g6));


    deriveSettingsData(init_settings);




    /*
    * Instantiate components
    */

    let broadcaster = new Broadcaster;

    let game_manager = new GameManager(document.body, init_settings, broadcaster);
    broadcaster.subscribe(game_manager);

    let game_logic = new GameLogic(init_settings, broadcaster);
    broadcaster.subscribe(game_logic);

    let options_menu = new OptionsMenu(document.body, init_settings, broadcaster);

    /**GAME INTERFACES */

    let board_render = new BoardRender(document.getElementById("game-board"), game_logic, init_settings, broadcaster);
    broadcaster.subscribe(board_render);

    let healthbar = new HealthBar(document.getElementById('hp-container'), game_logic, init_settings, broadcaster);
    broadcaster.subscribe(healthbar);

    let tile_selector = new TileSelector(document.getElementById("game-board"), init_settings, broadcaster);
    broadcaster.subscribe(tile_selector);

    let mines_counter = new MinesCounter(document.getElementById("mine-counter-container"), game_logic, init_settings);
    broadcaster.subscribe(mines_counter);


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


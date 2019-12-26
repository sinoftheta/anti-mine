//components
import GameLogic from '../components/GameLogic.js';
import BoardRender from '../components/BoardRender.js';
import GameManager from '../components/GameManager.js';
import Broadcaster from '../components/Broadcaster.js';
import OptionsMenu from '../components/OptionsMenu.js';
import TileSelector from '../components/TileSelector.js';
import HealthBar from '../components/HealthBar.js';
import MinesCounter from '../components/MinesCounter.js';
import BottomToolbar from '../components/BottomToolbar.js';
import KernelTooltip from '../components/KernelTooltip.js';

//assets
import {kernels} from '../assets/Kernels.js';
import ColorSchemes from '../assets/ColorSchemes.js';
import * as boards from '../assets/PresetBoards.js';

//functions
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
        kernelSize: "_9x9",
        kernelDecay: "linear",
        kernels: kernels,
        kernelWeight: 0,

        /*graphics settings */
        cellSizePreset: false,
        cellSize: 20, 
        themes: ColorSchemes,
        theme: 0, //defaults to 0th theme
        gradientRaster: [], //rasterized gradient
        cutoff: 0.7, //cutoff = 0.7 and multiplier = 4.5 are good defaults
        multiplier: 4.5,
        displayNums: true,

        /*debug */
        debug: {
            active: false,
            uncoverAll: false,
            showMines: false,
            indicate_hidden_mine: false,
        }
    }

    deriveSettingsData(init_settings);

    /*
    * Instantiate components
    */

    /*LOGIC */
    let broadcaster = new Broadcaster;

    let game_manager = new GameManager(document.body, init_settings, broadcaster);
    broadcaster.subscribe(game_manager);

    let game_logic = new GameLogic(init_settings, broadcaster);
    broadcaster.subscribe(game_logic);

    /**GAME COMPONENTS */
    let board_render = new BoardRender(document.getElementById("game-board"), game_logic, init_settings, broadcaster);
    broadcaster.subscribe(board_render);

    let healthbar = new HealthBar(document.getElementById('hp-container'), game_logic, init_settings, broadcaster);
    broadcaster.subscribe(healthbar);

    let mines_counter = new MinesCounter(document.getElementById("mine-counter-container"), game_logic, init_settings);
    broadcaster.subscribe(mines_counter);

    let bottom_toolbar = new BottomToolbar(document.getElementById("color-levels-container"), init_settings, broadcaster);

    /* GAME peripherals*/
    let tile_selector = new TileSelector(document.getElementById("game-board"), init_settings, broadcaster);
    broadcaster.subscribe(tile_selector);

    let kernel_tooltip = new KernelTooltip(document.getElementById("game-board"), init_settings);
    broadcaster.subscribe(kernel_tooltip);

    /*MENUS*/
    let options_menu = new OptionsMenu(document.body, init_settings, broadcaster);

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


import GameManager from './GameManager.js';

//components

import Broadcaster from '../components/Broadcaster.js';
import OptionsMenu from '../components/OptionsMenu.js';
import ColorSelector from '../components/ColorSelector.js';
//import AspectDetector from '../components/AspectDetector.js'; //might yoink to this file

//assets
import ColorSchemes from '../assets/ColorSchemes.js';


//functions
import {deriveSettingsData} from '../functions/DeriveSettingsData.js';

//initial game settings... import from another file
    let init_settings = {


        // SETTINGS THAT GENERALLY ARENT ASSOCIATED WITH A LEVEL

        /*graphics settings */
        cellSizePreset: false,
        themes: ColorSchemes,
        theme: Math.floor(Math.random() * ColorSchemes.length),
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

export default function(){
    let broadcaster = new Broadcaster;

    let game_manager = new GameManager(document.body, init_settings, broadcaster);
    broadcaster.subscribe(game_manager);

    /*MENUS*/
    let options_menu = new OptionsMenu(document.body, init_settings, broadcaster); //??? will prob rework

    let color_selector = new ColorSelector(document.body, init_settings, broadcaster); // restyle?

    /* LISTENERS */

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


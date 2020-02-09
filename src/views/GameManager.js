import * as _ from 'lodash';
import { deriveSettingsData } from "../functions/DeriveSettingsData";
import levels from '../assets/Levels.js'

//components
import GameLogic from '../components/GameLogic.js';
import BoardRender from '../components/BoardRender.js';
import Broadcaster from '../components/Broadcaster.js';
import OptionsMenu from '../components/OptionsMenu.js';
import TileSelector from '../components/TileSelector.js';
import HealthBar from '../components/HealthBar.js';
import MinesCounter from '../components/MinesCounter.js';
import BottomToolbar from '../components/BottomToolbar.js';
import KernelTooltip from '../components/KernelTooltip.js';
import ColorSelector from '../components/ColorSelector.js';
import AspectDetector from '../components/AspectDetector.js'; 


/**
 * 
 * SUBSCRIBES TO: gameWon, gameLost, reset
 * 
 * BROADCASTS: reset
 * 
 */

 /**
  * Determines game settings based off of level/world object
  * 
  * 
  */
export default class GameManager extends EventTarget{

    constructor(modalContainer, init_settings, broadcaster){
        super();
        this.level = 0;
        this.levels = levels;
        this.settings = init_settings;
        _.merge(this.settings, this.levels[this.level]);
        //console.log(this.levels[this.level]);
        console.log(this.settings);

        this.modalContainer = modalContainer;
        this.broadcaster = broadcaster;
        //this.addEventListener('tileClick', (e) => console.log(e.detail), false);
        this.addEventListener('gameWon', (e) => this.gameWon(), false);
        this.addEventListener('gameLost', (e) => this.gameLost(), false);

        this.addEventListener('reset', (e) => {
            this.modal && this.modal.parentNode === this.modalContainer ? this.modalContainer.removeChild(this.modal) : null;
        }, false);

        this.init();

    }
    init(){
        //instantiate all elements

        /*GAME LOGIC */
        let game_logic = new GameLogic(this.settings, this.broadcaster);
        this.broadcaster.subscribe(game_logic);

        /**GAME COMPONENTS */
        let board_render = new BoardRender(document.getElementById("game-board"), game_logic, this.settings, this.broadcaster);
        this.broadcaster.subscribe(board_render);

        let healthbar = new HealthBar(document.getElementById('hp-container'), game_logic, this.settings, this.broadcaster);
        this.broadcaster.subscribe(healthbar);

        let mines_counter = new MinesCounter(document.getElementById("mine-counter-container"), game_logic, this.settings);
        this.broadcaster.subscribe(mines_counter);

        let bottom_toolbar = new BottomToolbar(document.getElementById("color-levels-container"), this.settings, this.broadcaster);

        let size_manager = new AspectDetector(this.settings, this.broadcaster);
        this.broadcaster.subscribe(size_manager);

        /* GAME peripherals*/
        let tile_selector = new TileSelector(document.getElementById("game-board"), this.settings, this.broadcaster);
        this.broadcaster.subscribe(tile_selector);

        let kernel_tooltip = new KernelTooltip(document.getElementById("game-board"), this.settings);
        this.broadcaster.subscribe(kernel_tooltip);

        this.createNewGame();

    }
    gameWon(){

        //incremement level without going out of bounds
        this.level = Math.min(this.level + 1, this.levels.length - 1); 


        //assign global settings by overwriting changes
        _.merge(this.settings, this.levels[this.level]);

        this.playAgainPopup("Congrats, you located all the mines!", "Next Level");
    }
    gameLost(){

        // level does not change upon losing a game

        this.playAgainPopup("Oh no, you were annihilated!", "Try Again");
    }
    playAgainPopup(message, buttonText){

        this.modal = document.createElement("div");
        let resetButton = document.createElement("button");
        let messageContainer = document.createElement("div");

        this.modal.id = "game-over-modal"
        this.modal.appendChild(messageContainer);
        this.modal.appendChild(resetButton);

        resetButton.onclick = (e) => this.createNewGame();
        resetButton.innerHTML = buttonText;

        messageContainer.innerHTML = message;

        this.modalContainer.appendChild(this.modal);

        resetButton.focus();
    }


    gotoLevel(level){

        //set level
        this.level = level;

        this.createNewGame();
    }
    setMode(mode){

        //modify settings based on mode

        // add / remove settings menu

        // reset
    }
    createNewGame(){
        
        deriveSettingsData(this.settings);
        this.broadcaster.dispatchEvent(new CustomEvent('reset', {detail: {settings: this.settings}}));
    }

}
import * as _ from 'lodash';
import { deriveSettingsData } from "../functions/DeriveSettingsData";

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

    constructor(modalContainer,levels, broadcaster){
        super();
        this.level = 0;
        this.levels = levels;
        this.modalContainer = modalContainer;
        this.broadcaster = broadcaster;
        //this.addEventListener('tileClick', (e) => console.log(e.detail), false);
        this.addEventListener('gameWon', (e) => this.gameWon(), false);
        this.addEventListener('gameLost', (e) => this.gameLost(), false);

        this.addEventListener('reset', (e) => {
            this.modal && this.modal.parentNode === this.modalContainer ? this.modalContainer.removeChild(this.modal) : null;
        }, false);

    }
    init(){
         //instantiate all elements
    }
    gameWon(){

        this.playAgainPopup("Congrats, you located all the mines!");

        
        this.level += 1; // need to cap level


        //assign global settings
        

        //next level
    }
    gameLost(){


        this.playAgainPopup("Oh no, you were annihilated!")
    }


    createNewGame(){
        



        deriveSettingsData(this.settings);
        this.broadcaster.dispatchEvent(new CustomEvent('reset', {detail: {settings: this.settings}}));
    }
    playAgainPopup(message){

        this.modal = document.createElement("div");
        let resetButton = document.createElement("button");
        let messageContainer = document.createElement("div");

        this.modal.id = "game-over-modal"
        this.modal.appendChild(messageContainer);
        this.modal.appendChild(resetButton);

        resetButton.onclick = (e) => this.createNewGame();
        resetButton.innerHTML = "Play Again";

        messageContainer.innerHTML = message;

        this.modalContainer.appendChild(this.modal);

        resetButton.focus();


    }

    gotoLevel(level){

        //set level
        this.level = level;

        //update settings

        //reset
    }
    setMode(mode){

        

        // add / remove settings menu

        // reset
    }

}
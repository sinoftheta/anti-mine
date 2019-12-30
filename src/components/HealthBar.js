import {colorMap} from '../functions/ColorMap.js'; //..?
import {hitpointsCalc} from '../functions/HitpointsCalc.js';
/**
 * 
 * SUBSCRIBES TO: damageTaken, gameWon, gameLost, reset
 * 
 * BROADCASTS: tileClick, tilesRendered
 * 
 */

let padding = '8px';

export default class HealthBar extends EventTarget{
    //initiate board elements, handle animations, handle click events
    constructor(container, game_state, settings){
        
        super();
        this.settings = settings;
        this.container = container;
        this.game_state = game_state;
        this.maxHitpoints = hitpointsCalc(this.settings.kernelWeight, this.settings.numMines);
        this.build();
        this.addEventListener('reset', (e) => {
            this.maxHitpoints = hitpointsCalc(this.settings.kernelWeight, this.settings.numMines);
            this.counter_HP.textContent = this.maxHitpoints;
            this.bar.style.height = `calc(100% - ${padding})`;
        }, false);
        this.addEventListener('damageTaken', (e) => this.updateHealth(), false);
        this.addEventListener('gameLost', (e) => {}, false); //maybe use for animation idk
        this.addEventListener('gameWon', (e) => {}, false); //maybe use for animation idk
    }
    updateHealth(){
        //play animation or something
        console.log('ouch!');
        this.counter_HP.textContent = Math.max(0, this.game_state.hitpoints);
        this.bar.style.height = `${Math.max(0, Math.floor(100 * this.game_state.hitpoints / this.maxHitpoints))}%`;
    }
    updateMines(){
        this.counter_mines.textContent = this.game_state.numMines - this.game_state.minesRevealed;
    }
    build(){

        //this.container.style.height = this.settings.rows * this.settings.cellSize;

        this.bar = document.createElement("div");
        this.bar.id = 'health-bar-animate';
        this.bar.style.height = `calc(${Math.floor(100 * this.game_state.hitpoints / this.maxHitpoints)}% - ${padding})`;
        

        this.counter_HP = document.createElement("div");
        this.counter_HP.id = 'health-bar-counter';
        this.counter_HP.textContent = this.maxHitpoints;
        
        this.container.appendChild(this.counter_HP);
        this.container.appendChild(this.bar);
        
    }

}
import {colorMap} from '../functions/ColorMap.js'; //..?
import {hitpointsCalc} from '../functions/HitpointsCalc.js';
/**
 * 
 * SUBSCRIBES TO: damageTaken, gameWon, gameLost, reset
 * 
 * BROADCASTS: tileClick, tilesRendered
 * 
 */
export default class BoardRender extends EventTarget{
    //initiate board elements, handle animations, handle click events
    constructor(parent, game_state, settings, broadcaster){
        
        super();
        this.settings = settings;
        this.broadcaster = broadcaster;
        this.parent = parent;
        this.game_state = game_state;
        this.maxHitpoints = hitpointsCalc(this.settings.kernelWeight, this.settings.mines);
        this.build();
        this.addEventListener('reset', (e) => {
            this.maxHitpoints = hitpointsCalc(this.settings.kernelWeight, this.settings.mines);
            this.counter.textContent = this.maxHitpoints;
            this.bar.style.height = '100%';
        }, false);
        this.addEventListener('damageTaken', (e) => this.updateHealth(), false);
        this.addEventListener('gameLost', (e) => {}, false); //maybe use for animation idk
        this.addEventListener('gameWon', (e) => {}, false); //maybe use for animation idk
        
    }
    updateHealth(){
        //play animation or something
        console.log('ouch!')

        
        this.counter.textContent = Math.max(0, this.game_state.hitpoints);

        this.bar.style.height = `${Math.max(0, Math.floor(100 * this.game_state.hitpoints / this.maxHitpoints))}%`;

        console.log('HP: ' + this.game_state.hitpoints);
    }
    build(){

        this.container = document.createElement("div");
        this.container.id = 'health-bar-container';
        this.container.style.height = this.settings.rows * this.settings.cellSize;

        this.bar = document.createElement("div");
        this.bar.id = 'health-bar-animate';
        this.bar.style.height = `${Math.floor(100 * this.game_state.hitpoints / this.maxHitpoints)}%`;

        this.counter = document.createElement("div");
        this.counter.id = 'health-bar-counter';
        this.counter.textContent = this.maxHitpoints;


        this.container.appendChild(this.counter);
        this.container.appendChild(this.bar);
        this.parent.appendChild(this.container);
        
    }

}
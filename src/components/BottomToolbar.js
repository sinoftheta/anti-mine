import {undo} from '../assets/Svgs.js';
/**
 * 
 * SUBSCRIBES TO: nothing
 * 
 * BROADCASTS: tileStateUpdated
 * 
 */

 export default class BottomToolbar{
    //initiate board elements, handle animations, handle click events
    constructor(container, settings, broadcaster){

        this.broadcaster = broadcaster;
        this.settings = settings;
        this.container = container;

        this.init();

    }

    init(){

        this.container.insertAdjacentHTML('beforeend',`
        <div class="toolbar-item unselectable">
            Cutoff
            <input
                class="toolbar-slider"
                id="cutoff-slider"
                type="range"
                min="0.02"
                max="1"
                step="0.02"
                value="0.7">
            </input>
        </div>
        <div class="toolbar-item unselectable">
            Multiplier
            <input
                class="toolbar-slider"
                id="multiplier-slider"
                type="range"
                min="1"
                max="8"
                step="0.1"
                value="4.5">
            </input>
        </div>
        <div class="toolbar-item unselectable">
            Tile Values
            <input 
                type="checkbox"
                id="show-mines-checkbox"
            >
        </div>
        <div class="toolbar-item unselectable" id="antimine-label">
            AntiMine
        </div>
        `.trim());
        //sync checkbox state with settings
        document.getElementById("show-mines-checkbox").checked = this.settings.displayNums;


        document.getElementById("cutoff-slider").oninput = (e) => {

            this.settings.cutoff = e.target.value;
            this.broadcaster.dispatchEvent(new CustomEvent('tileStateUpdated', {}));
        }

        document.getElementById("multiplier-slider").oninput = (e) => {

            this.settings.multiplier = e.target.value;
            this.broadcaster.dispatchEvent(new CustomEvent('tileStateUpdated', {}));
        }
        
        document.getElementById("show-mines-checkbox").oninput = (e) => {
            this.settings.displayNums = e.target.checked;
            this.broadcaster.dispatchEvent(new CustomEvent('tileStateUpdated', {}));
        }
    }
 }
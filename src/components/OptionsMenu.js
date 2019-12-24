import {deriveSettingsData} from '../functions/DeriveSettingsData.js';
import {gear} from '../assets/Svgs.js';

let kcode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13];
/**
 * 
 * SUBSCRIBES TO: nothing
 * 
 * BROADCASTS: reset
 * 
 */

 export default class OptionsMenu{
    //initiate board elements, handle animations, handle click events
    constructor(container, settings, broadcaster){

        this.broadcaster = broadcaster;
        this.settings = settings;
        this.container = container;
        this.open = false;
        this.konamiInputs = [];
        window.addEventListener('keydown', (e) => {
            if(e.keyCode == 27 && this.open){ //27 is esc key
                this.close();
            } 
        });

        window.addEventListener('keydown', (e) => this.konami(e));

        this.init();

    }
    close(){
        this.open = false;
        this.konamiInputs = [];
        this.menuContainer.classList.remove("menu-open-anim");
        this.container.removeChild(this.backdrop);
    }

    init(){

        //create container
        this.menuContainer = document.createElement("div");
        this.menuContainer.id = "menu-container";
        
        //create button
        this.openCloseButton = document.createElement("div");
        this.openCloseButton.id = "menu-open-close";
        this.openCloseButton.innerHTML = gear;
        
        //TODO: open menu wuth key press, dissable TileSelector
        //this.openCloseButton.tabIndex = 0;
        
        this.openCloseButton.onclick = (e) => {
            this.open = !this.open;

            if(this.open){
                //apply animate-in 
                this.menuContainer.classList.add("menu-open-anim");

                //create backdrop
                this.backdrop = document.createElement("div");
                this.backdrop.id = 'menu-backdrop';
                this.container.appendChild(this.backdrop);
            }else{
                this.close();
            }
        }

        //create panel
        let menuPanel = document.createElement("div");

        menuPanel.id = "menu-panel";


        /************************FIELD SETTINGS***************************************** */
        let fieldGroup = document.createElement("div");
        fieldGroup.classList.add('menu-group');

        this.heightField = document.createElement("INPUT");
        this.heightField.type = "text";
        this.heightField.value = "height";
        this.heightField.onfocus = (e) => {e.target.value === "height"? e.target.value = "" : null;};
        this.heightField.onblur = (e) => {e.target.value === "" || isNaN(e.target.value) ? e.target.value = "height" : null;};


        this.widthField = document.createElement("INPUT");
        this.widthField.type = "text";
        this.widthField.value = "width";
        this.widthField.onfocus = (e) => {e.target.value === "width"? e.target.value = "" : null;};
        this.widthField.onblur = (e) => {e.target.value === "" || isNaN(e.target.value) ? e.target.value = "width" : null;};


        this.minesField = document.createElement("INPUT");
        this.minesField.type = "text";
        this.minesField.value = "mines";
        this.minesField.onfocus = (e) => {e.target.value === "mines"? e.target.value = "" : null;};
        this.minesField.onblur = (e) => {e.target.value === "" || isNaN(e.target.value) ? e.target.value = "mines" : null;};
        this.minesField.oninput = (e) => {
            
            //check that input is number
            if(isNaN(e.target.value)) return;
            
            //get current area from settings or input fields
            let currentArea = ((isNaN(this.widthField.value) ? this.settings.columns : this.widthField.value) * 
                              (isNaN(this.heightField.value) ? this.settings.rows : this.heightField.value));

            //cap mines value to 95% of current area
            if(Number(this.minesField.value) > 0.95 * currentArea) this.minesField.value = Math.floor(0.95 * currentArea);

            //convert mine value to slider value
            this.minesSlider.value = Math.floor(this.minesField.value / (currentArea * 0.95));
        }
        
        this.minesSlider = document.createElement("INPUT");
        this.minesSlider.id = 'mine-slider';
        this.minesSlider.type = "range";
        this.minesSlider.min = "1";
        this.minesSlider.max = "95";
        this.minesSlider.value = "15";
        this.minesSlider.oninput = (e) => {

            //get current area from settings or input fields
            let currentArea = ((isNaN(this.widthField.value) ? this.settings.columns : this.widthField.value) * 
                              (isNaN(this.heightField.value) ? this.settings.rows : this.heightField.value));

            //convert slider value to mines value
            this.minesField.value = Math.floor(currentArea * e.target.value / 100);
        }

                
        menuPanel.appendChild(this.heightField);
        menuPanel.appendChild(this.widthField);
        menuPanel.appendChild(this.minesField);
        menuPanel.appendChild(this.minesSlider);
        
        //SUBMIT BUTTON
        let okButton = document.createElement("button");
        okButton.innerHTML = "apply";
        okButton.onclick = (e) => {
        
            //check mines field
            if(!isNaN(this.minesField.value) && this.minesField.value > 0){
                this.settings.mines = this.minesField.value;
                this.settings.randMines = false;
            }

            //write field values to settings
            if(!isNaN(this.heightField.value) && this.heightField.value > 0) this.settings.rows = this.heightField.value;
            if(!isNaN(this.widthField.value) && this.widthField.value > 0) this.settings.columns = this.widthField.value;


            //write dropdowns to settings
            let kernelDecayDD = document.getElementById("kernel-decay");
            let kernelSizeDD = document.getElementById("kernel-size");
            if(kernelDecayDD.value !== 'default' && kernelSizeDD.value !== 'default'){
                this.settings.kernelSize = kernelSizeDD.value;
                this.settings.kernelDecay = kernelDecayDD.value;
            } 

            deriveSettingsData(this.settings);
            //broadcast reset event
            this.broadcaster.dispatchEvent(new CustomEvent('reset', {detail: {settings: this.settings}}));

            //close menu
            this.close();

        }


        menuPanel.appendChild(fieldGroup);
        
        menuPanel.insertAdjacentHTML('beforeend',`
        <div classname="menu-group">
            <div class="custom-select">
                <select id='kernel-size'>
                    <option value='default'>Kernel Size</option>
                    <option value='_3x3'>3x3</option>
                    <option value='_5x5'>5x5</option>
                    <option value='_7x7'2>7x7</option>
                    <option value='_9x9'>9x9</option>
                    <option value='_15x15'>15x15</option>
                </select>
            </div>
            <div class="custom-select">
                <select id='kernel-decay'>
                    <option value='default'>Kernel Decay</option>
                    <option value='exp2'>Exponential</option>
                    <option value='square'>Square</option>
                    <option value='linear'>Linear</option>
                    <option value='constant'>Constant</option>
                </select>
            </div>
        </div>

        `.trim());
        menuPanel.appendChild(okButton);
        this.menuContainer.appendChild(this.openCloseButton);
        this.menuContainer.appendChild(menuPanel);
        
        this.container.appendChild(this.menuContainer);

        
    }


    konami(e){
        if(!this.open) return;
        
        this.konamiInputs.push(e.keyCode);
        if(this.konamiInputs.length > 11) this.konamiInputs.shift();

        let kCodeInput = kcode.reduce( (acc, cur, i) => { 
            return acc && (cur === this.konamiInputs[i]);
        }, true);

        if(kCodeInput){


            this.settings.kernelSize = 'other';
            this.settings.kernelDecay = 'smile';

            deriveSettingsData(this.settings);
            //broadcast reset event
            this.broadcaster.dispatchEvent(new CustomEvent('reset', {detail: {settings: this.settings}}));
            this.close();
        }
    }
 }
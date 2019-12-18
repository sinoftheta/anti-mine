let svg = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="cog" class="svg-inline--fa fa-cog fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path id="menu-icon" fill="currentColor" d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"></path></svg>'
// lol ^
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
        window.addEventListener('keydown', (e) => {
            if(e.keyCode == 27 && this.open){
                this.close();
            } 
        });

        this.init();

    }
    close(){
        this.open = false;
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
        this.openCloseButton.innerHTML = svg;
        
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
                //apply animate-out
                this.menuContainer.classList.remove("menu-open-anim");
                if(this.backdrop) this.container.removeChild(this.backdrop);
            }
        }

        //create panel
        let menuPanel = document.createElement("div");

        menuPanel.id = "menu-panel";

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

            //broadcast reset event
            this.broadcaster.dispatchEvent(new CustomEvent('reset', {detail: {settings: this.settings}}));

            //close menu
            this.close();


        }
        
        menuPanel.appendChild(this.heightField);
        menuPanel.appendChild(this.widthField);
        menuPanel.appendChild(this.minesField);
        menuPanel.appendChild(this.minesSlider);
        menuPanel.appendChild(okButton);

        this.menuContainer.appendChild(this.openCloseButton);
        this.menuContainer.appendChild(menuPanel);
        
        this.container.appendChild(this.menuContainer);

        
    }


 }
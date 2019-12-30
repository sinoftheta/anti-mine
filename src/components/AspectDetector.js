export default class SizeManager extends EventTarget{

    constructor(settings, broadcaster){
        super();
        this.settings = settings;
        this.broadcaster = broadcaster;

        this.changeAspect();

        //listeners
        window.onresize = () => {
            this.changeAspect();
            //change font sizes here

            this.pixelTinyFontSizeCalc();
        
        };
        window.onmousedown = () => {
            document.documentElement.style.setProperty('--hover-color', '#707070');
        }
        window.onmouseup = () => {
            document.documentElement.style.setProperty('--hover-color', '#8a8a8a');
        }

        this.addEventListener('reset', this.changeAspect(), false); 
    
    }
    detectAspectChange(){
        //for performance, only dispatch when vw and vh change
    }
    changeAspect(){
        console.log('aspect changed...');

        let padding = 8;

        let cellSize = (window.innerWidth / this.settings.columns) < (document.documentElement.clientHeight / this.settings.rows) ? 
            (100 / (this.settings.columns + padding) ) + 'vw'
            :
            (100 / (this.settings.rows + padding) ) + 'vh'
            ;

        document.documentElement.style.setProperty('--cell-size', cellSize);
        //update cells & other elements
        //this.broadcaster.dispatchEvent(new CustomEvent('aspectChange', {}));

        //update game area grid
        document.getElementById('game-area').style.gridTemplateColumns = `${this.settings.cellSize} auto`;
        document.getElementById('game-area').style.gridTemplateRows = `auto ${this.settings.cellSize}`; 
    }
    pixelTinyFontSizeCalc(){
        console.log(document.getElementById("mine-counter-container").clientHeight);

        console.log(document.styleSheets[1]);

    }
}
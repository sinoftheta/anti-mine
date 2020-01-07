export default class StyleManager extends EventTarget{ 

    constructor(settings, broadcaster){
        super();
        this.settings = settings;
        this.broadcaster = broadcaster;

        this.changeAspect();
        this.pixelTinyFontSizeCalc();

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

        this.addEventListener('reset', () => {
            this.changeAspect();
            this.updateCurTile({
                detail:{
                    y: Math.floor(this.settings.columns / 2), //this code is coupled with the reset method in TileSelector, its also swapped
                    x: Math.floor(this.settings.rows / 2),
                }
            });
        }, false); 
        this.addEventListener('updateCurrentTile', (e) => this.updateCurTile(e) ,false);
    
    }
    detectAspectChange(){
        //for performance, only dispatch when vw and vh change

        //only fire changeAspect() when cell size is NEW
    }
    changeAspect(){
        console.log('aspect changed...');

        let padding = 8; //padding is in cells, should be 1 or 2

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
    updateCurTile(e){
        document.documentElement.style.setProperty('--cur-x', Number(e.detail.y));//ugh, x & y swapped
        document.documentElement.style.setProperty('--cur-y', Number(e.detail.x));

    }
    pixelTinyFontSizeCalc(){
        let ht = document.getElementById("mine-counter-container").clientHeight;
        document.documentElement.style.setProperty('--cell-text-size', `${Math.floor(2 * ht)}px`);

        //console.log(document.styleSheets[1]);
    }
}
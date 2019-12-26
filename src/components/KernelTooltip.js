/***
 * 
 * 
 * SUBSCRIBES TO: updateCurrentTile
 * 
 * BROADCASTS: none
 * 
 * 
 */

 let padding = 4;

 export default class KernelTooltip extends EventTarget{

    constructor(boardContainer, settings){
        super();
        this.boardContainer = boardContainer;
        this.settings = settings;
        this.active = false;

        this.addEventListener('reset', () => this.buildKernel()); //why rebuild pn reset?
        this.addEventListener('displayNumsUpdate', (e) => this.updateNums(), false);

        //init position
        this.x = Math.floor(this.settings.columns / 2);
        this.y = Math.floor(this.settings.rows / 2);

        //listen for new current tile
        this.addEventListener('updateCurrentTile', (e) => {
            
            //dont update pos if no current tile (cursor is off board)
            if(e.detail.x == -1 || e.detail.y == -1) return;

            this.x = e.detail.x;
            this.y = e.detail.y;

            this.updateVisualPosition();
        });

        //control key listeners
        window.addEventListener('keydown', (e) => {
            if(e.keyCode == 17){
                this.active = true;
                this.kernelContainer.style.display = '';
                //console.log('showing ktool on ' + this.x + ', ' + this.y);
            }
        });
        window.addEventListener('keyup', (e) => {
            if(e.keyCode == 17){
                this.active = false;
                this.kernelContainer.style.display = 'none';
                //console.log('hiding ktool');
            }
        });

        this.buildKernel();
    }
    buildKernel(){
        
        if(this.kernelContainer && this.kernelContainer.parentElement === this.boardContainer) this.boardContainer.removeChild(this.kernelContainer);

        this.kernelContainer = document.createElement("div");
        this.kernelContainer.id = "kernel-container"
        this.kernelContainer.style.display = 'none';
        this.elements = [];

        let k = this.settings.kernels[this.settings.kernelSize][this.settings.kernelDecay];

        for(let i = 0; i < k.length; ++i){

            this.elements[i] = [];

            let row = this.kernelContainer.appendChild(document.createElement("div"));
            row.className = `kernel-row`;
            
            for(let j = 0; j < k[0].length; ++j){
                this.elements[i][j] = row.appendChild(document.createElement("div"));
                let target = this.elements[i][j];

                if(k[i][j] !== 0 && this.settings.displayNums){
                    target.innerHTML = `<div class="kernel-cell-value">${k[i][j]}</div>`;
                    target.className = 'kernel-cell unselectable';
                }
                else{
                    target.className = 'kernel-cell-empty  unselectable';
                }
                target.style.height = this.settings.cellSize;
                target.style.width = this.settings.cellSize;
                
                //apply animation delay based off of kernel cell value, creates "pulsating" effect
                target.style.animationDelay = `${k[i][j] * 50}ms`;
                target.style.animationName = 'cell-pulse-green'; //todo: get from settings

            }
        }

        this.boardContainer.appendChild(this.kernelContainer);
    }
    updateNums(){
        //update
        for(let i = 0; i < this.elements.length; i++){
            for(let j = 0; j < this.elements[0].length; j++){
                
                if(this.elements[i][j].firstChild){
                    this.elements[i][j].firstChild.style.display = this.settings.displayNums ? '' : 'none';
                }
            }
        }
    }
    updateVisualPosition(){
        let k = this.settings.kernels[this.settings.kernelSize][this.settings.kernelDecay];

        // assumes kernel is square
        let offset = Math.floor(k.length/2);
        
        this.kernelContainer.style.top = (this.x - offset) * (this.settings.cellSize + padding);
        this.kernelContainer.style.left = (this.y - offset) * (this.settings.cellSize + padding);
    }

 }
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

        this.addEventListener('reset', () => this.initKernel()); //why rebuild on reset? because its easy
        this.addEventListener('displayNumsUpdate', (e) => this.updateNums(), false);

        this.buildKernelContainer();
        //control key listeners
        window.addEventListener('keydown', (e) => {
            if(e.keyCode == 17){
                this.active = true;
                this.kernelContainer.style.display = '';
                //console.log('showing ktool');// on ' + this.x + ', ' + this.y);
                //console.log(this.kernelContainer);
            }
        });
        window.addEventListener('keyup', (e) => {
            if(e.keyCode == 17){
                this.active = false;
                this.kernelContainer.style.display = 'none';
                //console.log('hiding ktool');
                //console.log(this.kernelContainer);
            }
        });

        this.initKernel();
    }
    buildKernelContainer(){
        //console.log('wtf if more than once');
        this.kernelContainer = document.createElement("div");
        this.kernelContainer.id = "kernel-container"
        this.kernelContainer.style.display = 'none';
        this.boardContainer.appendChild(this.kernelContainer);
    }
    initKernel(){
        
        while(this.kernelContainer.firstChild){
            this.kernelContainer.firstChild.remove();
        }

        //console.log(this.kernelContainer);

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

                
                //apply animation delay based off of kernel cell value, creates "pulsating" effect
                target.style.animationDelay = `${k[i][j] * 50}ms`;
                target.style.animationName = 'cell-pulse-green'; //todo: get from settings

            }
        }
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
    updateVisualPosition(){ //depreciated, logic should be used as a reference
        let k = this.settings.kernels[this.settings.kernelSize][this.settings.kernelDecay];

        // assumes kernel is square
        let offset = Math.floor(k.length/2);

        let parse = this.settings.cellSize.split('v');
        
        this.kernelContainer.style.top = `calc(${(this.x - offset)} * var(--cell-size) + ${(this.x - offset) * padding}px)`;
        this.kernelContainer.style.left = `calc(${(this.y - offset) * Number(parse[0]) }v${parse[1]} + ${(this.y - offset) * padding}px)`;

        //console.log(`calc(${(this.y - offset) * Number(parse[0]) }v${parse[1]} + ${(this.y - offset) * padding}px)`);
        
    }

 }
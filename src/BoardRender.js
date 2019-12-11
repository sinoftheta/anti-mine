import {gradientPointValueFromChoice} from './ColorMap.js';
/**
 * events:
 * gameWon
 * gameLost
 * tileClicked
 * tileStateUpdated
 * tilesRendered
 * reset
 * 
 */
/**
 * 
 * SUBSCRIBES TO: tileStateUpdated, gameWon, gameLost, reset
 * 
 * BROADCASTS: tileClick, tilesRendered
 * 
 */
export default class BoardRender extends EventTarget{
    //initiate board elements, handle animations, handle click events
    constructor(container, board, settings, broadcaster){
        
        super();
        this.settings = settings;
        this.broadcaster = broadcaster;
        this.container = container;
        this.boardData = board;
        this.elements = [];
        this.generateGradientMap();
        this.build();
        this.addEventListener('reset', (e) => {
            this.generateGradientMap();
            this.destroy();
            this.build();
        }, false);
        this.addEventListener('tileStateUpdated', (e) => this.updateAllAppearance(), false);
        this.addEventListener('gameLost', (e) => this.revealAllExceptMines(), false);
        this.addEventListener('gameWon', (e) => this.revealAllMines(), false);
        
    }

    generateGradientMap(){

        let choice = Math.floor(Math.random() * 4); //4 gradients to choose from, coupled code, TODO: refactor
        console.log("using color gradient: " + (choice + 1));
        

        this.colormap = [];
        for(let i = 0; i < 100; i++){
            this.colormap[i] = gradientPointValueFromChoice(choice, i);
        }
    }
    destroy(){
        while(this.container.firstChild){
            this.container.removeChild(this.container.firstChild); 
        }
    }
    build(){

        //build board
        for(let i = 0; i < this.boardData.rows; i++){

            this.elements[i] = [];

            //should a reference to row be saved?
            let row = this.container.appendChild(document.createElement("div"));
            row.id = `row-${i}`;
            row.className = `game-row`;

            for(let j = 0; j < this.boardData.columns; j++){

                this.elements[i][j] = row.appendChild(document.createElement("div"));
                let targetElement = this.elements[i][j];

                let cellObj = this.boardData.field[i][j];

                //apply tags
                targetElement.id = cellObj.id; //unused... maybe use for animation?
                targetElement.className = 'cell unselectable';
                targetElement.oncontextmenu = () => {return false};
                targetElement.x = i;
                targetElement.y = j;
                targetElement.style.height = this.settings.cellSize;
                targetElement.style.width = this.settings.cellSize;

                //init tile style
                this.coverTile(i,j);
                
            }
        }
    }
    coverTile(x,y){
        let targetData = this.boardData.field[x][y];
        let targetElement = this.elements[x][y];

        targetElement.classList.add('cell-covered');
        //targetElement.classList.remove('cell-revealed'); //not needed unless tiles can be re-covered
        targetElement.onclick = (e) => this.broadcaster.dispatchEvent(new CustomEvent('tileClick', {detail: {x: e.target.x, y: e.target.y }}));
    }

    uncoverTile(x, y){

        let targetData = this.boardData.field[x][y];
        let targetElement = this.elements[x][y];
        
        //console.log(targetData);
        //console.log(targetElement);

        //***render uncovered tile***

        //update classes
        targetElement.classList.remove('cell-covered');
        targetElement.classList.add('cell-revealed');

        

        //update click functionality
        targetElement.onclick = null;

        //append number container if one does not exist
        if(targetElement.childNodes.length == 0 && false){
            let cellChild = targetElement.appendChild(document.createElement("div"));
            cellChild.className = `cell-value`;
            cellChild.innerHTML = targetData.value;
            //apply mine classes to tiles that are mines
            if(targetData.isMine){
                targetElement.classList.add('cell-mine');
                cellChild.classList.add('cell-value-mine');
            }
        }



        //map value => color value
        let kWeight = 2;
        let normVal = Math.round(100* (1 * targetData.value + kWeight/2) / kWeight );
        let cappedVal = Math.min( 99 , Math.max (0 , normVal ));
        targetElement.style.background = this.colormap[cappedVal];
        
        //color mines
        if(targetData.isMine){
            if(targetData.value > 0){
                targetElement.style.background = this.colormap[100];
            }else if(targetData.value < 0){
                targetElement.style.background = this.colormap[0];
            }
            else{
                targetElement.style.background = this.colormap[50]
            }
            
        }


    }
    updateAllAppearance(){ //inefficent, should only update a list of tiles that have actually been updated
        for(let i = 0; i < this.boardData.rows; i++){
            for(let j = 0; j < this.boardData.columns; j++){
                if(this.boardData.field[i][j].revealed) this.uncoverTile(i,j);
            }
        }
    }
    revealAllExceptMines(){ //inefficent, should only update a list of tiles that have actually been updated
        for(let i = 0; i < this.boardData.rows; i++){
            for(let j = 0; j < this.boardData.columns; j++){
                if(!this.boardData.field[i][j].isMine)this.uncoverTile(i,j);
                else this.elements[i][j].onclick = null; //remove onclick from unrevealed mines
            }
        }
    }
    revealAllMines(){ //inefficent, should only update a list of tiles that have actually been updated
        for(let i = 0; i < this.boardData.rows; i++){
            for(let j = 0; j < this.boardData.columns; j++){
                if(this.boardData.field[i][j].isMine)this.uncoverTile(i,j);
            }
        }
    }

    validCoordinate(x,y){
        return this.boardData.field[x] && this.boardData.field[x][y];
    }
    //https://fontawesome.com/icons/atom?style=solid
    //https://fontawesome.com/icons/bomb?style=solid
    //https://fontawesome.com/icons/bullseye?style=solid
    //https://fontawesome.com/icons/carrot?style=solid
    //https://fontawesome.com/icons/centos?style=brands
    //
}
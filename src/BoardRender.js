
let gradient_1 = [
    {weight: 0,
        r: 255, g: 255, b: 255,},
    {weight: 20,
        r: 50, g: 250, b: 150,},
    {weight: 80,
        r: 50, g: 150, b: 250,},
    {weight: 100,
        r: 0, g: 0, b: 0,},
];
let gradient_2 = [
    {weight: 0,
        r: 255, g: 0, b: 40,},
    {weight: 50,
        r: 255, g: 255, b: 255,},
    {weight: 100,
        r: 0, g: 40, b: 255,},
];
let gradient_3 = [
    {weight: 0,
        r: 255, g: 255, b: 200,},
    {weight: 50,
        r: 100, g: 250, b: 150,},
    {weight: 100,
        r: 50, g: 50, b: 0,},
];
let gradient_4 = [
    {weight: 0,
        r: 255, g: 240, b: 250,},
    {weight: 25,
        r: 50, g: 255, b: 40,},
    {weight: 50,
        r: 120, g: 125, b: 135,},
    {weight: 75,
        r: 20, g: 20, b: 200,},
    {weight: 100,
        r: 0, g: 0, b: 0,},
];

//note: add values to lookup table so they dont need to be recalculated
let gradientPointValue = (gradient, weight) => {
    let i;
    //find colors surounding weight
    for(i = 0; i < gradient.length; i++){
        if(gradient[i].weight > weight) break;
    }
    let c1 = gradient[i];
    let c0 = gradient[i - 1];
    //console.log(c1);
    //console.log(c0);

    let npw = weight - c0.weight; // normalize point weight
    let ncw = c1.weight - c0.weight // normalize color weight

    // normalize weight, multiply by slope, add to first color
    let r = Math.round(c0.r + npw * (c1.r - c0.r) / ncw); 
    let g = Math.round(c0.g + npw * (c1.g - c0.g) / ncw); 
    let b = Math.round(c0.b + npw * (c1.b - c0.b) / ncw); 

    return `rgb(${r}, ${g}, ${b})`;
}

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
    constructor(container, board, broadcaster){
        
        super();
        this.broadcaster = broadcaster;
        this.container = container;
        this.reset(board);
        this.build();
        this.addEventListener('reset', (e) => this.setup(e.detail.settings), false);
        this.addEventListener('tileStateUpdated', (e) => this.updateAllAppearance(), false);
        
    }

    generateGradientMap(){

        let set = [gradient_1, gradient_2, gradient_3, gradient_4];
        let gradient = set[3];//set[Math.floor(Math.random() * set.length)];

        this.colormap = [];
        for(let i = 0; i < 100; i++){
            this.colormap[i] = gradientPointValue(gradient, i);
        }
    }
    reset(board){
        this.boardData = board;
        this.elements = [];
        this.generateGradientMap();
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
        let normVal = Math.round(100* (-1 * targetData.value + kWeight/2) / kWeight );
        let cappedVal = Math.min( 99 , Math.max (0 , normVal ));
        targetElement.style.background = this.colormap[cappedVal];
        
        /*
        //assumes .value is in the range [-1,1]
        //colorval mapping is slapdashed as fuck but need MVP
        let normalize_midpoint = 0.6;
        let normalize_weight = 1.3;

        //manually cap color val at 0 and 255
        let colorVal =  Math.max(0, Math.min((targetData.value/normalize_weight + normalize_midpoint) * 255, 255));

        
        switch(this.color){
            case 0:
                targetElement.style.background = `rgb(${Math.floor(colorVal / 1)},${Math.floor(colorVal / 2)},${Math.floor(colorVal / 1.2)})`;
                //targetElement.style.background = gradientPointValue(gradient_1, cappedVal);
                break;
            case 1:
                targetElement.style.background = `rgb(${Math.floor(colorVal / 1.2)},${Math.floor(colorVal / 1)},${Math.floor(colorVal / 2)})`;
                //targetElement.style.background = gradientPointValue(gradient_2, cappedVal);
                break;
            default:
                targetElement.style.background = `rgb(${Math.floor(colorVal / 2)},${Math.floor(colorVal / 1.2)},${Math.floor(colorVal / 1)})`;
                //targetElement.style.background = gradientPointValue(gradient_3, cappedVal);
        }
        */
        

        //color mines
        if(targetData.isMine){
            if(targetData.value >= 0){
                targetElement.style.background = this.colormap[0];
            }else{
                targetElement.style.background = this.colormap[100];
            }
            
        }


    }
    updateAllAppearance(){ //inefficent, should only update a list of tiles that have actually been updated
        for(let i = 0; i < this.boardData.rows; i++){
            for(let j = 0; j < this.boardData.columns; j++){
                if(this.boardData.field[i][j].revealed) this.uncoverTile(i,j);
                //let targetElement = this.elements[i][j];
                
                //console.log(targetData);
                //console.log(targetElement);

                
                
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
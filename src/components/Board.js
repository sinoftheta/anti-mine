import Cell from './Cell.js';
import seedrandom from 'seedrandom';
/**
 * 
 * SUBSCRIBES TO: tileClick, reset
 * 
 * BROADCASTS: tileStateUpdated, gameWon, gameLost
 * 
 */
export default class Board extends EventTarget{
    //contains all game logic
    constructor(settings, broadcaster){
        
        super();
        this.settings = settings;
        this.broadcaster = broadcaster;
        //console.log(this.broadcaster);
        this.setup();
        this.addEventListener('reset', (e) => this.setup(), false);
        this.addEventListener('tileClick', (e) => this.handleClick(e) , false);

    }
    handleClick(e){
        if(this.gameLost || this.gameWon) return;
        this.uncoverTile(e.detail.x, e.detail.y); 
        
        this.resetCheckStatus();

        //check for solved mines

        console.log('=-=-=-=-=-=-=-mine list=-=-=-=-=-=-=-=')
        console.log(this.mineRevealList);

        this.mineRevealList.forEach((e) => {
            this.autoRevealMine(e);
        });
        
        //use these and/or perhapse a tilesUpdated list for animations
        this.resetCheckStatus();
        this.mineRevealList = []; 


        this.broadcaster.dispatchEvent(new CustomEvent('tileStateUpdated', {}));


        //check for loss
        if(this.gameLost) this.broadcaster.dispatchEvent(new CustomEvent('gameLost', {}));

        //check win condition
        this.gameWon = (this.area - this.revealedTiles === this.numMines);
        if(this.gameWon) this.broadcaster.dispatchEvent(new CustomEvent('gameWon', {}));

    }
    autoRevealMine(target){ 
        //each mine will be in one of 4 cases
            
            //case 1: all revealed + safe neighbors -> reveal

            //case 2: mine has a safe + unrevealed neighbor -> dont reveal

            //case 3: part of a mine island with revealed + safe neighbors -> reveal all mines in island

            //case 4: part of a mine island with a safe + unrevealed neighbor -> dont reveal any mines in island


            //case 1 & 2 are instances of 3 & 4, respectively 
            //mines are guarenteed to be unrevealed
            //all tiles are "unchecked" to start


            //THEREFORE

            //1: determine mine island
            let island = [];
            this.mineIslandFinder(target.x, target.y ,island);
            console.log('-=-=-=island=-=-=-')
            console.log(island);


            
            //2: determine if perimeter of island is revealed
            let field = this.field;
            let islandRevealed = island.reduce((acc, mine) => {
                let x = mine.x, y = mine.y;
                    /*console.log(field[x][y+1] ? (field[x][y+1].revealed || field[x][y+1].isMine) : true)
                    console.log(field[x][y-1] ? (field[x][y-1].revealed || field[x][y-1].isMine) : true)
                    console.log(field[x+1] ? (field[x+1][y].revealed || field[x+1][y].isMine) : true)
                    console.log(field[x-1] ? (field[x-1][y].revealed || field[x-1][y].isMine) : true)
                    console.log((field[x+1] && field[x+1][y+1]) ? (field[x+1][y+1].revealed || field[x+1][y+1].isMine) : true)
                    console.log((field[x-1] && field[x-1][y+1]) ? (field[x-1][y+1].revealed || field[x-1][y+1].isMine) : true)
                    console.log((field[x+1] && field[x+1][y-1]) ? (field[x+1][y-1].revealed || field[x+1][y-1].isMine) : true)
                    console.log((field[x-1] && field[x-1][y-1]) ? (field[x-1][y-1].revealed || field[x-1][y-1].isMine) : true) */

                //very sloppy, a fuck ton of redundant checks, should use recursion to check perimeter...?
                return (
                    acc &&
                    (field[x][y+1] ? (field[x][y+1].revealed || field[x][y+1].isMine) : true) &&//if neighbor exists, check if neighbor is revealed OR is mine
                    (field[x][y-1] ? (field[x][y-1].revealed || field[x][y-1].isMine) : true) &&
                    (field[x+1] ? (field[x+1][y].revealed || field[x+1][y].isMine) : true) &&
                    (field[x-1] ? (field[x-1][y].revealed || field[x-1][y].isMine) : true) &&
                    ((field[x+1] && field[x+1][y+1]) ? (field[x+1][y+1].revealed || field[x+1][y+1].isMine) : true) &&
                    ((field[x-1] && field[x-1][y+1]) ? (field[x-1][y+1].revealed || field[x-1][y+1].isMine) : true) &&
                    ((field[x+1] && field[x+1][y-1]) ? (field[x+1][y-1].revealed || field[x+1][y-1].isMine) : true) &&
                    ((field[x-1] && field[x-1][y-1]) ? (field[x-1][y-1].revealed || field[x-1][y-1].isMine) : true)
                );
            }, true);

            if(islandRevealed){
                console.log('revealing island');
                island.forEach(member => member.revealed = true);
            }
    }
    mineIslandFinder(x, y, island){//finding too many islands
        let field = this.field;
        if(!(field[x] && field[x][y])) return;

        let target = field[x][y];
        if(target.checked) return;
        target.checked = true;


        if(target.isMine){ //only add to an island if its not part of an existing island... need island IDs... or more elegant code...
            island.push(target);
        }else{
            return;
        }

        //east
        this.mineIslandFinder(x + 1, y, island);

        //north
        this.mineIslandFinder(x, y + 1, island);

        //west
        this.mineIslandFinder(x - 1, y, island);

        //south
        this.mineIslandFinder(x, y - 1, island);

        //northeast
        this.mineIslandFinder(x + 1, y + 1, island);

        //northwest
        this.mineIslandFinder(x - 1, y + 1, island);

        //southwest
        this.mineIslandFinder(x - 1, y - 1, island);

        //southeast
        this.mineIslandFinder(x + 1, y - 1, island);
    
    }

    setup(){ //may change to num mines + num anti mines, maybe a mine will just have random value 

        this.numMines = this.settings.mines;
        this.rows = this.settings.rows;
        this.columns = this.settings.columns;
        this.area = this.rows * this.columns;
        this.kernelWeight = 0;
    
        this.revealedTiles = 0;
        this.gameLost = false;
        this.gameWon = false;
        this.mineRevealList = [];

        //instantiate field of cells
        this.field = [];
        for(let i = 0; i < this.rows; i++){ 
            this.field[i] = [];
            for(let j = 0; j < this.columns; j++){
                this.field[i][j] = new Cell(i,j);
            }
        }

        if(this.settings.presetBoard) this.placeMinesPreset();
        else this.placeMinesRandom();
        
        this.placeNumbersKernel();

    }
    
    placeMinesRandom(){ 

        if(this.numMines >= this.area){
            console.log('Error: too many mines for this board size');
            return;
        }
        let n = this.numMines, x, y, target,
        rng = seedrandom('' + this.settings.seed + this.rows + this.columns);

        while(n > 0){
            x = Math.floor(rng() * this.rows );
            y = Math.floor(rng() * this.columns );
            target = this.field[x][y];

            //if no mine already at x,y
            if(!target.isMine){
                target.value = rng() > .5 ? 1 : -1 ;
                target.isMine = true;
                --n;
            }
        }
    }
    placeMinesPreset(){
        this.numMines = 0;
        for(let i = 0; i < this.rows; i++){ 
            for(let j = 0; j < this.columns; j++){
                if(this.settings.presetBoard[i][j] !== 0){
                    this.field[i][j].isMine = true;
                    this.numMines++;
                }
                this.field[i][j].value = this.settings.presetBoard[i][j];
            }
        }
    }
    
    placeNumbersKernel(){
        let k = this.settings.kernel;
        let field = this.field;
        let tempField = [];
        
        //instantiate temp field within first iteration

        //iterate through board
        for(let i = 0; i < this.rows; i++){ 
            tempField[i] = [];
            for(let j = 0; j < this.columns; j++){
                
                tempField[i][j] = 0;

                //iterate through kernel
                for(let m = 0; m < k.length; m++){

                    let offset_i = m - Math.floor(k.length/2);

                    for(let n = 0; n < k[0].length; n++ ){

                        let offset_j = n - Math.floor(k[0].length/2);
                    
                        //check if kernel is out of bounds
                        if(field[i + offset_i] && field[i + offset_i][j + offset_j]){

                            //compute new val
                            tempField[i][j] += field[i + offset_i][j + offset_j].value * k[m][n]; 
                        }
                    }
                }
            }
        }

        //put temp values in field
        for(let i = 0; i < this.rows; i++){ //vertical
            for(let j = 0; j < this.columns; j++){ //horizontal
                this.field[i][j].value = tempField[i][j];
            }
        }

    }
    uncoverTile(x,y, originValue){
        let field = this.field;

        //check if target exists
        if(!(field[x] && field[x][y])) return;

        let target = field[x][y];

        //check if mine is revealed or has been checked
        if(target.checked || target.revealed) return;
        target.checked = true;

        if(typeof originValue === 'number'){
            //not original click, auto reveal behavor

            //dont auto reveal mines
            if(target.isMine){
                this.mineRevealList.push(target);
                return;
            } 

            //stop at 0 or sign change boundary
            if(target.value !== 0 && originValue === 0)return;

            if(target.value > 0 && originValue < 0)return;//{ console.log('=-=-=- not revealed 4 =-=-=-=-='); return;}
            if(target.value < 0 && originValue > 0)return;//{ console.log('=-=-=- not revealed 5 =-=-=-=-='); return;}
            if(originValue > 0 && target.value > originValue)return;//{ console.log('=-=-=- not revealed 1 =-=-=-=-='); return;} //only uncover "down hill" if positive
            if(originValue < 0 && target.value < originValue)return;//{ console.log('=-=-=- not revealed 2 =-=-=-=-='); return;} //only uncover "up hill" if negative

        }
        else{
            originValue = target.value;
        }



        //check lose condition (win cond is checked after recursion)
        if(target.isMine) this.gameLost = true;

        //reveal tile
        target.revealed = true;
        this.revealedTiles++;
        
        //recurse over all neighbors, example of a DFS

        //east
        this.uncoverTile(x + 1, y, originValue);

        //north
        this.uncoverTile(x, y + 1, originValue);

        //west
        this.uncoverTile(x - 1, y, originValue);

        //south
        this.uncoverTile(x, y - 1, originValue);

        //dont recurse over diagonals
        //return;

        //northeast
        this.uncoverTile(x + 1, y + 1, originValue);

        //northwest
        this.uncoverTile(x - 1, y + 1, originValue);

        //southwest
        this.uncoverTile(x - 1, y - 1, originValue);

        //southeast
        this.uncoverTile(x + 1, y - 1, originValue);


    }
    resetCheckStatus(){
        for(let i = 0; i < this.rows; i++){ //vertical
            for(let j = 0; j < this.columns; j++){ //horizontal
                this.field[i][j].checked = false;
            }
        }
    }


/*
    placeNumbersConvolute(k0, normalize, k_option){ //REWRITE IN C WITH WEBASSEMBLY...?
        //https://www.youtube.com/watch?v=SiJpkucGa1o
        //https://www.youtube.com/watch?v=C_zFhWdM4ic
        //https://en.wikipedia.org/wiki/Multidimensional_discrete_convolution
        //https://en.wikipedia.org/wiki/Kernel_(image_processing)


        //error checking to see if second arg exists/is valid
        let k1 = k0;
        if(typeof k_option === "array"){
            k1 = k_option;
        }


        let field = this.field;

        let tempField = [];
        
        
        //instantiate temp field within first iteration

        //CONVOLVE FROM ORIG INTO TEMP ARRAY
        for(let i = 0; i < this.columns; i++){ //vertical
            
            tempField[i] = [];

            for(let j = 0; j < this.rows; j++){ //horizontal

                let terms = 0;

                tempField[i][j] = 0;

                for(let m = 0; m < k0.length; m++){

                    let offset = m - Math.floor(k0.length/2);

                    //check if kernel is out of bounds
                    if(field[i + offset] && field[i + offset][j]){

                        //convolve on (i,j)
                        tempField[i][j] += field[i + offset][j].value * k0[m]; 
                        ++terms;
                    }
                }
            }
        }

        //CONVOLVE FROM TEMP INTO/OVERWRITITNG ORIG ARRAY
        for(let i = 0; i < this.columns; i++){ //vertical
            for(let j = 0; j < this.rows; j++){ //horizontal

                let terms = 0, csum = 0;
                field[i][j].value = 0;

                for(let m = 0; m < k1.length; m++){

                    let offset = m - Math.floor(k1.length/2);

                    //check if kernel is out of bounds
                    if(field[i] && field[i][j + offset]){

                        //convolve on (i,j)
                        field[i][j].value += tempField[i][j + offset] * k1[m] / normalize; 
                        ++terms;
                    }   
                }
            }
        }
    }
    */

}
import Cell from './Cell.js';
import {hitpointsCalc} from '../functions/HitpointsCalc.js';
import seedrandom from 'seedrandom';
/**
 * 
 * SUBSCRIBES TO: tileReveal, reset
 * 
 * BROADCASTS: tileStateUpdated, gameWon, gameLost
 * 
 */
export default class GameLogic extends EventTarget{
    //contains all game logic
    constructor(settings, broadcaster){
        
        super();
        this.settings = settings;
        this.broadcaster = broadcaster;
        //console.log(this.broadcaster);
        this.setup();
        this.addEventListener('reset', (e) => this.setup(), false);
        this.addEventListener('tileReveal', (e) => this.handleReveal(e) , false);
        //this.addEventListener('tileFlag', (e) => this.handleFlag(e) , false);

    }
    setup(){ //may change to num mines + num anti mines, maybe a mine will just have random value 

        this.numMines = this.settings.mines;
        this.rows = this.settings.rows;
        this.columns = this.settings.columns;
        this.area = this.rows * this.columns;
    
        
        this.gameLost = false;
        this.gameWon = false;
        this.mineRevealList = [];
        this.minesRevealed = 0;
        this.safeTilesRevealed = 0;

        this.hitpoints = hitpointsCalc(this.settings.kernelWeight, this.numMines);
        //console.log("HP: " + this.hitpoints)

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
    /*handleFlag(e){
        let target = this.field[e.detail.x][e.detail.y];

        //cycle flag value
        target.flagState = (target.flagState + 1) % 3;
        console.log(target.flagState);

    }*/
    handleReveal(e){
        if(this.gameLost || this.gameWon) return;
        let x = e.detail.x, y = e.detail.y;

        let target = this.field[x][y];

        if(target.isMine){
            this.mineHit(target.value);

            if(!target.revealed){
                target.revealed = true;
                this.minesRevealed++;
            }

        }else{
            this.autoRevealTile(x, y); 
        }
        
        

        //check for solved mines
        this.resetCheckStatus();

        //console.log('=-=-=-=-=-=-=-mine list=-=-=-=-=-=-=-=')
        //console.log(this.mineRevealList);

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
        //this.gameWon = (this.area - this.revealedTiles === this.numMines);
        this.gameWon = this.minesRevealed === this.numMines || (this.minesRevealed + this.safeTilesRevealed === this.area) || this.numMines + this.safeTilesRevealed === this.area;
        if(this.gameWon && !this.gameLost) this.broadcaster.dispatchEvent(new CustomEvent('gameWon', {}));

        console.log('mines revealed: ' + this.minesRevealed + ' totalMines: ' + this.numMines);
        console.log('safe tiles revealed: ' + this.safeTilesRevealed + ' area: ' + this.area);

    }
    mineHit(value){

        let c = 5; //constant ensures that hitting a null mine results in losing health

        let damage = Math.abs(value + 5); 
        //console.log('you lost ' + damage + ' health');
        this.hitpoints -= damage;

        //console.log('HP: ' + this.hitpoints);
        this.broadcaster.dispatchEvent(new CustomEvent('damageTaken', {}));

        //check for loss
        if(this.hitpoints <= 0) this.gameLost = true;
    }
    autoRevealMine(target){//TODO: NEED TO RECHECK WIN CONDITION
        
            /*
            each mine will be in one of 4 cases
            
            case 1: all revealed + safe neighbors -> reveal

            case 2: mine has a safe + unrevealed neighbor -> dont reveal

            case 3: part of a mine island with revealed + safe neighbors -> reveal all mines in island

            case 4: part of a mine island with a safe + unrevealed neighbor -> dont reveal any mines in island


            case 1 & 2 are instances of 3 & 4, respectively
            mines are guarenteed to be unrevealed
            all tiles are "unchecked" to start


            //THEREFORE
            */

            //1: determine mine island
            let island = [];
            this.mineIslandFinder(target.x, target.y ,island);
            //console.log('-=-=-=island=-=-=-')
            //console.log(island);


            
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
                //console.log('revealing island');
                island.forEach(member => {
                    if(!member.revealed){
                        member.revealed = true;
                        this.minesRevealed++;
                    }
                });
            }
    }
    mineIslandFinder(x, y, island){
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
    autoRevealTile(x,y, originValue){
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

        //reveal tile

        if(!target.revealed){
                target.revealed = true;
                this.safeTilesRevealed++; 
        }

        
        //recurse over all neighbors, example of a DFS

        //east
        this.autoRevealTile(x + 1, y, originValue);

        //north
        this.autoRevealTile(x, y + 1, originValue);

        //west
        this.autoRevealTile(x - 1, y, originValue);

        //south
        this.autoRevealTile(x, y - 1, originValue);

        //dont recurse over diagonals
        //return;

        //northeast
        this.autoRevealTile(x + 1, y + 1, originValue);

        //northwest
        this.autoRevealTile(x - 1, y + 1, originValue);

        //southwest
        this.autoRevealTile(x - 1, y - 1, originValue);

        //southeast
        this.autoRevealTile(x + 1, y - 1, originValue);
    }
    resetCheckStatus(){
        for(let i = 0; i < this.rows; i++){ //vertical
            for(let j = 0; j < this.columns; j++){ //horizontal
                this.field[i][j].checked = false;
            }
        }
    }
    applyFuncNeighbors(x, y, f, arg){ //doesnt work...?
        
        if(this.field[x][y+1]) f(x,y+1, arg);
        if(this.field[x][y-1]) f(x,y-1, arg);
        if(this.field[x+1] && this.field[x+1][y]) f(x+1,y, arg);
        if(this.field[x-1] && this.field[x-1][y]) f(x-1,y, arg);
        if(this.field[x+1] && this.field[x+1][y+1]) f(x+1,y+1, arg);
        if(this.field[x-1] && this.field[x-1][y-1]) f(x-1,y-1, arg);
        if(this.field[x+1] && this.field[x+1][y-1]) f(x+1,y-1, arg);
        if(this.field[x-1] && this.field[x-1][y+1]) f(x-1,y+1, arg);
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
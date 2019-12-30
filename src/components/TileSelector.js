/***
 * 
 * 
 * SUBSCRIBES TO: reset, gameWon, gameLost
 * 
 * BROADCASTS: tileClick, updateCurrentTile
 * 
 * 
 */

const padding = 4; //TODO: make this dynamic
 export default class TileSelecor extends EventTarget{

    constructor(boardContainer, settings, broadcaster){
        super();
        this.boardContainer = boardContainer;
        this.settings = settings;
        this.broadcaster = broadcaster;
        this.active = false; //temp
        this.standby = false;

        //init position
        this.x = Math.floor(this.settings.columns / 2);
        this.y = Math.floor(this.settings.rows / 2);

        //listen for game win/lose
        this.addEventListener('gameWon', () => this.standby = true);
        this.addEventListener('gameLost', () => this.standby = true);

        //escape key listener
        window.addEventListener('keydown', (e) => {
            if(e.keyCode == 27 && this.active){
                this.active = false;
                this.boardContainer.removeChild(this.cursor);
            }
        });

        //space + enter listener
        window.addEventListener('keydown', (e) => {
            if((e.keyCode == 32 || e.keyCode == 13) && this.active && !this.standby){
                //uncover tile
                this.broadcaster.dispatchEvent(new CustomEvent('tileReveal', {detail: {x: this.y, y: this.x}}));
            }
            else if((e.keyCode == 32 || e.keyCode == 13) && !this.active){
                this.active = true;
                this.broadcaster.dispatchEvent(new CustomEvent('updateCurrentTile', {detail: {x: this.y, y: this.x}}));
                this.initCursor();
            }
        });

        //arrow key listener
        window.addEventListener('keydown', (e) => {

            if(!this.active) return;

            //down
            if(e.keyCode == 40)this.y = Math.min(this.y + 1, this.settings.rows - 1);
            //up
            else if(e.keyCode == 38)this.y = Math.max(this.y - 1, 0);
            //right
            else if(e.keyCode == 39)this.x = Math.min(this.x + 1, this.settings.columns - 1);
            //left
            else if(e.keyCode == 37)this.x = Math.max(this.x - 1, 0);

            if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40){
                this.updateVisualPosition();
                this.broadcaster.dispatchEvent(new CustomEvent('updateCurrentTile', {detail: {x: this.y, y: this.x}}));
                //console.log('cur tile: ' + this.x + ', ' + this.y);
            }

        });




        this.addEventListener('reset', (e) => {
            //reset cursor position upon game reset

            // clip coordinates on reset
            //this.x = Math.min(this.x, this.settings.rows - 1);
            //this.y = Math.min(this.y, this.settings.columns - 1);

            //reset to mid point
            this.x = Math.floor(this.settings.columns / 2);
            this.y = Math.floor(this.settings.rows / 2);

            this.standby = false;
            if(this.active){
                this.initCursor();
            }
        }, false);

        //event listeners for directions


        this.active ? this.initCursor() : null;
    }
    initCursor(){
        this.cursor = document.createElement('div');
        this.cursor.style.height = this.settings.cellSize;
        this.cursor.style.width = this.settings.cellSize;
        this.cursor.id = 'tile-cursor';

        this.boardContainer.appendChild(this.cursor);

        this.updateVisualPosition();

    }
    updateVisualPosition(){
        
        //this.cursor.style.top = this.y * (this.settings.cellSize + padding) + (padding / 2);
        //this.cursor.style.left = this.x * (this.settings.cellSize + padding) + (padding / 2);

        let parse = this.settings.cellSize.split('v');
        
        this.cursor.style.left = `calc(${(this.x) * Number(parse[0]) }v${parse[1]} + ${(this.x) * padding}px)`;
        this.cursor.style.top = `calc(${(this.y) * Number(parse[0]) }v${parse[1]} + ${(this.y) * padding}px)`;
    }

 }
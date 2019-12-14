/***
 * 
 * 
 * SUBSCRIBES TO: reset, gameWon, gameLost
 * 
 * BROADCASTS: tileClick
 * 
 * 
 */

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
                this.broadcaster.dispatchEvent(new CustomEvent('tileClick', {detail: {x: this.y, y: this.x}}));
            }
            else if((e.keyCode == 32 || e.keyCode == 13) && !this.active){
                this.active = true;
                this.initCursor();
            }
        });
        

        //arrow key listener
        window.addEventListener('keydown', (e) => {

            if(!this.active) return;

            if(e.keyCode == 40){ //down
                this.y = Math.min(this.y + 1, this.settings.rows - 1);
                this.updateVisualPosition();
            }
            else if(e.keyCode == 38){ //up
                this.y = Math.max(this.y - 1, 0);
                this.updateVisualPosition();
            }
            else if(e.keyCode == 39){ //right
                this.x = Math.min(this.x + 1, this.settings.columns - 1);
                this.updateVisualPosition();
            }
            else if(e.keyCode == 37){ //left
                this.x = Math.max(this.x - 1, 0);
                this.updateVisualPosition();
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

            this.initCursor();
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
        this.cursor.style.top = this.y * this.settings.cellSize;
        this.cursor.style.left = this.x * this.settings.cellSize;
    }

 }
/**
 * 
 * SUBSCRIBES TO: damageTaken, gameWon, gameLost, reset
 * 
 * BROADCASTS: tileClick, tilesRendered
 * 
 */
export default class MinesCounter extends EventTarget{
    //initiate board elements, handle animations, handle click events
    constructor(container, game_state, settings){
        
        super();
        this.settings = settings;
        this.container = container;
        this.game_state = game_state;
        this.build();
        this.updateMines();
        this.addEventListener('reset', (e) => this.updateMines(), false);
        this.addEventListener('tileStateUpdated', (e) => this.updateMines(), false);
        
    }
    updateMines(){
        this.counter_mines.textContent = this.game_state.numMines - this.game_state.minesRevealed;
    }
    build(){

        this.counter_mines = document.createElement("div");
        this.counter_mines.classList.add("cell-value");
        this.counter_mines.textContent = this.game_state.numMines - this.game_state.minesRevealed;

        this.container.appendChild(this.counter_mines);
        
    }

}


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
 * SUBSCRIBES TO: gameWon, gameLost
 * 
 * BROADCASTS: reset
 * 
 */

 /**
  * Determines game settings based off of level/world object
  * 
  * 
  */
export default class GameManager extends EventTarget{

    constructor(messageContainer, settings, broadcaster){
        super();
        this.messageContainer = messageContainer;
        this.broadcaster = broadcaster;
        this.settings = settings;
        this.gameState = 'pregame';
        //this.addEventListener('tileClick', (e) => console.log(e.detail), false);
        this.addEventListener('gameWon', (e) => {

        }, false);
        this.addEventListener('gameLost', (e) => console.log(e.detail), false);

    }
    resetGame(settings){

    }
    showWin(){
        let winMessage = document.createElement("div");
    }

}
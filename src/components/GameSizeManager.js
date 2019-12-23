export default class GameSizeManager extends EventTarget{

    constructor(modalContainer, settings, broadcaster){
        super();
        this.settings = settings;
        this.modalContainer = modalContainer;
        this.broadcaster = broadcaster;
        //this.addEventListener('tileClick', (e) => console.log(e.detail), false);
        this.addEventListener('gameWon', (e) => this.playAgainPopup("Congrats, you located all the mines!"), false);
        this.addEventListener('gameLost', (e) => this.playAgainPopup("Oh no, you were annihilated!"), false);

        this.addEventListener('reset', (e) => {
            console.log('game mang resetting')
            this.modal && this.modal.parentNode === this.modalContainer ? this.modalContainer.removeChild(this.modal) : null;
        }, false);
    }
}
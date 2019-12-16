export default class Cell{
    //if a cell is a mine, then its value will be 1, -1, or possibly in the range [-1,1]
    //if a cell is not a mine, then its value will be based off the local/surounding mine values
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.isMine = false;
        this.revealed = false; 
        this.value = (Math.random() - 0.5) * 0.05;
        this.checked = false;

        //TODO: add flags
    }
    get id(){
        return `cell-${this.x}-${this.y}`;
    }
}
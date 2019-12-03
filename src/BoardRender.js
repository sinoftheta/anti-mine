export default class BoardRender{
    //initiate board elements, handle animations, handle click events
    constructor(container, board){
        this.container = container;
        this.board = board;

        for(let i = 0; i < this.board.columns; i++){

            let row = container.appendChild(document.createElement("div"));
            row.id = `row-${i}`;
            row.className = `game-row`;

            for(let j = 0; j < this.board.rows; j++){

                let cellDiv = row.appendChild(document.createElement("div"));
                let cellObj = this.board.field[i][j];

                //apply tags
                cellDiv.id = cellObj.id; //unused... maybe use for animation?
                cellDiv.className = `cell`;
                cellDiv.x = j;
                cellDiv.y = i;
                cellDiv.onclick = (e) => {
                    console.log('' + e.target.x + ', ' + e.target.y);
                };
                //apply style and class based on a cells attributes
                let cellChild = cellDiv.appendChild(document.createElement("div"));
                cellChild.innerHTML = cellObj.value;
                cellChild.className = `cell-value`
                if(cellObj.isMine){
                    cellDiv.className += ' cell-mine';
                }
            }
        }
    }
    //https://fontawesome.com/icons/atom?style=solid
    //https://fontawesome.com/icons/bomb?style=solid
    //https://fontawesome.com/icons/bullseye?style=solid
    //https://fontawesome.com/icons/carrot?style=solid
    //https://fontawesome.com/icons/centos?style=brands
    //
}
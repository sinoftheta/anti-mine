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
                cellChild.className = `cell-value`;

                //comment this out to turn off numbers LOL
                cellChild.innerHTML = cellObj.value;


                //determine cell color based off value
                //assumes .value is in the range [-1,1]
                //colorval is slapdashed as fuck but need MVP
                let normalize_midpoint = 0.6;
                let normalize_weight = 1.3;

                //manually cap color val at 0 and 255
                let colorVal =  Math.max(0, Math.min((cellObj.value/normalize_weight + normalize_midpoint) * 255, 255));
                cellDiv.style.background = `rgb(${colorVal},${colorVal},${colorVal})`;

                //apply mine classes to tiles that are mines
                if(cellObj.isMine){
                    cellDiv.className += ' cell-mine';
                    cellChild.className += ' cell-value-mine';
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
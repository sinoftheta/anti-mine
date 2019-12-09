import css from './style.css';
import Board from './Board.js';
import BoardRender from './BoardRender.js';
//import fontawesome from 'fontawesome';

//http://antimi.ne/ want but its like $420 a year lmao
//https://www.youtube.com/watch?v=SiJpkucGa1o
//https://www.youtube.com/watch?v=C_zFhWdM4ic
//https://en.wikipedia.org/wiki/Multidimensional_discrete_convolution
//https://en.wikipedia.org/wiki/Kernel_(image_processing)

// note: "gravity strength" roughly relates to the radius/size of the kernel
let kernel_vanillaMS = [[1, 1, 1],
                        [1, 1, 1],
                        [1, 1, 1]];

let kernel_gauss =   [[1, 2, 1],
                      [2, 4, 2],
                      [1, 2, 1]];

let my_kernel_1 =       [[0.5,0.75,0.5],
                        [0.75,1,0.75],
                        [0.5,0.75,0.5]];

let kernel_gauss_comp = [1,2,1];

let my_kernel_2 =         [[0, 0.25, 0.25, 0.25, 0],
                        [0.25, 0.5, 0.5, 0.5, 0.25],
                        [0.25, 0.5, 1, 0.5, 0.25],
                        [0.25, 0.5, 0.5, 0.5, 0.25],
                        [0, 0.25, 0.25, 0.25, 0]];

let my_kernel_3 =  [[0,     0,      0.125,  0.25,   0.125,  0,      0   ],
                    [0,     0.125,  0.25,   0.5,    0.25,   0.125,  0   ],
                    [0.125, 0.25,   0.5,    0.5,    0.5,    0.25,   .125],
                    [0.25, 0.5,   0.5,      1,      0.5,    0.5,    0.25],
                    [0.125, 0.25,   0.5,    0.5,    0.5,    0.25,   .125],
                    [0,     0.125,  0.25,   0.5,    0.25,   0.125,  0   ],
                    [0,     0,      0.125,  0.25,  0.125,  0,       0   ]];

let my_kernel_4 =  [[0,     0,      0.125,  0.25,   0.125,  0,      0   ], //diagonal bands seem to work the best for kernels...
                    [0,     0.125,  0.25,   0.5,    0.25,   0.125,  0   ],
                    [0.125, 0.25,   0.5,    0.75,   0.5,    0.25,   0.125],
                    [0.25,  0.5,    0.75,   1,      0.75,   0.5,    0.25],
                    [0.125, 0.25,   0.5,    0.75,   0.5,    0.25,   0.125],
                    [0,     0.125,  0.25,   0.5,    0.25,   0.125,  0   ],
                    [0,     0,      0.125,  0.25,   0.125,  0,      0   ]];


                
let my_settings = {
    rows: 25,
    columns: 40,
    mines: Math.floor((Math.random() * 18) + 3),
    seed: Math.floor(Math.random() * 1000),
    kernel: my_kernel_4,
}
console.log(my_settings);


let boardContainer = document.getElementById("game-board");
let board_render;

let onWin = () => {
    window.alert("you survived!");

    //new settings
    my_settings.mines = Math.floor((Math.random() * 18) + 3);
    my_settings.seed = Math.floor(Math.random() * 1000);

    //reset board
    board_render.reset(new Board(my_settings));
    board_render.destroy();
    board_render.build();

}

let onLose = () => {
    window.alert("Oh no! You where annihilated!");

    //new settings
    my_settings.mines = Math.floor((Math.random() * 18) + 3);
    my_settings.seed = Math.floor(Math.random() * 1000);

    //reset board
    board_render.reset(new Board(my_settings));
    board_render.destroy();
    board_render.build();

}

class Game{

    constructor(boardContainer, settings){
        this.boardContainer = boardContainer;
        this.settings = settings;
        this.board_render = new BoardRender(boardContainer, new Board(settings), this.onWin, this.onLose);
        this.gameState = 'pregame';



    }
    resetGame(settings){
        if(settings){
            //update settings & reset
        }
        else{
            //use current settings to reset game
        }

    }
    onWin(){
        //append message to board container
    }
    onLose(){
        //append message to board container
    }
}
board_render = new BoardRender(boardContainer, new Board(my_settings), onWin, onLose);


let my_gradient = [
    {
        weight: 0,
        r: 255,
        g: 255,
        b: 255,
    },
    {
        weight: 15,
        r: 57,
        g: 255,
        b: 150,
    },
    {
        weight: 85,
        r: 26,
        g: 150,
        b: 255,
    },
    {
        weight: 101,
        r: 0,
        g: 0,
        b: 0,
    }


];

let gradientPointValue = (gradient, weight) => {
    let i;
    //find colors surounding weight
    for(i = 0; i < gradient.length; i++){
        if(gradient[i].weight > weight) break;
    }
    let c1 = gradient[i];
    let c0 = gradient[i - 1];
    console.log(c1);
    console.log(c0);

    let npw = weight - c0.weight; // normalize point weight
    let ncw = c1.weight - c0.weight // normalize color weight

    // normalize weight, multiply by slope, add to first color
    let r = Math.round(c0.r + npw * (c1.r - c0.r) / ncw); 
    let g = Math.round(c0.g + npw * (c1.g - c0.g) / ncw); 
    let b = Math.round(c0.b + npw * (c1.b - c0.b) / ncw); 

    return `rgb(${r}, ${g}, ${b})`;
}

let test = document.getElementById("test-id");
test.style.background = gradientPointValue(my_gradient, 100);
test.style.height = 50;
test.style.width = 50;
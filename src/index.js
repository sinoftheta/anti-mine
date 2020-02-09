// CSS //
import css from './style/desktop/desktop_style.css';
import game_interfaces from './style/desktop/game_interfaces.css';
import cursor_style from './style/desktop/cursor.css';
import kTooltip_style from './style/desktop/kTooltip.css';
import color_selector_style from './style/desktop/color_selector.css';

import Game from './views/Game.js';

Game();


class game{
    constructor(){
        this.view = 'title'; //define initial view

        //views need reference to this so they can access game methods
        this.views = {
            title: new title(this),
            freePlay: new gameManager(this),
            story: new gameManager(this),
            
        };
        this.title.init();
    }
    switchToView(view){
        //destroy current view
        this.views[this.view].destroy();

        //init new view
        this.views[view].init();

        //keep track of current view
        this.view = view;
    }
    saveData(data){
        //save data somewhere
    }
    readData(key){
        //read data from somewhere
        let data = 0;
        return data;
    }


}


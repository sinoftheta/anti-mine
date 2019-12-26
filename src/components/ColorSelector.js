import { rasterizeGradient } from "../functions/ColorMap";

 export default class ColorSelector{
    //initiate board elements, handle animations, handle click events
    constructor(container, settings, broadcaster){
        this.broadcaster = broadcaster;
        this.settings = settings;
        this.container = container;
        this.build();
    }

    build(){
        this.elements = [];
        this.colorSelectorContainer = document.createElement('div');
        this.colorSelectorContainer.id = "color-selector-container";

        this.settings.themes.forEach((theme, i) => {

            let element = document.createElement('div');

            //convert theme gradient data to css linear-gradient format
            let colorStops = '';
            theme.data.forEach(colorStop => {
                colorStops += `,rgb(${colorStop.r},${colorStop.g},${colorStop.b})`;//${colorStop.weight}%`;
            });
            element.style.backgroundImage = `linear-gradient(180deg${colorStops})`; //todo: make angle dynamic?
            element.classList.add('color-selector-element');
            element.classList.add('unselectable');

            //title
            element.innerHTML = `${theme.title}`;

            //change theme logic
            element.onclick = (e) => {
                this.selectTheme(i);
            }
            element.onkeydown = (e) => {
                //space & enter listener
                if(!(e.keyCode == 32 || e.keyCode == 13)) return;
                this.selectTheme(i);
            }
            element.tabIndex = 0;
            
            this.elements.push(element);
            this.colorSelectorContainer.appendChild(element);

        });
            
        this.container.appendChild(this.colorSelectorContainer);
    }
    selectTheme(i){
        //set theme
        this.settings.theme = i;

        //raster theme
        this.settings.gradientRaster = rasterizeGradient(this.settings.themes[i].data);
        console.log("theme: " + this.settings.themes[i].title);

        //broadcast recolor event
        this.broadcaster.dispatchEvent(new CustomEvent('tileRecolor', {}));
        
    }
 }
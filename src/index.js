import css from './style.css';
import myImg from './myImage.png'

console.log('Hello World!');

function image(img){
    const image = new Image();
    image.src = img;
    return image;
}

document.body.appendChild(image(myImg));
export default class Broadcaster{
    constructor(){
        this.subscribers = [];
    }
    subscribe(subscriber){

        this.subscribers.push(subscriber);
    }
    dispatchEvent(event, data){
        this.subscribers.forEach((subscriber) =>{
            subscriber.dispatchEvent(event, data);
        });
    }
}
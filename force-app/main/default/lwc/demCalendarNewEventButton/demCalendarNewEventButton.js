import { LightningElement, api } from 'lwc';

export default class DemCalendarNewEventButton extends LightningElement {
    
    @api date;

    clickedNewEvent(){
        this.dispatchEvent(CustomEvent('newevent', {
            detail: this.date
        }));
    }

}
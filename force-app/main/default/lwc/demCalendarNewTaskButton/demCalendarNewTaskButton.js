import { LightningElement, api, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';

export default class DemCalendarNewTaskButton extends LightningElement {
    @api date;

    clickedNewTask(){
        this.dispatchEvent(CustomEvent('newtask', {
            detail: this.date
        }));
    }

}
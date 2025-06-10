import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class DemCalendarActivityItem extends NavigationMixin(LightningElement) {
    @api activity;
    @api actionOnClick = 'view';
    
    clickedItem(){
        const id = this.activity.id;
        if (id){
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: id,
                    objectApiName: this.activity.sobject,
                    actionName: this.actionOnClick
                }
            });
        } else {
            alert('Not found Id');
        }
    }

}
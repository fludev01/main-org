import { LightningElement, api, track } from 'lwc';

export default class FinsOclSidebarMenuItem extends LightningElement {
    @api tab;
    @track selected = "slds-nav-vertical__item"

}
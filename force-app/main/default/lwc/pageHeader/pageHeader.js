import { LightningElement, api } from 'lwc';

export default class PageHeader extends LightningElement {
    @api iconName;
    @api iconSrc;
    @api iconType; // slds | image
    @api title;
    @api subtitle;
    @api showButton;
    @api buttonLabel;


    get showStandardIcon(){
        return this.iconType === 'slds';
    }

}
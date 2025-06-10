import {LightningElement, api} from 'lwc';
import insideSalesUpdateCRM from '@salesforce/resourceUrl/insideSalesUpdateCRM';
import insideSalesPDF from '@salesforce/resourceUrl/insideSalesPDF';

export default class InsideViewModal extends LightningElement{
    @api showUpdateCRM = false;
    @api showPDF = false;
    
    _insideSalesUpdateCRMURL = insideSalesUpdateCRM;
    _insideSalesPDFURL = insideSalesPDF;

    closeModal(){
        const closeModalEvent = new CustomEvent('closemodalevent', {
            bubbles: false,
            composed: false
        });
        this.dispatchEvent(closeModalEvent);
    }
}
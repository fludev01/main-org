import {LightningElement, track} from 'lwc';
import insideSalesPeople from '@salesforce/resourceUrl/insideSalesPeople';
import insideSalesInsights from '@salesforce/resourceUrl/insideSalesInsights';
import {loadStyle} from 'lightning/platformResourceLoader';
import sldsBrandBandOverride from '@salesforce/resourceUrl/sldsBrandBandOverride';

export default class InsideViewMain extends LightningElement{
    @track showCompanyInfo = true;
    @track showPeople = false;
    @track showInsights = false;
    @track updateCRM = false;
    @track downloadPDF = false;

    _insideSalesPeopleURL = insideSalesPeople;
    _insideSalesInsightsURL = insideSalesInsights;

    connectedCallback(){
        loadStyle(this, sldsBrandBandOverride);
    }

    closeModal(){
        this.updateCRM = false;
        this.downloadPDF = false;
    }

    selectCompanyInfo(){
        this.showCompanyInfo = true;
        this.showPeople = false;
        this.showInsights = false;
    }

    selectPeople(){
        console.log('selectPeople rabble');
        this.showCompanyInfo = false;
        this.showPeople = true;
        this.showInsights = false;
    }

    selectInsights(){
        this.showCompanyInfo = false;
        this.showPeople = false;
        this.showInsights = true;
    }

    showUpdateCRM(){
        console.log('updateCRM');
        this.updateCRM = true;
        this.downloadPDF = false;
    }

    showDownloadPDF(){
        console.log('downloadPDF');
        this.updateCRM = false;
        this.downloadPDF = true;
    }
}
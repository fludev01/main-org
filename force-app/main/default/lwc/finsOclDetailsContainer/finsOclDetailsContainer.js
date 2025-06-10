import { LightningElement, track, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import NCINO from '@salesforce/resourceUrl/FINS_nCinoLogo';
const FIELDS = [
    'Loan__c.Name',
    'Loan__c.Account__c'
];
export default class FinsOclDetailsContainer extends LightningElement {
    @api recordId;
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    loan;    
    // Show Borrowing tab or Details tab
    @track borrowingOrDetails = true;
    @track OppyName= "United Partners - Non-Real Estate";
    @track ncinologo = NCINO;
    // SIDE BAR TABS
    @track detailTabs = [
        {label: "RATE STRUCTURE"},
        {label: "PAYMENT STRUCTURE"},
        {label: "REFERRAL"},
        {label: "BALANCE DETAILS"},
        {label: "BOOKED DETAILS"}
    ];
    // SIDE BAR TABS
    @track sidebarTabs = [
        {label: "Loan Term"},
        {label: "Risk Rating"},
        {label: "Collateral"},
        {label: "Covenants"},
        {label: "Fees"},
        {label: "Policy Exceptions"},
        {label: "HMDA"},        
        {label: "CRA Reporting"},
        {label: "Loan Compliance"},
        {label: "Decision History"},
        {label: "Pricing Options"}
    ];

    get name() {
        if (this.loan.data) return this.loan.data.fields.Name.value;
    }
    get account() {
        if (this.loan.data) return this.loan.data.fields.Name.value.split('-')[0];
    }       

    handleSidebarClick(event) {
        console.log("Level 2");
        event.stopPropagation;
        this.borrowingOrDetails = !this.borrowingOrDetails;
    }
    onContinue() {
        this.borrowingOrDetails = false;
    }
}
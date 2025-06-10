import { LightningElement, api, track } from 'lwc';

export default class FinsOclSidebarMenu extends LightningElement {
    @api tabs;
    @api borrowOrLoan;
    //@track borrowCss = "slds-nav-vertical__item slds-is-active";
    //@track loanCss = "slds-nav-vertical__item";

    handleClick(event) {
        let clicked = event.target.innerText;
        if (clicked =="Borrowing Structure" && this.borrowOrLoan === false)  {
            this.dispatchEvent(new CustomEvent('sidebarclick', { bubbles: true, composed: true }));
        } 
        if (clicked =="Loan Details" && this.borrowOrLoan === true){
            this.dispatchEvent(new CustomEvent('sidebarclick', { bubbles: true, composed: true }));
        }
        
    }    
    @track
    uppercaseItemName;

    //@api
    get borrowCss() {
        let css = this.borrowOrLoan ?  "slds-nav-vertical__item slds-is-active" :  "slds-nav-vertical__item";
        return css;
    }
    get loanCss() {
        let css = this.borrowOrLoan ?  "slds-nav-vertical__item" : "slds-nav-vertical__item slds-is-active";
        return css;
    }
    // set borrowOrLoan(value) {
    //    this.uppercaseItemName = value.toUpperCase();
    // }


    // get borrow(){
    //     this.borrowOrLoan ? this.borrowCss = "slds-nav-vertical__item slds-is-active" : this.borrowCss = "slds-nav-vertical__item";
    // }
}
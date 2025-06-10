import { LightningElement, track, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import generateQuote from "@salesforce/apex/CPQB_MockNbqCTRL.generateQuote";
import getProductDetails from "@salesforce/apex/CPQB_MockNbqCTRL.getProductDetails";
export default class CpqbMockNbq extends LightningElement {
  @api recordId;
  @api currencyIso = "USD";
  @api cardTitle = "Recommended Quote";
  @api confirmationButtonLabel = "I'm In";
  @api recProductId;
  @track productName;
  @track showSpinner = false;

  connectedCallback() {
    this.showSpinner = true;
    getProductDetails({ productId: this.recProductId })
      .then(res => {
        this.productName = res.Name;
        this.showSpinner = false;
      })
      .catch(error => {
        this.showSpinner = false;
        this.showToast("Error", error.body.message, "error");
      });
  }

  handleConfirmation() {
    this.showSpinner = true;
    //console.log(this.recProductId);
    generateQuote({
      recordId: this.recordId,
      recProductId: this.recProductId,
      currencyISOCode: this.currencyIso
    })
      .then(quoteId => {
        this.showSpinner = false;
        this.showToast("New Quote Created", "", "success");
        const quoteCreatedEvent = new CustomEvent("quotecreated", {
          detail: { quoteId }
        });
        // Fire the custom event
        this.dispatchEvent(quoteCreatedEvent);
      })
      .catch(error => {
        this.showSpinner = false;
        this.showToast("Error", error.body.message, "error");
      });
  }

  // Toast Handler
  showToast(title, message, variant, mode) {
    const evt = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant,
      mode: mode
    });
    this.dispatchEvent(evt);
  }
}
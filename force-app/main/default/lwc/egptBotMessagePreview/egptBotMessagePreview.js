import { LightningElement, api, track } from "lwc";
import getEinsteinResponse from "@salesforce/apex/EGPT_SalesController.getEinsteinResponse";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class EgptBotMessagePreview extends LightningElement {
  @api recordId;
  @track message;

  connectedCallback() {
    this.getResponsePreview();
    this.addEventListeners();
  }

  addEventListeners() {
    window.addEventListener("egpt_messageaction", this.handleMessageAction, false);
  }

  handleMessageAction = (event) => {
    let action = event.detail.value;
    console.log("action", JSON.stringify(action));
    this.showSuccessToast(`${action.Name} Clicked`, `Action Type: ${action.ActionTarget__c}`);
  };

  showSuccessToast(title, message) {
    const event = new ShowToastEvent({
      variant: "success",
      title: title,
      message: message
    });
    this.dispatchEvent(event);
  }

  getResponsePreview() {
    getEinsteinResponse({ recordId: this.recordId })
      .then((result) => {
        this.message = {
          avatar: "",
          question: "",
          response: result[0],
          responseText: result[0].Answer__c,
          type: "answer"
        };
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  }

  refresh() {
    this.message = undefined;
    this.getResponsePreview();
  }
}
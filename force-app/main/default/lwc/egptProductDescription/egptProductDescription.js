import { LightningElement, track, api, wire } from "lwc";
import getResponse from "@salesforce/apex/OpenAIController.getResponse";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { getRecord, updateRecord } from "lightning/uiRecordApi";
const FIELDS = ["Product2.Description"];
import { refreshApex } from '@salesforce/apex';

export default class EgptProductDescription extends LightningElement {
  @api recordId;
  @track prompt = `Refine the product description for the ${this.name} into a persuasive, one-sentence explanation of the product highlighting its strongest features. The current description that needs refining is: ${this.current}. Express persuasion using emphatic words, intensifiers, and descriptive adjectives.`;
  showPrompt = false;
  recommendation = "";
  current = "";
  name = "";
  loading = true;


  @wire(getRecord, { recordId: "$recordId",  layoutTypes: ['Full'] })
  wiredRecord({ error, data }) {
    if (error) {
      let message = "Unknown error";
      if (Array.isArray(error.body)) {
        message = error.body.map((e) => e.message).join(", ");
      } else if (typeof error.body.message === "string") {
        message = error.body.message;
      }
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Error loading contact",
          message,
          variant: "error"
        })
      );
    } else if (data) {
      let product = data;
      this.name = product.fields.Name.value;
      console.log(JSON.stringify(this.name));
      this.current = product.fields.Description.value;
      this.regenerate();
    }
  }

  handleChange(event) {
    let fieldName = event.currentTarget.name;
    let value = event.currentTarget.value;
    switch (fieldName) {
      case "Prompt":
        this.prompt = value;
        console.log(this.prompt);
        break;
      case "Current":
        this.current = value;
        break;
      case "Recommendation":
        this.recommendation = value;
        break;
      default:
        console.log("Field Not Defined");
    }
  }

  togglePrompt() {
    this.showPrompt = !this.showPrompt;
  }

  get toggleIcon() {
    return this.showPrompt ? "utility:chevrondown" : "utility:chevronright";
  }

  regenerate() {
    this.loading = true;
    this.prompt = `Refine the product description for the ${this.name} into a persuasive, one-sentence explanation of the product highlighting its strongest features. The current description that needs refining is: ${this.current}. Express persuasion using emphatic words, intensifiers, and descriptive adjectives.`;
    this.getOpenAPIResponse(this.prompt);
  }

  getOpenAPIResponse(question) {
    getResponse({ searchString: question })
      .then((result) => {
        let response = JSON.parse(JSON.stringify(JSON.parse(result)));

        if (response.error) {
          console.log(response.error.message);
          this.postError(response.error.message);
        } else {

          console.log(response);
          this.recommendation = "";
          //let textResponse = response.generations[0].text;
          let textResponse = response.choices[0].message.content;
          textResponse = textResponse.replace(/[\n\r]/g, "");
          this.recommendation = textResponse;
          this.stopLoading(500);
        }
      })
      .catch((error) => {
        console.log("error is " + error);
        this.postError(error);
      });
  }

  apply() {
    // Create the recordInput object
    const fields = {};
    fields.Id = this.recordId;
    fields.Description = this.recommendation;
    const recordInput = { fields };

    updateRecord(recordInput)
      .then(() => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "Description Updated",
            variant: "success"
          })
        );
        return refreshApex(this.wiredRecord);
      })
      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error creating record",
            message: error.body.message,
            variant: "error"
          })
        );
      });
  }

  postError(error) {
    const event = new ShowToastEvent({
      title: "Error",
      message: error,
      variant: "error"
    });
    this.dispatchEvent(event);
  }

  stopLoading(timeoutValue) {
    // eslint-disable-next-line
    setTimeout(() => {
      this.loading = false;
    }, timeoutValue);
  }
}
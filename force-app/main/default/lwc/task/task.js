import { LightningElement, api } from "lwc";

export default class Task extends LightningElement {
  @api item = { title: "", isCompleted: false };
  showDetails = false;

  showItemDetails() {
    this.showDetails = !this.showDetails;
  }

  updateItemCompletion() {
    this.item.isCompleted = !this.item.isCompleted;
  }

  get toggleIcon() {
    return this.showDetails ? "utility:chevrondown" : "utility:chevronright";
  }

  openEinsteinGPT() {
    console.log("click");
    let event = new CustomEvent("openeinstein", {
      detail: {
        value: "hello"
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
}
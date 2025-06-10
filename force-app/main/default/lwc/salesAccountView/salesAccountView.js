import { LightningElement, api } from "lwc";

export default class Account extends LightningElement {
  loading = true;
  @api
  get description() {
    return this._description;
  }
  set description(value) {
    this._description = value;
    this.loading = true;
    this.stopLoading(500)
    console.log(this.description);
  }

  @api accountId;

  _description;

  connectedCallback() {
    this.stopLoading(500);
  }

  stopLoading(timeoutValue) {
    setTimeout(() => {
      this.loading = false;
    }, timeoutValue);
  }
}
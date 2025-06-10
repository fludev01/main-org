import { LightningElement, api, track } from "lwc";

export default class ServiceChatMessage extends LightningElement {

  @track _message;
  loading = true;

  @api caseSummary;
  @api knowledgeTitle;
  @api knowledgeContent;

  knowledgeFormEdit = true;

  @api
  get message() {
    return this._message;
  }
  set message(value) {
    this._message = value;
    if (value) {
      this.type = value.type;
      this.stopLoading(value.typingTime);
    }
  }

  type; // bookend-start inbound outbound bookend-end

  handleAction(event) {
    let actionName = event.currentTarget.dataset.name;
    let messageClone = JSON.parse(JSON.stringify(this._message));
    messageClone.actions.forEach((action) => {
      if (action.Name === actionName) {
        action.Disabled__c = true;
      }
    });  
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this._message = messageClone;
      let customEvent = new CustomEvent("messageaction", {
        detail: {
          value: actionName
        },
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(customEvent);
      if(actionName === 'Save'){
        this.handleKnowledgeSave();
      }  
    }, 500);
  }

  handleKnowledgeSave(){
    this.loading = true;
    this.knowledgeFormEdit = false;
    this.stopLoading(500);
  }

  get isBookendStart() {
    return this.type === "bookend-start";
  }

  get isInbound() {
    return this.type === "inbound";
  }

  get isOutbound() {
    return this.type === "outbound";
  }

  get isBookendEnd() {
    return this.type === "bookend-end";
  }

  get isSummary() {
    return this.type === "summary";
  }

  get isKnowledge(){
    return this.type === "knowledge";
  }

  get hasActions() {
    return this._message.actions?.length >= 1;
  }

  stopLoading(timeoutValue) {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this.loading = false;
      this.notifyWindow();
    }, timeoutValue);
  }
  
  notifyWindow(){
    let event = new CustomEvent("posted", {
      detail: {
        value: true
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);

  }


}
import { LightningElement, api, wire } from "lwc";
import getSuggestionList from "@salesforce/apex/EGPT_ServiceController.getSuggestionList";
import getResponse from "@salesforce/apex/OpenAIController.getResponse";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ServiceChatSuggestions extends LightningElement {
  state = "empty"; //  empty | active | complete
  thinking = true;
  containerHeight = 245;
  currentMessage;
  wordCount = 0;
  messageInt = 1;
  showSources = true;
  suggestedMessage = "";

  @api useLLMGateway = false;

  @wire(getSuggestionList) suggestions;

  connectedCallback() {
    this.addEventListeners();
  }

  addEventListeners() {
    // Subscribe to the inboundmessage custom event that is fired everytime a message posts to the chat window
    window.addEventListener("inboundmessage", this.handleMessage, false);
  }

  // Handle inbound messages as they come in from the main chat window
  handleMessage = (event) => {
    console.log("message received");
    let inboundMessage = event.detail.value;
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      if (inboundMessage.endChat) {
        this.endChat(inboundMessage.typingTime);
      } else {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        
        
        this.getSuggestion(inboundMessage.text, inboundMessage.prompt, inboundMessage.typingTime);
      }
    }, inboundMessage.typingTime + 1000);
  };

  endChat(wait) {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this.setState("complete");
      this.showSources = false;
    }, 700);
  }

  // Organize state changes
  setState(value) {
    console.log("State", value);
    this.state = value;
  }

  getSuggestion(message, prompt, wait) {
    let suggestion;
    if (this.useLLMGateway === true) {
      this.getOpenAPIResponse(prompt);
    } else {
      suggestion = this.suggestions.data.find((item) => message.toLowerCase().includes(item.Keyword__c.toLowerCase()));
      this.sources = suggestion.EinsteinDataSources__r;
      console.log(JSON.stringify(this.sources));
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        this.suggestedMessage = "";
        this.showSources = false;
        this.setState("active");
        this.typeMessage(suggestion.Response__c);
      }, wait + 1000);
    }
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
          this.sources = [{ Name: "Open AI" }, {Name: "Data Cloud"}];
          this.suggestedMessage = "";
          this.showSources = false;
          this.setState("active");
          let suggestion = response.generations[0].text;
          suggestion = suggestion.replace(/[\n\r]/g, '');
          console.log(suggestion);
          this.typeMessage(suggestion);
        }
      })
      .catch((error) => {
        console.log("error is " + error);
        this.postError(error);
      });
  }

  postError(error){
    const event = new ShowToastEvent({
      title: 'Error',
      message: error,
      variant: 'error',
  });
  this.dispatchEvent(event);
  }

  typeMessage(value) {
    this.typing = true;
    let speed = 15;
    let words = value.split(" ");
    if (this.wordCount < words.length) {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        this.suggestedMessage += words[this.wordCount] + " ";
        this.wordCount++;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
          this.typeMessage(value);
        }, speed);
      }, 25);
    } else {
      this.typing = false;
      this.showSources = true;
      this.thinking = false;
      this.wordCount = 0;
    }
  }

  pushMessage(event) {
    this.thinking = true;
    let type = event.currentTarget.dataset.type;
    console.log(type);
    let customEvent = new CustomEvent("outboundmessage", {
      detail: {
        type: type,
        value: this.suggestedMessage
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(customEvent);
    this.clearMessage();
  }

  clearMessage() {
    this.currentMessage = "";
  }

  get showEmptyState() {
    return this.state === "empty";
  }

  get showActiveState() {
    return this.state === "active";
  }

  get showCompleteState() {
    return this.state === "complete";
  }

  get containerStyle() {
    return `min-height:${this.containerHeight}px;`;
  }

  get containerClass() {
    return this.state !== "active" ? " slds-grid slds-wrap slds-align_absolute-center" : "slds-grid slds-wrap";
  }

  get messageStyle() {
    return this.thinking && !this.typing ? "text-weak" : "";
  }

  get messageContainer() {
    return this.suggestedMessage === "" ? "chat-message-container" : "chat-message-container";
  }

  get showRecomendation() {
    return true;
  }

  stopLoading(timeoutValue) {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this.loading = false;
    }, timeoutValue);
  }
}
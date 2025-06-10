import { LightningElement, api, track, wire } from "lwc";
import getConfiguration from "@salesforce/apex/EGPT_ServiceController.getConfiguration";
import getResponseList from "@salesforce/apex/EGPT_ServiceController.getResponseList";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getResponse from "@salesforce/apex/OpenAIController.getResponse";

export default class ServiceChatWindow extends LightningElement {

  @track messages = []; // Tracks the array of messages
  @api nextMessage; // Exposes the nextMessage property to other components
  recievedMessage; // Holds the received message
  endChatButton = false; // Controls the visibility of the end chat button
  showServiceChatModal = false; // Controls the visibility of the service chat modal
  @api useLLMGateway; // Exposes the useLLMGateway property to other components
  conversation; // Holds the conversation

  // ****** Starting State ******

  async connectedCallback() {
    this.addEventListeners(); // Adds event listeners when the component is connected
    this.getConfig(); // Gets the configuration when the component is connected
	  console.log('Error log Service Chat hello');
			// This should be in the parent component, probably `ServiceChatWindow`

/*try{
		let idSet = new Set();

this.messages.forEach(message => {
  if (idSet.has(message.id)) {
    console.log(`Error log Service Chat Duplicate id found: ${message.id}`);
  } else {
    idSet.add(message.id);
	  console.log(`Error log Service Chat No Duplicate id found: ${message.id}`);
  }

  if (!message.id) {
    console.log(`Error log Service Chat Null or undefined id found for message: ${JSON.stringify(message)}`);
  }
});
} catch(error)
		{
				console.log('Error log Service Chat error in messages'+error)
		}*/




  }

  addEventListeners() {
    // Adds event listeners for outboundmessage, messageaction, and usellmgateway events
    window.addEventListener("outboundmessage", this.handleMessage, false);
    window.addEventListener("messageaction", this.handleAction, false);
    window.addEventListener("usellmgateway", this.handleLLMGatewayToggle, false);
  }

  // Get Config and then get responses
  getConfig() {
    getConfiguration()
      .then((result) => {
        this.config = result; // Sets the config property to the result of the getConfiguration call
        this.caseSummary = this.config.ServiceCaseSummary__c; // Sets the caseSummary property to the ServiceCaseSummary__c field of the config
        this.getResponses(); // Gets the responses
      })
      .catch((error) => {
        console.log("Error: ", error); // Logs any errors
      });
  }

  // Get responses and then set the first header and starting message
  getResponses() {
    getResponseList()
      .then((result) => {
        this.responses = result; // Sets the responses property to the result of the getResponseList call
        this.setBookendStart(); // Sets the start of the bookend
      })
      .catch((error) => {
        console.log("Error log service chat get Response: ", error); // Logs any errors
      });
  }

  setBookendStart() {
    let message = this.configureInboundMessage("bookend-start", "", []); // Configures the start of the bookend
    this.publishMessage(message); // Publishes the message
    this.sendStartingMessage(); // Sends the starting message
  }

  sendStartingMessage() {
    let startingMessage = this.responses.find((response) => response.Id === this.config.ServiceStartingMessage__c); // Finds the starting message from the responses
    let message = this.configureInboundMessage(
      "inbound",
      startingMessage.Response__c,
      startingMessage.EndChat__c,
      startingMessage.TypingTime__c,
      startingMessage.Chat_Response_Actions__r,
      startingMessage.Prompt__c
    ); // Configures the inbound message
    this.publishMessage(message); // Publishes the message
    this.shareMessage(message); // Shares the message
  }


  //This method configures the inbound message.
  configureInboundMessage(type, text, endChat, typingTime, actions, prompt) {
    let message = {
      type: type,
      text: text,
      initials: this.config.ServiceContactInitials__c,
      avatar: this.config.ServiceContactAvatar__c,
      name: this.config.ServiceContactName__c,
      time: new Date().toLocaleTimeString(),
      endChat: endChat,
      typingTime: typingTime,
      actions: actions, 
      prompt: prompt
    };
    return message;
  }

  // This method configures the outbound message.
  configureOutboundMessage(type, text, actions) {
    let message = {
      type: type,
      text: text,
      initials: "",
      avatar: "",
      name: this.config.ServiceAgentName__c,
      time: new Date().toLocaleTimeString(),
      endChat: false,
      typingTime: 0,
      actions: actions
    };
    return message;
  }

  // This method publishes the message and scrolls to the bottom of the chat window.
  publishMessage(message, typingTime) {
    this.messages.push(message);
    this.scrollToBottom(typingTime);
    if (message.type === "bookend-end") {
      this.endChat(typingTime);
    }
	console.log('Error log Service Chat Message publishMessage' + JSON.stringify(message));
  }

  // This method handles the outbound message event.
  handleMessage = (event) => {
    let type = event.detail.type;
    let suggestion = event.detail.value;
    let fkEvent = { keyCode: 13 };
    switch (type) {
      case "Post":
        this.draftMessage = suggestion;
        this.handleKeystroke(fkEvent);
        break;
      case "Edit":
        this.updateTextArea(suggestion);
        break;
      default:
        console.log(`Type not recognized: ${type}.`);
    }
  };

  // This method handles the message action event.
  handleAction = (event) => {
    let action = event.detail.value;
    switch (action) {
      case "Close and Summarize":
        this.sendSummary();
				console.log('Error Service Chat Close and Summarize Event Fired');
        break;
      case "Create Knowledge Article":
        this.createKnowledgeArticle();
        break;
      case "Save as Draft":
        this.saveKnowledgeArticle();
        break;
      default:
        console.log(`Action not found: ${action}.`);
    }
  };

  // This method handles the LLM Gateway toggle event.
  handleLLMGatewayToggle = (event) => {
    this.useLLMGateway = event.detail.value;
  };

  // This method handles the input change event.
  handleInputChange(event) {
    this.draftMessage = event.target.value;
  }

  // This method handles the keystroke event.
  handleKeystroke(event) {
    let keyCode = event.keyCode;
    if (keyCode === 13) {
      let message = this.configureOutboundMessage("outbound", this.draftMessage, []);
      this.publishMessage(message, 0);
      this.clearTextArea();
      this.getResponse(message);
    }
  }

  // This method clears the text area.
  clearTextArea() {
    setTimeout(() => {
      [...this.template.querySelectorAll("lightning-textarea")].forEach((input) => {
        input.value = undefined;
      });
    }, 100);
  }

  // This method updates the text area with the given value.
  updateTextArea(value) {
    let textarea = this.template.querySelector("lightning-textarea");
    textarea.setRangeText(value);
  }

  // This method gets the response for the given message.
  getResponse(message) {
    let response = this.responses.find((item) => message.text.toLowerCase().includes(item.Keyword__c.toLowerCase()));
    let inboundMessage = this.configureInboundMessage(
      response.MessageType__c,
      response.Response__c,
      response.EndChat__c,
      response.TypingTime__c,
      response.Chat_Response_Actions__r,
      response.Prompt__c
    ); // Configures the inbound message
    this.shareMessage(inboundMessage); // Shares the inbound message
    setTimeout(() => {
      this.publishMessage(inboundMessage, response.TypingTime__c); // Publishes the inbound message after a delay
    }, 2000);
  }

  // This method handles the new message post event.
  handleNewMessagePost(){
    this.scrollToBottom(0); // Scrolls to the bottom of the chat window
  }

  // This method scrolls to the bottom of the chat window after a delay.
  scrollToBottom(typingTime) {
    for (let i = 0; i < 1000; i++) {
      if (i < 900) {
        this.scroll(i);
      } else {
        this.scroll(typingTime);
      }
    }
  }

  // This method scrolls to the bottom of the chat window.
  scroll(wait) {
    setTimeout(() => {
      let el = this.template.querySelector(".scroller");
      el.scrollTop = el.scrollHeight;
    }, wait);
  }

  // This method parses the messages.
  parseMessages(value){
    let messageContent; 
    value.forEach((message) => {
      messageContent = `${messageContent}; ${message.text}`;
    })
    this.conversation = messageContent; // Sets the conversation property to the parsed messages
  }

  // This method sends the summary.
  sendSummary() {
		console.log('Error Service Chat in Send Summary Function');
    if(this.useLLMGateway){
      this.parseMessages(this.messages); // Parses the messages
      this.getOpenAPIResponse(this.conversation); // Gets the OpenAI response for the conversation
    } else {
      let inboundMessage = this.configureInboundMessage("summary", "empty", false, 1000, [
        { Name: "Create Knowledge Article", Variant__c: "neutral" }
      ]); // Configures the inbound message
			console.log('Error Service Chat in Send Summary Function - InBoundMessage'+JSON.stringify(inboundMessage));
      this.publishMessage(inboundMessage, 1000); // Publishes the inbound message
      this.scrollToBottom(1000); // Scrolls to the bottom of the chat window
// dispatch event with caseSummary data
    const summaryEvent = new CustomEvent('casesummary', { detail: this.caseSummary });
				// New Delta Added to trouble shoot Event bubbling issue- Raj
    this.dispatchEvent(summaryEvent);
		            let event = new CustomEvent("caseclosed", {	
                detail: {	
                    value: this.caseSummary	
                },	
                bubbles: true,	
                composed: true	
            });	
            this.dispatchEvent(event);
		}
  }

  // This method ends the chat after a delay.
  endChat(typingTime) {
    setTimeout(() => {
      this.endChatButton = true; // Shows the end chat button
      this.scrollToBottom(typingTime); // Scrolls to the bottom of the chat window
    }, typingTime);
  }

  // This method shares the inbound message.
  shareMessage(inboundMessage) {
		console.log('Service Chat Log InboundMessage :'+inboundMessage);
    let event = new CustomEvent("inboundmessage", {
      detail: {
        value: inboundMessage
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event); // Dispatches the inboundmessage event
  }

  // This method saves the knowledge article.
  saveKnowledgeArticle() {
    this.showServiceChatModal = false; // Hides the service chat modal
    setTimeout(() => {
      const event = new ShowToastEvent({
        title: "Success!",
        message: "A new Knowledge Article has been created!",
        variant: "success"
      });
      this.dispatchEvent(event); // Dispatches the showToast event
    }, 1000);
  }

  // This method creates the knowledge article.
  createKnowledgeArticle() {
   this.showServiceChatModal = true; // Shows the service chat modal
  }

  // This method gets the OpenAI response for the given question.
  getOpenAPIResponse(question) {
		console.log('Service Chat Log getOpenAPIResponse :'+question);
    getResponse({ searchString: `write a short summary ofthis conversation: ${question}` })
      .then((result) => {
        let response = JSON.parse(JSON.stringify(JSON.parse(result)));
        if (response.error) {
          console.log(response.error);
          this.postError(response.error);
        } else {
          let suggestion = response.generations[0].text;
          suggestion = suggestion.replace(/[\n\r]/g, '');
          this.caseSummary = suggestion;
          let event = new CustomEvent("caseclosed", {
            detail: {
              value: suggestion
            },
            bubbles: true,
            composed: true
          });
					console.log('Service Chat Log caseclosed :');
          this.dispatchEvent(event);
      
          setTimeout(() => {
            let inboundMessage = this.configureInboundMessage("summary", "empty", false, 1000, [
              { Name: "Create Knowledge Article", Variant__c: "neutral" }
            ]);
            this.publishMessage(inboundMessage, 1000);
            this.scrollToBottom(1000);  
          }, 300);      
          return suggestion;
        }
      })
      .catch((error) => {
        console.log("error is " + error);
        this.postError(error);
      });
  }
}
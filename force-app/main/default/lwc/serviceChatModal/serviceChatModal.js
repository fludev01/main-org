import { LightningElement, api, track } from "lwc";
import getConfiguration from "@salesforce/apex/EGPT_ServiceController.getConfiguration";
import getResponse from "@salesforce/apex/OpenAIController.getResponse";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ServiceChatModal extends LightningElement {
  loading = true;
  config;
  conversation;
  _messages
  @track subject = '';
  @track article = '';
  @api useGateway;
  wordCount = 0;
  @api
  get messages() {
      return this._messages;
  }

  set messages(value) {
     this._messages = value;
     this.parseMessages(value);
     console.log(JSON.stringify(value))
  }

  parseMessages(value){
    let messageContent; 
    value.forEach((message) => {
      messageContent = `${messageContent}; ${message.text}`;
    })
    this.conversation = messageContent;
  }

  connectedCallback() {
    if(this.useGateway){
      this.getSubject();
      this.getArticle();  
    } else {
      this.getConfig();
      this.loading = false;
    }
  }

  getSubject(){
    this.getOpenAPIResponse(`Can you generate a short subject line for a customer service knowledge article with the following live chat conversation without the words chat summary: ${this.conversation}`, 'subject');
  }

  getArticle(){
    this.getOpenAPIResponse(`Consider the following chat transcript between a service agent and a customer: ${this.conversation} Transform the chat transcript into a step-by-step summary of the interaction. Clearly state the customer issue, the tactics the service agent used to resolve the issue, and the final resolution status in three short paragraphs. Do not include a subject line`,'article');
  }

  get articleSubject(){
    return this.useGateway ? this.subject : this.config.ServiceKnowledgeArticleTitle__c;
  }

  get articleBody(){
    return this.useGateway ? this.article : this.config.ServiceKnowledgeArticleContent__c;
  }


  getOpenAPIResponse(question, type) {
    console.log(question);
    getResponse({ searchString: question })
      .then((result) => {
        let response = JSON.parse(JSON.stringify(JSON.parse(result)));
        console.log(response);
        if (response.error) {
          console.log(response.error);
          this.postError(response.error);
        } else {
          console.log(response);
          this.suggestedMessage = "";
          let suggestion = response.generations[0].text;
          suggestion = suggestion.replace(/[\n\r]/g, "<br>");
          suggestion = suggestion.substring(8);
          console.log(suggestion);
          if(type === 'subject'){
            //suggestion = suggestion.substring(8);
            this.subject = suggestion;
          } else {
            //suggestion = suggestion.substring(9);
            this.typeMessage(suggestion);
          }
          setTimeout(() => {
            this.loading = false;
          }, 300);      
          return suggestion;
        }
      })
      .catch((error) => {
        console.log("error is " + error);
        this.postError(error);
      });
  }

  typeMessage(value) {
    this.typing = true;
    let speed = 15;
    let words = value.split(" ");
    if (this.wordCount < words.length) {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        this.article += words[this.wordCount] + " ";
        this.wordCount++;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
          this.typeMessage(value);
        }, speed);
      }, 25);
    } else {
      this.typing = false;
      this.wordCount = 0;
    }
  }
  postError(error){
    const event = new ShowToastEvent({
      title: 'Error',
      message: error,
      variant: 'error',
  });
  this.dispatchEvent(event);

  }

  getConfig() {
    getConfiguration()
      .then((result) => {
        this.config = result;
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  }

  handleSave() {
    this.loading = true;
    this.saved = true;
    this.stopLoading(300);
  }

  stopLoading(timeoutValue) {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this.dispatchEvent(new CustomEvent("closemodal"));
    }, timeoutValue);
  }
}
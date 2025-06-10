import { LightningElement, wire, track } from "lwc";
import getResponseList from "@salesforce/apex/EGPT_SalesController.getResponseList";
import getConfiguration from "@salesforce/apex/EGPT_SalesController.getConfiguration";
import getResponse from "@salesforce/apex/OpenAIController.getResponse";
import getEinsteinResponseList from '@salesforce/apex/EGPT_SalesController.getEinsteinResponseList';

import IMAGES from "@salesforce/resourceUrl/einsteingpt";

export default class EgptLeftPanel extends LightningElement {
    // ****** Props ******
    // State
    pannelState = 'empty'; // empty | active
    contentRegionState = 'home'; // contentState home | account | email
    showSpinner = false;
    showSidebar = true;
    showEmailState = false;
    useOpenAI = false;

    // Config
    einsteinUrl = IMAGES + '/einsteingpt/einstein.png';
    avatarUrl = IMAGES + '/einsteingpt/avatar.png';
    chartUrl = IMAGES + '/einsteingpt/chart.png';
    config;

    // Data
    @wire(getResponseList) responses;
    @track messages = [];
    description = '';
    acct_id = '';
    emailBody;

    // ****** Starting State ******
    @wire(getEinsteinResponseList)
    wiredResponseList({ error, data }) {
        if (data) {
            this.responses = data;
            console.log(JSON.stringify(data));
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.contacts = undefined;
        }
    }

    connectedCallback() {
        this.showEmailState = false;
        this.addEventListeners();
        this.getConfig();
    }

    getConfig() {
        getConfiguration()
            .then((result) => {
                this.config = result;
                console.log('This error trace raj' + JSON.stringify(this.config));
                this.handleConfig();
            })
            .catch((error) => {
                console.log('Error: ', error);
            });
    }

    handleConfig() {
        try {
            var config1 = JSON.stringify(this.config);
            console.log('leftPanel-Postback 1: ' + config1);
            // Parse the escaped JSON string into an object
            var config2 = JSON.parse(config1);
            console.log('leftPanel-Postback 2: ' + JSON.stringify(config2));
            // Read the value of SalesFeaturedAccount__c
            var salesFeaturedAccount = config2.SalesFeaturedAccount__c;
            console.log('leftPanel-Postback: ' + config2.SalesFeaturedAccount__c);
            this.acct_id = config2.SalesFeaturedAccount__c;
        } catch (error) {
            console.log('left Error: ', error.toString());
        }
    }

    addEventListeners() {
        window.addEventListener('openeinstein', this.handleMessage, false);
        window.addEventListener('egpt_messageaction', this.handleAction, false);
        window.addEventListener('egpt_messagetyping', this.handleTyping, false);
    }

    // Rest of the code...


    // ****** Event Handling ******

    handleTyping = () => {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            this.scrollToBottom();
        }, 50);
    };

    handleAction = (event) => {
        let action = event.detail.value;
        console.log('leftPanel3:' + action.Name);

        switch (action.Name.trim()) {
            case "Learn More":
                this.getAnswer("sustainability");
                break;
            case "Update Usage Summary":
                this.description = action.Content__c;
                //this.acct_id = JSON.stringify(this.config.SalesFeaturedAccount__c);
                // accountId = this.accountId; <-- Update this line
                console.log('leftPanel-Description:' + this.description);
                console.log('leftPanel-Postback' + JSON.stringify(this.config.SalesFeaturedAccount__c));
                // this.contentRegionState = 'Account';
                break;
            case "Compose Email":
                try {
                    this.showEmailState = true;
                    console.log("left showEmailState value:" + this.showEmailState);
                    this.showEmailComposer();
                } catch (error) {
                    console.log('left error' + error.message);
                }


                break;
            case "Send Email":
                this.sendEmail();
                console.log('left showEmailState from Send Email Event fired by Email LWC value:' + this.showEmailState);
                this.showEmailState = false;
                break;
            case "Edit":
                this.emailBody = action.Content__c;

                break;
            case "Email":
                this.sendEmailwithKeyword();
                break;
            default:
                console.log(`Action not found: ${action}.`);
        }
    };

    showEmailComposer() {
        this.getAnswer("email");
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            this.setContentRegionState("email");
        }, 3000);
    }

    sendEmailwithKeyword() {
        this.getAnswer("Adam Kim");
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            this.setContentRegionState("email");
        }, 500);
    }


    sendEmail() {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            this.setContentRegionState("home");
        }, 500);
    }

    setContentRegionState(value) {
        this.contentRegionState = value;
    }

    handleMessage = () => {
        this.showSidebar = true;
    };


    // ****** Message Handling ******

    handleInputCommit(event) {
        const question = event.target.value;
        let message = this.configureMessage(this.avatarUrl, question, null, "", "question");
        this.messages.push(message);
        event.target.value = "";
        this.pannelState = "active";
        this.scrollToBottom();

        this.getAnswer(question);
    }

    /*getAnswer(question) {

    this.showSpinner = true;
    const response = this.responses.find((item) =>
      question.toLowerCase().includes(item.Question__c.toLowerCase())
    );
								//alert(question);
    let wait = response?.ResponseDelay__c >= 1 ? response.ResponseDelay__c : 3000;
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this.showSpinner = false;
      let message;
      if (response) {
        message = this.configureMessage(this.avatarUrl, "", response, response.Answer__c, "answer");
        if (response.ContentRegionState__c) {
          this.setContentRegionState(response.ContentRegionState__c);
        }
        this.messages.push(message);
      } else {
        if(this.useOpenAI){
          this.getOpenAPIResponse(question);
        } else {
          message = this.configureMessage(
            this.avatarUrl,
            "",
            null,
            this.config.AssistantUnknownAnswerResponse__c,
            "unknown"
          );
          this.messages.push(message);

        }
      }
      this.scrollToBottom();
    }, wait);
  }*/
    /* Modified code for avoiding email not rendering */
    getAnswer(question) {
        this.showSpinner = true;

        let response;
        if (Array.isArray(this.responses)) {
            response = this.responses.find((item) =>
                question.toLowerCase().includes(item.Question__c.toLowerCase())
            );
        } else {
            console.error('this.responses is not an array');
            // You should handle this error appropriately for your use case
        }

        let wait = response && response.ResponseDelay__c >= 1 ? response.ResponseDelay__c : 3000;

        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            this.showSpinner = false;
            let message;
            if (response) {
                message = this.configureMessage(this.avatarUrl, "", response, response.Answer__c, "answer");
                if (response.ContentRegionState__c) {
                    this.setContentRegionState(response.ContentRegionState__c);
                }
                this.messages.push(message);
            } else {
                if (this.useOpenAI) {
                    this.getOpenAPIResponse(question);
                } else {
                    message = this.configureMessage(
                        this.avatarUrl,
                        "",
                        null,
                        this.config.AssistantUnknownAnswerResponse__c,
                        "unknown"
                    );
                    this.messages.push(message);
                }
            }
            this.scrollToBottom();
        }, wait);
    }

    showEmailComposer() {
        this.getAnswer("email");
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            this.setContentRegionState("email");
        }, 3000);
    }


    configureMessage(avatar, question, response, responseText, type) {
        let message = {
            avatar: avatar,
            question: question,
            response: response,
            responseText: responseText,
            type: type
        };
        return message;
    }

    scrollToBottom() {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            const el = this.template.querySelector(".scroller");
            el.scrollTop = el.scrollHeight;
        });
    }

    toggleSidebar() {
        this.showSidebar = !this.showSidebar;
    }

    get showEmptyPannelState() {
        return this.pannelState === "empty";
    }

    get sidebarIcon() {
        return this.showSidebar ? "utility:chevronright" : "utility:chevronleft";
    }

    get toggleStyle() {
        return this.showSidebar ? "" : "display:none";
    }

    get showHomeState() {
        return this.contentRegionState === "home";
    }

    get showAccountState() {
        return this.contentRegionState === "account";
    }

    get showEmailState() {
        return this.contentRegionState === "email";
    }

    disconnectedCallback() {
        window.removeEventListener("openeinstein", this.handleMessage, false);
        window.removeEventListener("messageaction", this.handleMessage, false);
    }


    getOpenAPIResponse(question) {
        //alert(question);
        getResponse({ searchString: question })
            .then(result => {
                let response = JSON.parse(JSON.stringify(JSON.parse(result)));

                console.log(JSON.stringify(response));
                //let suggestion = response.generations[0].text;
                let suggestion = response.choices[0].message.content;
                console.log(suggestion);
                suggestion = suggestion.replace(/[\n\r]/g, "<br>");
                //suggestion = suggestion.substring(8);


                let message = this.configureMessage(
                    this.avatarUrl,
                    "",
                    null,
                    suggestion,
                    "unknown"
                );
                console.log(JSON.stringify(message));
                this.messages.push(message);
                this.scrollToBottom();

            })
            .catch(error => {
                this.showSpinner = false
                console.log('error is ' + error)
            })
    }

}
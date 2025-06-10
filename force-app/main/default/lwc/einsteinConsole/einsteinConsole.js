import { LightningElement, wire, track } from "lwc";
import getResponseList from "@salesforce/apex/EGPT_SalesController.getResponseList";
import getConfiguration from "@salesforce/apex/EGPT_SalesController.getConfiguration";
import getResponse from "@salesforce/apex/OpenAIController.getResponse";
import getEinsteinResponseList from '@salesforce/apex/EGPT_SalesController.getEinsteinResponseList';

import IMAGES from "@salesforce/resourceUrl/einsteingpt";

export default class EinsteinConsole extends LightningElement {

    // ****** Props ******

    // State 
    pannelState = 'empty' // empty | active
    contentRegionState = "home"; // contentState home | account | email
    showSpinner = false;
    showSidebar = false;
    useOpenAI = true;

    // Config
    einsteinUrl = IMAGES + "/einsteingpt/einstein.png";
    avatarUrl = IMAGES + "/einsteingpt/avatar.png";
    chartUrl = IMAGES + "/einsteingpt/chart.png";
    config;

    // Data
    @wire(getResponseList) responses;
    @track messages = [];
    description;
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
        this.addEventListeners();
        this.getConfig();
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

    addEventListeners() {
        window.addEventListener("openeinstein", this.handleMessage, false);
        window.addEventListener("egpt_messageaction", this.handleAction, false);
        window.addEventListener("egpt_messagetyping", this.handleTyping, false);
    }

    // ****** Event Handling ******

    handleTyping = () => {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            this.scrollToBottom();
        }, 50);
    };

    handleAction = (event) => {
        let action = event.detail.value;
        console.log(action.Name);
        switch (action.Name) {
            case "Learn More":
                this.getAnswer("sustainability");
                break;
            case "Update Description":
                this.description = action.Content__c;
                break;
            case "Compose Email":
                this.showEmailComposer();
                break;
            case "Send Email":
                this.sendEmail();
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
        }, 500);
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

    getAnswer(question) {
        this.showSpinner = true;
        const response = this.responses.find((item) =>
            question.toLowerCase().includes(item.Question__c.toLowerCase())
        );
        let wait = (response && response.ResponseDelay__c >= 1) ? response.ResponseDelay__c : 3000;


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
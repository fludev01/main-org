import { LightningElement, api, track } from 'lwc';

export default class BotMessage extends LightningElement {

    @track _message;
    wordCount = 0;
    typedAnswer = '';
    typing = true;
    @api
    get message() {
        return this._message;
    }
    set message(value) {
       this._message = value;
       if(value){
        this.type = value.type;
        console.log(this.type);
        if(this.type === 'answer' || this.type === 'unknown'){
            this.typeMessage(value.responseText);
        }
       }
    }

    typeMessage(value) {
        let speed = 15;
        let words = value.split(" ");
        console.log('words', JSON.stringify(words));
        if (this.wordCount < words.length) {
          // eslint-disable-next-line @lwc/lwc/no-async-operation
          setTimeout(() => {
            this.typedAnswer += words[this.wordCount] + " ";
            this.nofityWindow();
            this.wordCount++;
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout(() => {
              this.typeMessage(value);
            }, speed);
          }, 25);
        } else {
          this.wordCount = 0;
          this.typing = false;
        }
      }

      nofityWindow(){
        let event = new CustomEvent("typing", {
          detail: {
            value: true
          },
          bubbles: true,
          composed: true
        });
        this.dispatchEvent(event);    
      }

    handleAction(event){
        let actionName = event.currentTarget.dataset.action;
        let messageClone = JSON.parse(JSON.stringify(this._message));
        messageClone.response.Bot_Actions__r.forEach((action) => {
            if(action.Name === actionName){
                action.Disabled__c= true;
            }
        })
        this._message = messageClone;
        let customEvent = new CustomEvent("messageaction", {
          detail: {
            value: actionName
          },
          bubbles: true,
          composed: true
        });
        this.dispatchEvent(customEvent);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
    }    

    get showQuestion(){
        return this.type === 'question';
    }

    get showAnswer(){
        return this.type === 'answer' || this.type === 'unknown';
    }

    get unknown(){
        return this.type === 'unknown';
    }

    // LWC Override Components
    
    get showBotMessageContactList(){
        return this._message.response.LWCName__c === 'botMessageContactList';
    }

}
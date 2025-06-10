import { LightningElement } from 'lwc';

export default class BotMessageContactList extends LightningElement {

    sendEmail(){
        let customEvent = new CustomEvent("messageaction", {
          detail: {
            value: 'Compose Email'
          },
          bubbles: true,
          composed: true
        });
        this.dispatchEvent(customEvent);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
    }   
}
import { LightningElement } from 'lwc';

export default class NextBestAction extends LightningElement {

    loading = true;

    connectedCallback(){
        this.stopLoading(700);
    }

    stopLoading(timeoutValue) {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
          this.loading = false;
        }, timeoutValue);
      }
    
}
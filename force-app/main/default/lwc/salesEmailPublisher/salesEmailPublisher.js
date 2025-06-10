import { api, LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Email extends LightningElement {

    @api text;
    loading = false;

    fromOptions = [{ label: 'Justin Chen <jchen@cumulus.com>', value: 1 }];
    fromValue = 1;

    toItems = [
        {
            type: 'avatar',
            href: 'https://www.salesforce.com',
            label: 'Julie Morris',
            fallbackIconName: 'standard:contact',
            alternativeText: 'User avatar',
            isLink: true,
        }];

    bccItems = [
        {
            label: 'michael.jones@nto.com'
        }];

    subjectValue = `Let's Chat About Franchising Morris Roasters and Boosting Your Business`;

    handleClick() {
        this.loading = true;
        const event = new ShowToastEvent({
            title: 'Success!',
            message: 'An email has been sent to Julie Morris!',
            variant: 'success'
        });
        this.dispatchEvent(event);
        this.stopLoading(1000);

        let customEvent = new CustomEvent("egpt_messageaction", {
            detail: {
              value:{Name: 'Send Email'}
            },
            bubbles: true,
            composed: true
          });
          this.dispatchEvent(customEvent);
      

    }

    stopLoading(timeoutValue) {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
          this.loading = false;
        }, timeoutValue);
      }

}
import { LightningElement, api } from "lwc";
import getConfiguration from "@salesforce/apex/EGPT_ServiceController.getConfiguration";
import getCaseDetails from "@salesforce/apex/EGPT_ServiceController.getCaseDetails";

export default class CaseRecordDetails extends LightningElement {
  @api recordId;
  caseOpen = true;
  loading = false;
  caseRecord;
  caseSummary = 'A customer asked a service agent about the temperature rating of the K3 Alpine jacket. The agent recommended the 2022 model, rated for 5°F, and suggested pairing it with the M3 Alpine insulation layer for additional warmth in -3°F temperatures. The customer added the layer to their saved items and thanked the agent, who wished them a great trip.'
  
connectedCallback() {
    try {
        this.getConfig();
				console.log('Service Case Log: No Error in getConfig ');
    } catch (error) {
        console.error('Service Case Log: Error in getConfig: ', error);
    }

    console.log('CaseID' + this.recordId);

    try {
        this.getCase();
				console.log('Service Case Log: No Error in getCase ');
				console.log('Service Case Log: Case Record '+JSON.stringify(this.caseRecord));
    } catch (error) {
        console.error('Service Case Log: Error in getCase: ', error);
    }

    try {
        this.addEventListeners();


				console.log('Service Case Log: No Error in addEventListeners ');
				console.log('Service Case Log: caseSummary' + this.loading);
				console.log('Service Case Log:  Case Id' + this.recordId);
				console.log('Service Case Log: Case Details' + JSON.stringify(this.caseRecord));
				console.log('Service Case Log:  caseSummary' + this.caseSummary);
				//this.caseRecord.caseSummary = this.caseSummary;
    } catch (error) {
        console.error('Service Case Log: Error in addEventListeners: ', error);
    }
}

  addEventListeners() {
    window.addEventListener("caseclosed", this.handleAction, false);
		window.addEventListener('casesummary', this.handleCaseSummary.bind(this));
  }
		handleCaseSummary(event) {
				console.log('Service Case Log:  handleCaseSummary' + this.caseSummary);
			this.caseSummary = event.detail;
				this.caseOpen = false;

		}
  handleAction = (event) => {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
				console.log('Service Case Log1:  handleAction' + this.caseSummary);

    setTimeout(() => {
      console.log('recieved event',event.detail.value);
      this.caseSummary = event.detail.value;
      this.caseOpen = false;
      this.loading = true;
      this.stopLoading(500);
    }, 2000);
  };

  getConfig() {
    getConfiguration()
      .then((result) => {
        this.config = result;
      })
      .catch((error) => {
        console.log("Error Config: ", error);
      });
  }

  getCase() {
    getCaseDetails({ recordId: this.recordId })
      .then((result) => {
        this.caseRecord = result;
				console.log("Service Case Log:  Get Case Details: ", JSON.stringify(result));
				console.log("Service Case Log:  Get CaseRecord: ", JSON.stringify(this.caseRecord));
      })
      .catch((error) => {
        console.log("Service Case Log:  Get Case Details Retrival Error: ", error);
      });
  }

  get caseStatus() {
    return this.caseOpen ? "Open" : "Closed";
  }

  get showDetailsSection() {
    return this.caseOpen ? "slds-section slds-is-open" : "slds-section";
  }

  get sectionIcon() {
    return this.caseOpen ? "utility:chevrondown" : "utility:chevronright";
  }

  stopLoading(timeoutValue) {
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      this.loading = false;
    }, timeoutValue);
  }
		handleCaseSummary(event) {
  this.caseSummary = event.detail.caseSummary;
}
	disconnectedCallback() {
  this.template.removeEventListener('casesummary', this.handleCaseSummary);
	this.template.removeEventListener('caseclosed', this.handleCaseSummary);
}
}
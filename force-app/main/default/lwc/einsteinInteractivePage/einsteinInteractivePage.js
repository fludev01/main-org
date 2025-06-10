import { LightningElement, wire, track } from "lwc";
import getConfiguration from "@salesforce/apex/EGPT_SalesController.getConfiguration";
import getUserDetails from "@salesforce/apex/EGPT_SalesController.getUserDetails";
import getNameFromId from "@salesforce/apex/EGPT_SalesController.getNameFromId";

export default class EinsteinInteractivePage extends LightningElement {

    @track pageReference;
    recordName = '';
    emailBody;

    connectedCallback() {
        this.addEventListeners();
        this.getConfig();
        this.getUser();
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
    
      getUser() {
        getUserDetails()
          .then((result) => {
            console.log(JSON.stringify(result));
            this.user = result;
          })
          .catch((error) => {
            console.log("Error: ", error);
          });
      }
      
      getRecordName() {
        getNameFromId({recordId: this.pageReference.targetRecordId, sObjectName: this.pageReference.targetSObjectType})
          .then((result) => {
            console.log(JSON.stringify(result));
            this.recordName = result;
          })
          .catch((error) => {
            console.log("Error: ", error);
          });
      }
    
      addEventListeners() {
        window.addEventListener("egpt_pagereference", this.handlePageReference, false);
      }
    
      // ****** Event Handling ******
        
      handlePageReference = (event) => {
        this.notifyStateChange();
        let pageReference = event.detail.value;
        console.log('Received Page Reference', JSON.stringify(pageReference));
        this.pageReference = pageReference;
        if(this.pageReference.targetSObjectType && this.pageReference.targetRecordId){
            this.getRecordName();
        }
        if(this.pageReference.type === 'Email'){
            this.emailBody = this.pageReference.targetContent;
        }
      };


      notifyStateChange() {
        const customEvent = new CustomEvent("statechange", {
          detail: {
            value: true
          },
          bubbles: true,
          composed: true
        });
        this.dispatchEvent(customEvent);
      }
    

      get iconName(){
        return `standard:${this.pageReference?.targetSObjectType.toLowerCase()}`;
      }

      get buttonLabel(){
        return `View ${this.pageReference?.targetSObjectType}`;
      }

      get showPageHeader(){
        return this.pageReference?.type === 'Record Page';
      }

      get showRecordDetail(){
        return this.pageReference?.type === 'Record Page';
      }

      get showEmailPublisher(){
        return this.pageReference?.type === 'Email'
      }

      get responseBody(){
            return JSON.stringify(this.pageReference, null, "\t");
      }


    
}
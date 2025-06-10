/**
 * Generic Dual Picklist / "Shuttle applet" Lightning Web Component for OmniScript
 * 
 * This works by being pointed at an input element in the OmniScript data JSON
 * and being configured as to how to present the data from that element.
 * 
 * Items moved to the right list will be saved to the Omniscript node represented by the name
 * of this element.
 * 
 * @author Dean Fischesser <dfischesser@salesforce.com>
 * 
 * History
 * =======
 * 1.0 - February, 2021 - Initial Version
 * 2.0 - May, 2021
 *          Modified to output selected items as a ";" delimited string in the Data JSON to simplify the updating of a multi-valued field.   
 *          Selected items are now output to an array structure in the node "arrayOfSelections" and output as a single JSON field 
 *          called "delimitedListOfSelections"
 * 
 * 3.0 - Aug, 2022
 *          Rewrite to handle saving of choices when navigating back and forth with the OmniScript
 * 
 **/

import {LightningElement,track,api} from 'lwc';
import {OmniscriptBaseMixin} from 'omnistudio/omniscriptBaseMixin';
export default class sfiArch_DualPickList extends OmniscriptBaseMixin(LightningElement) {
    
    savedSelectedList=[]; // this is a list of selections that is saved via omniSaveState when navigating away from the LWC step 
    myDualPickListName = ''; // this is to hold the unqiue name of the instance of the LWC, thereby supporting the use of more than one usage in a single OmniScript

// values in the HTML Control reference that are updated when changed in this js    
    @track optionsList = [];
    @track defaultOptionsList = [];
    @track selectedlabelheading = '';
    
// values from LWC Properties provided in the Omniscript    
    @api sourcelabel;        
    @api selectedlabel;
    @api selectedlabelmultiple;
    @api label;

    @api
    get mydata () {     
        return this.options;
    }

    set mydata (val) {
        let initOptionsListValue = [];
        let initOptionsList = val;
        initOptionsList.forEach((item, i) => {
            initOptionsListValue.push({"label":item.PickListLabel,"value":item.PickListValue});
        });
        this.options = initOptionsListValue;
    }

/*    @api   I NEED TO REFACTOR TO HANDLE VALUES COMING FROM A MULTI-SELECT FIELD WITH CURRENT VALUES
    get myselected () {
        return this.defaultOptionsList;
    }
    set myselected (val) {
        let initOptionsListValue = [];
        let initOptionsList = val.split(';');
        this.defaultOptionsList = initOptionsList;
        initOptionsList.forEach((item, i) => {
            initOptionsListValue.push(item);
        });
        this.defaultOptionsList = initOptionsListValue;
    }
*/
    connectedCallback(){
        this.myDualPickListName = JSON.stringify(this.omniJsonDef.name);
        let previousSelections = this.omniGetSaveState(this.myDualPickListName + 'savedSelectionsKey');

        if(previousSelections != null){
            this.defaultOptionsList = previousSelections.mySavedSelections;
            this.savedSelectedList = previousSelections.mySavedSelections;
        }

        if(this.savedSelectedList.length>1 && this.selectedlabelmultiple!='' && this.selectedlabelmultiple !== undefined){
            this.selectedlabelheading = this.selectedlabelmultiple;
        }
        else{
            this.selectedlabelheading = this.selectedlabel;
        }
     }

     disconnectedCallback() {
        let mySaveState = {"mySavedSelections":this.savedSelectedList};
        let key = this.myDualPickListName + 'savedSelectionsKey';
        let usePubSub = true;

        this.omniSaveState(mySaveState, key, usePubSub);
    }

    handleChange(event) {
        let optionsInDelimitedList='';
        let selectedItems = [];
        this.savedSelectedList =[];
        const selectedOptionsList = event.detail.value;

        selectedOptionsList.forEach((item, i) => {
            selectedItems.push({"selected":item});
            optionsInDelimitedList = optionsInDelimitedList + item + ";";
            this.savedSelectedList.push(item);
        });

        if(selectedOptionsList.length>1 && this.selectedlabelmultiple !='' && this.selectedlabelmultiple !== undefined){
            this.selectedlabelheading = this.selectedlabelmultiple;
        }
        else{
            this.selectedlabelheading = this.selectedlabel;
        }

        this.omniUpdateDataJson({"arrayOfSelections":selectedItems});
        this.omniUpdateDataJson({"delimitedListOfSelections":optionsInDelimitedList});
    }
}
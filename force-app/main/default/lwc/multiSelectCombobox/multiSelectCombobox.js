import { LightningElement, track, api } from 'lwc';
import { OmniscriptBaseMixin } from 'omnistudio/omniscriptBaseMixin';
export default class MultiSelectCombobox extends OmniscriptBaseMixin(LightningElement) {
    @api listType;//Label of the combobox
    @api listData;//Label, Value pair options to select from combobox
    @api retainSelections;//Omniscript doesn't support stand alone for custom lwc
    @api jsonNodeName;//Node name to reflect the selections in omniscript
    @track optionData;
    @track value;
    @track values = [];
    @track searchString;
    @track message;
    @track showDropdown = false;
    @track options;
    @track placeholder;

    //init method
    connectedCallback() {
        var options, it;
        var listDataVar = this.listData;
        this.showDropdown = false;
        //To retain selected values when navigating between different steps in OmniScript
        if (this.retainSelections && this.listData) {
            options = JSON.parse(JSON.stringify(this.listData));
            for (it = 0; it < options.length; it++) {
                if (this.retainSelections.includes(options[it].value)) {
                    options[it].selected = true;
                    this.values.push(options[it].value);
                }
            }
            if (this.retainSelections.length === 1) {
                this.placeholder = this.retainSelections.length + ' option selected';
            } else {
                this.placeholder = this.retainSelections.length + ' options selected';
            }
            listDataVar = options;
            this.pushDataToOmniScript();
        } else {
            this.placeholder = 'Select an option';
        }
        if (listDataVar) {
            this.optionData = listDataVar;
        }
    }

    //Filters records based on the user input
    filterOptions(event) {
        var flag;
        var it;
        this.searchString = event.target.value;
        if (this.searchString && this.searchString.length > 0) {
            this.message = '';
            //Can be able to start filtering based on min characters entered
            if (this.searchString.length >= 1) {
                flag = true;
                for (it = 0; it < this.optionData.length; it++) {
                    if (this.optionData[it].label.toLowerCase().trim().startsWith(this.searchString.toLowerCase().trim())) {
                        this.optionData[it].isVisible = true;
                        flag = false;
                    } else {
                        this.optionData[it].isVisible = false;
                    }
                }
                if (flag) {
                    this.message = "No results found for '" + this.searchString + "'";
                }
            }
            this.showDropdown = true;
        } else {
            this.showDropdown = false;
        }
    }

    //Stores the user selected input
    selectItem(event) {
        var count, options, it;
        var selectedVal = event.currentTarget.dataset.id;
        if (selectedVal) {
            count = 0;
            options = JSON.parse(JSON.stringify(this.optionData));
            for (it = 0; it < options.length; it++) {
                if (options[it].value === selectedVal) {
                    if (this.values.includes(options[it].value)) {
                        this.values.splice(this.values.indexOf(options[it].value), 1);
                    } else {
                        this.values.push(options[it].value);
                    }
                    options[it].selected = options[it].selected ? false : true;
                }
                if (options[it].selected) {
                    count++;
                }
            }
            this.optionData = options;
            if (count === 1) {
                this.placeholder = count + ' option selected';
            } else {
                this.placeholder = count + ' options selected';
            }
            event.preventDefault();
        }
    }

    //Displays list of picklist values
    showOptions() {
        var options, it;
        if (this.optionData) {
            this.message = '';
            this.searchString = '';
            options = JSON.parse(JSON.stringify(this.optionData));
            for (it = 0; it < options.length; it++) {
                options[it].isVisible = true;
            }
            if (options.length > 0) {
                this.showDropdown = true;
            }
            this.optionData = options;
        }
    }

    //Removes the selected values
    removePill(event) {
        var value = event.currentTarget.name;
        var count = 0;
        var it;
        var options = JSON.parse(JSON.stringify(this.optionData));
        for (it = 0; it < options.length; it++) {
            if (options[it].value === value) {
                options[it].selected = false;
                this.values.splice(this.values.indexOf(options[it].value), 1);
            }
            if (options[it].selected) {
                count++;
            }
        }
        this.optionData = options;
        if (count === 1) {
            this.placeholder = count + ' option selected';
        } else {
            this.placeholder = count + ' options selected';
        }
        this.pushDataToOmniScript();
    }

    //When user blurs out from the input
    blurEvent() {
        var count = 0;
        var it;
        if (this.optionData) {
            for (it = 0; it < this.optionData.length; it++) {
                if (this.optionData[it].selected) {
                    count++;
                }
            }
        }
        if (count === 1) {
            this.placeholder = count + ' option selected';
        } else {
            this.placeholder = count + ' options selected';
        }
        this.showDropdown = false;
        this.pushDataToOmniScript();
    }

    //Sends data back to the Omniscript
    pushDataToOmniScript() {
        if (this.jsonNodeName) {
            let respData = {
                [this.jsonNodeName]: this.values
            };
            this.omniApplyCallResp(respData);
        }
    }
}
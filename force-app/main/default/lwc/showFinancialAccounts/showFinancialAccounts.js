import { LightningElement, track, api } from 'lwc';
import { OmniscriptBaseMixin } from 'omnistudio/omniscriptBaseMixin';
export default class ShowFinancialAccounts extends OmniscriptBaseMixin(LightningElement) {
    @api listType;//Label(Optional)
    @api listData;//List of Accounts
    @api retainSelection;//Omniscript doesn't support stand alone for custom lwc
    @api jsonNodeName;//Node name to reflect the selections in omniscript
    @api placeholder;//Field Placeholder(Optional)
    @api changeIndicationNode;//Parameter to detect change(Optional)
    @track showAccounts = false;
    @track selectedAccount;
    @track selectedAccountData;
    connectedCallback() {
        if (this.retainSelection) {
            this.selectedAccountData = this.retainSelection;
            this.selectedAccount = this.retainSelection.FinancialAccountLabel;
            this.pushDataToOmniScript();
        }
    }
    inputChange(event) {
        event.preventDefault();
    }
    showOptions() {
        this.showAccounts = true;
    }
    blurEvent() {
        this.showAccounts = false;
    }
    selectEvent(event) {
        var selectedAccId = event.currentTarget.dataset.id;
        var it1, it2;
        this.selectedAccount = event.currentTarget.dataset.label;
        for (it1 = 0; it1 < this.listData.length; it1++) {
            for (it2 = 0; it2 < this.listData[it1].Accounts.length; it2++) {
                if (this.listData[it1].Accounts[it2].Id === selectedAccId) {
                    this.selectedAccountData = this.listData[it1].Accounts[it2];
                }
            }
        }
        this.pushDataToOsWithIndication();
    }
    pushDataToOmniScript() {
        if (this.jsonNodeName) {
            let respData = {
                [this.jsonNodeName]: null
            };
            this.omniApplyCallResp(respData);
            respData = {
                [this.jsonNodeName]: JSON.parse(JSON.stringify(this.selectedAccountData))
            };
            this.omniApplyCallResp(respData);
        }
    }
    pushDataToOsWithIndication() {
        if (this.jsonNodeName) {
            if (this.changeIndicationNode) {
                let respData = {
                    [this.jsonNodeName]: null
                };
                this.omniApplyCallResp(respData);
                respData = {
                    [this.jsonNodeName]: JSON.parse(JSON.stringify(this.selectedAccountData)),
                    [this.changeIndicationNode]: true
                };
                this.omniApplyCallResp(respData);
            } else {
                this.pushDataToOmniScript();
            }
        }
    }
}
import { LightningElement,track,api } from 'lwc';
    import { OmniscriptBaseMixin } from 'omnistudio/omniscriptBaseMixin';
    export default class eRegTrxList extends OmniscriptBaseMixin(LightningElement) {  
    //@track data = {};
    @track displayRows = [];
    @api title = '';


    @track 
    source_data = [];
    

    @api
    get source() {
        return this.source_data;
    }
    set source(val) {
        //  Note that we get null if there data is not yet present in the OS
        if (val === null) {
           console.log("Got null source data");
            return    
        }
        this.source_data = val;        
        this.initMethod();
    }

    connectedCallback() {
        console.log('connectedCallback');
        if (this.displayRows.length==0) this.initMethod();
    }

    renderedCallback() {
        console.log('renderedCallback');
        
        if (JSON.parse(JSON.stringify(this.omniJsonData.trxSelected))){
            this.displayRows[JSON.parse(JSON.stringify(this.omniJsonData.trxSelected))].checked = true;
        }
    
    }
   
    initMethod() {
        console.log("initMethod");
        let tempRows = [];

        tempRows = JSON.parse(JSON.stringify(this.source_data));
      try{  
        if (tempRows.length == 0) {
            console.log("source data is null - look for data in data.json node with same name as Custom LWC element");
            tempRows = JSON.parse(JSON.stringify(this.omniJsonData[this.omniJsonDef.name]));
        }
        
        tempRows.forEach((item, i) => {
           item.tagname = "cb_" + i;
           item.rowid = i;
           item.checked = false;
           item.filtered = false;
        });

        this.displayRows = [];
        tempRows.forEach((item, i) => {
            this.displayRows.push(item);
        }); 
    }
        catch(err) {console.log(err.message);}   
   }

    filterSelectedFromList(list) {
        const filteredList = list.filter(
            checked = true
        );
        return filteredList
    }

    selectRow(event) {        
        const selected = event.target.checked;
        const target = event.target.name;
        const iteration=parseInt(target.substring(3,target.length));
        for (var a=0; a<this.displayRows.length; a++){
            this.displayRows[a].checked=false;
        }
        this.displayRows[iteration].checked = true;
        this.omniApplyCallResp({'trxSelected':iteration});
        
    }

    getRows() {
        let data = [];
        let filtered = [];
        data = this.displayRows;
        filtered = data.filter(function(item){
            return item.checked == true;
        });
        return filtered;
    }

    handleSelection(event) {
        this.selectRow(event);
        this.omniUpdateDataJson(this.getRows());
    }
}
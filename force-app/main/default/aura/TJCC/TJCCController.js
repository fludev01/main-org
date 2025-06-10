({
    init : function(component, event, helper) {
        helper.startFlow(component, event, helper);
        //helper.fireApex( arguments, "c.getRecs", {recId : component.get("v.recordId") },  (object) => helper.cont(arguments, object) )
        
        helper.createComponent( arguments, "lightning:flow", { 'aura:id' : 'flowData', 'onstatuschange' : component.getReference("c.flowStatus")}, 'v.container');
        
        component.set('v.columns', [
            {label: 'Disputed', fieldName: 'Disputed__c', type: 'boolean' },
            {label: 'Effective Date', fieldName: 'FinServ__TransactionDate__c', type: 'date'},
            {label: 'Post Date', fieldName: 'FinServ__PostDate__c', type: 'date'},
            {label: 'Description', fieldName: 'FinServ__Description__c', type: 'text'},
            {label: 'Amount', fieldName: 'FinServ__Amount__c', type: 'currency', typeAttributes: { currencyCode: 'USD'}},
            {label: 'Transaction Id', fieldName: 'FinServ__TransactionId__c', type: 'text'},
            {label: 'Promo Id', fieldName: 'Promo_ID__c', type: 'text'},
            //{label: 'Dispute', type:'button', title:'Dispute'},
            { type: 'action', typeAttributes: { rowActions: [{ label: 'Edit', name: 'edit' }, { label: 'Dispute', name: 'dispute' }, { label: 'Credit', name: 'credit' }, { label: 'View PDF', name: 'viewpdf' }, { label: 'View Statement', name: 'viewstatement' } ] }}
        ]);
        
        /*  Name, Disputed__c, OwnerId , FinServ__Amount__c,FinServ__BillingStatements__c,FinServ__CardAccountID__c,FinServ__Description__c,FinServ__FinancialAccount__c,
                FinServ__MerchantCategoryCode__c,FinServ__PostDate__c,FinServ__RunningBalance__c,FinServ__SourceSystemId__c,FinServ__SourceTransactionType__c,
                FinServ__TransactionDate__c,FinServ__TransactionId__c,FinServ__TransactionStatus__c,FinServ__TransactionSubtype__c,FinServ__TransactionType__c, Promo_ID__c 
        */
        helper.fireApex( arguments, "c.getRecs", {recId : component.get("v.recordId") },  (object) => helper.cont(arguments, object) )
        
    },
    toggleSection : function(component, event, helper) {
        console.log('toggle');
        var iconName = component.get("v.filterIconName");
        
        if (iconName == 'utility:chevronright') {
            component.set("v.toggleClass", "slds-is-open")
            component.set("v.filterIconName", "utility:switch");
        }
        else {
            component.set("v.toggleClass", "slds-is-close")
            component.set("v.filterIconName", "utility:chevronright");
        }
    },
    action : function(component, event, helper){
        console.log('here')
        var action = event.getParam('action');
        var row = event.getParam('row');
        var inputVariables = [
            { 
                name : "transaction", 
                type : "SObject", 
                value: row 
            }
        ];
        
        /*{
            FinServ__Description__c : row.FinServ__Description__c,
            FinServ__TransactionDate__c : row.FinServ__TransactionDate__c,
            FinServ__Amount__c : row.FinServ__Amount__c,
            FinServ__TransactionSubtype__c : row.FinServ__TransactionSubtype__c
        }*/
        
        if(action.name == 'dispute'){
            helper.toggleClass( arguments, "modal",  "slds-fade-in-open");
            helper.toggleClass( arguments, "backdrop",  "slds-backdrop_open");
            component.set("v.flowType",  'Dispute: ' + row.Name )
            
            // Find the component whose aura:id is "flowData"
            var flow = component.find("flowData");
            // In that component, start your flow. Reference the flow's Unique Name.
            flow.startFlow("Transaction_Dispute");
            
        }
        /*else if(action.name == 'payment'){
            helper.toggleClass( arguments, "modal",  "slds-fade-in-open");
        	helper.toggleClass( arguments, "backdrop",  "slds-backdrop_open");
            component.set("v.flowType",  'Payment Dispute: ' + row.Name )
            
            // Find the component whose aura:id is "flowData"
            var flow = component.find("flowData");
            // In that component, start your flow. Reference the flow's Unique Name.
            flow.startFlow("Payment_Dispute_Procss");
            
        }*/  
    },
    butt : function(component, event, helper){        
        helper.toggleClass( arguments, "modal",  "slds-fade-in-open");
        helper.toggleClass( arguments, "backdrop",  "slds-backdrop_open");
        component.set("v.flowType",  'Dispute Transactions'  )
        
        
    },
    
    toggleModal : function(component, event, helper) {
        helper.toggleClass( arguments, "modal",  "slds-fade-in-open");
        helper.toggleClass( arguments, "backdrop",  "slds-backdrop_open");
        try{
            component.find('flowData').destroy();
            helper.createComponent( arguments, "lightning:flow", { 'aura:id' : 'flowData', 'onstatuschange' : component.getReference("c.flowStatus")}, 'v.container');
        }
        catch(e){
            console.log(e);
        }},
    flowStatus : function(component, event, helper){
        if(event.getParam("status") === "FINISHED") {
            
            let toast = $A.get("e.force:showToast");
            toast.setParams({
                "title": "Submitted",
                "message": "Your Dispute been successfully submitted",
                "type": "success"
            });
            toast.fire();
            
            var rows = component.find('table').getSelectedRows(); 
            rows.forEach(function(el){
                el.Disputed__c = true;
            })
            helper.fireApex( arguments, "c.updateRows", {recId : component.get("v.recordId"), rows : rows },  (object) => helper.cont(arguments, object) )
            helper.toggleClass( arguments, "modal",  "slds-fade-in-open");
            helper.toggleClass( arguments, "backdrop",  "slds-backdrop_open");
            
            component.find('flowData').destroy();
            
            helper.createComponent( arguments, "lightning:flow", { 'aura:id' : 'flowData', 'onstatuschange' : component.getReference("c.flowStatus")}, 'v.container');
        }
    },
    ammountChange : function(component, event, helper){
        
        var timeoutId = component.get("v.timdoutId")
        
        if(timeoutId){
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout($A.getCallback(function() {
            console.log('amount');
            
            var recs = component.get("v.trans");
            var amountTo = component.get("v.amountTo");
            var amountFrom = component.get("v.amountFrom");
            var output = [];
            
            if(amountTo == null || amountTo == undefined || amountTo == ''){
                component.set("v.filtered", recs  )
            }
            else{
                recs.forEach(function(el){
                    if((amountFrom <= (el.FinServ__Amount__c)) && (amountTo >= (el.FinServ__Amount__c)) ){
                        output.push(el) 
                    }  
                })
                component.set("v.filtered", output  )
            }
        }),
                               300
                              )
        component.set("v.timeoutId", timeoutId  )    
    }
})
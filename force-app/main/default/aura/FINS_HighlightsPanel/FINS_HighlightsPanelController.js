({
    doInit: function(cmp, event, helper){
        //console.log('Highlights doInit');
        
        var spinner = cmp.find("highlightsSpinner");
        
        var accountRecord = "";
        var transactionRecord = "";
        
        var action = cmp.get("c.getAccountQ");
        action.setParams({
            "accountId" : cmp.get("v.recordId")
        });
        
        action.setCallback(this, function(response){
            var state = response.getState();
            //console.log('action state', state);
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                cmp.set("v.accDetails", data);
                accountRecord = data;
            }
        });

        var action2 = cmp.get("c.lastTransactionQ");    
        action2.setParams({
            "accountId" : cmp.get("v.recordId")
        });
        
        action2.setCallback(this, function(response){

    		$A.util.toggleClass(spinner, "slds-hide");
            
            var state2 = response.getState();
            //console.log('action2 state', state2);
            if (state2 === "SUCCESS") {
                var data2 = response.getReturnValue();
                //console.log("data2", data2);
                cmp.set("v.accTransaction", data2);
                console.log('data2',data2);
                transactionRecord = data2;
                // setTimeout(helper.applyStyles(cmp, accountRecord, transactionRecord));
                //if(data2 != null) {
                    helper.applyStyles(cmp, accountRecord, transactionRecord);
                //}
                    
                
            }
        });
        
        
        var action3 = cmp.get("c.getSocialPersona");
        action3.setParams({
            "accountId" : cmp.get("v.recordId")
        });
        
        action3.setCallback(this, function(response){
            var state = response.getState();
            //console.log('action state', state);
            if (state === "SUCCESS") {
                var data = response.getReturnValue();
                cmp.set("v.socialPersona", data);
            }
        });
        
        $A.enqueueAction(action);
        $A.enqueueAction(action2);
        $A.enqueueAction(action3);
    }
})
({
	searchHelper : function(component,event,getInputkeyWord) {
        
        if(component.get("v.objectAPIName") == 'Interaction'){
            // call the apex class method 
            var action = component.get("c.fetchInteractionSummary");
            // set param to method  
            // 
            // 
            action.setParams({
                searchKeyWord: getInputkeyWord,
                ObjectName: component.get("v.objectAPIName"),
                AccountId: component.get("v.AccountId")
            });
            
            console.log("AccountId: " + component.get("v.AccountId"));
            // set a callBack    
            action.setCallback(this, function(response) {
                $A.util.removeClass(component.find("mySpinner"), "slds-show");
                var state = response.getState();
                if (state === "SUCCESS") {
                    var storeResponse = response.getReturnValue();
                    // if storeResponse size is equal 0 ,display No Result Found... message on screen.                }
                    if (storeResponse.length == 0) {
                        component.set("v.Message", 'No Result Found...');
                        
                    } else {
                        component.set("v.Message", '');
                        console.log("Results: " + storeResponse);
                    }
                    // set searchResult list with return value from server.
                    component.set("v.listOfSearchRecords", storeResponse);
                }
                
            });
            // enqueue the Action  
            $A.enqueueAction(action);
        }else{
            // call the apex class method 
            var action = component.get("c.fetchLookUpValues");
            // set param to method  
            // 
            action.setParams({
                searchKeyWord: getInputkeyWord,
                ObjectName: component.get("v.objectAPIName")
            });
            // set a callBack    
            action.setCallback(this, function(response) {
                $A.util.removeClass(component.find("mySpinner"), "slds-show");
                var state = response.getState();
                if (state === "SUCCESS") {
                    var storeResponse = response.getReturnValue();
                    // if storeResponse size is equal 0 ,display No Result Found... message on screen.                }
                    if (storeResponse.length == 0) {
                        component.set("v.Message", 'No Result Found...');
                        
                    } else {
                        component.set("v.Message", '');
                        console.log("Results: " + storeResponse);
                    }
                    // set searchResult list with return value from server.
                    component.set("v.listOfSearchRecords", storeResponse);
                }
                
            });
            // enqueue the Action  
            $A.enqueueAction(action);
        }
        
        
    },
})
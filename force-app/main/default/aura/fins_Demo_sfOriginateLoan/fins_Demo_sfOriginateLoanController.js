({
    myAction : function(component, event, helper) {
        console.log(component.get("v.recordId"));
        
        var action = component.get("c.createLoanFromOpp");
        action.setParams({
            idd:component.get('v.recordId')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log('success ',response.getReturnValue());
                
                var redirect = $A.get("e.force:navigateToSObject");
                redirect.setParams({
                    "recordId": response.getReturnValue().Id
                });
                component.set('v.checker',false)
                $A.get("e.force:closeQuickAction").fire()
                redirect.fire();
                
            }
            else{
                console.log('failed'+JSON.stringify(response.getError()));
            }
        });
        $A.enqueueAction(action);
        
    }
})
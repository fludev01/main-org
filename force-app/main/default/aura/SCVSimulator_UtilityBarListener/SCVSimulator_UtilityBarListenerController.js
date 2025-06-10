({
    onStatusChanged : function(component, event, helper) {
        var statusApiName = event.getParam('statusApiName');
        if(statusApiName == 'Phone_Available_Demo'){ 
            
            var action = component.get("c.routeWork");
           
            action.setCallback(this, function(response) {
                var state = response.getState();
    
            });   
            
            $A.enqueueAction(action); 
           
        }
    }
})
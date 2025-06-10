({
	doInit : function(component, event, helper) {
        
         var action = component.get("c.getRec");
        action.setParams({
            "recordId" : component.get('v.recordId'),
            "reqField" : component.get('v.childRecordId'),
            "objApiName" : component.get('v.sObjectName') 

        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //alert("From server: " + response.getReturnValue());
                component.set('v.recValue', response.getReturnValue());
                if(component.get('v.recValue') != '')
                {
				     helper.getRecordDet(component);                    
                }
                console.log("AAAA-----"+ response.getReturnValue());
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);

        
       // var val="v.parentRecord."+component.get("v.childRecord");
       
	},
    
})
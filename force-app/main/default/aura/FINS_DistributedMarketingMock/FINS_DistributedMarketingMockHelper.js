({
	getrecinfo : function(component, event, helper) {
		var recid = component.get('v.recordId');
        if(recid != ''){
            console.log("Called");
           	var callout = component.get("c.getRecordInfo");
            callout.setParams({
                recid: recid
            });
            callout.setCallback(this, function(response) {
                if (response.getState() == "SUCCESS") {
                    console.log('Record Name: ' + response.getReturnValue());
                    component.set("v.RecordValue",response.getReturnValue()); 
                }else{
                    console.log("Error on call out")
                }
            });
            $A.enqueueAction(callout);
        }
	}
})
({
	clickJourney1 : function(component, event, helper) {
		var buttonText = component.get("v.Journey1ButtonText");
        var buttonIcon = component.get("v.Journey1ButtonIcon");
        
        if(buttonText == 'Stop'){
            component.set("v.Journey1ButtonText",'Start');
            component.set("v.Journey1ButtonIcon",'utility:play');
        }else{
            component.set("v.Journey1ButtonText",'Stop');
            component.set("v.Journey1ButtonIcon",'utility:stop');
        }
        
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Success!",
            "message": "Successfully changed the Journey Status.",
            "type ": "Success"
        });
        toastEvent.fire();
	},
    clickJourney2 : function(component, event, helper) {
		var buttonText = component.get("v.Journey2ButtonText");
        var buttonIcon = component.get("v.Journey2ButtonIcon");
        
        if(buttonText == 'Stop'){
            component.set("v.Journey2ButtonText",'Start');
            component.set("v.Journey2ButtonIcon",'utility:play');
        }else{
            component.set("v.Journey2ButtonText",'Stop');
            component.set("v.Journey2ButtonIcon",'utility:stop');
        }
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Success!",
            "message": "Successfully changed the Journey Status.",
            "type ": "Success"
        });
        toastEvent.fire();
	}
})
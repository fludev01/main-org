({
    doInit : function(component, event, helper) {
        var availableActions = component.get('v.availableActions');
        for (var i = 0; i < availableActions.length; i++) {
            if (availableActions[i] == "PAUSE") {
                component.set("v.canPause", true);
            } else if (availableActions[i] == "BACK") {
                component.set("v.canBack", true);
            } else if (availableActions[i] == "NEXT") {
                component.set("v.canNext", true);
            } else if (availableActions[i] == "FINISH") {
                component.set("v.canFinish", true);
            }
        }
        
        var progressIndicator = component.find('progressIndicator');
        
        console.log('currentStage', component.get('v.currentStage'));
        console.log('stages', component.get('v.stages'));
        
        var thePrefix = '';
        if(component.get('v.currentStage').indexOf(':') >=0){
            thePrefix = component.get('v.currentStage').split(':')[0];
        }
        
        //console.log('thePrefix', thePrefix);
        
        for (let step of component.get('v.stages')) {
            
            if(thePrefix != ''){
                //console.log('step', step);
                var theNewStep = step.split(' ').join('_');
                //console.log('theNewStep', theNewStep);
                theNewStep = thePrefix + ':' + theNewStep;
            }
            else{
                theNewStep = step;
            }
            
            $A.createComponent(
                "lightning:progressStep",
                {
                    "aura:id": "step_" + step,
                    "label": step,
                    "value": theNewStep
                },
                function(newProgressStep, status, errorMessage){
                    // Add the new step to the progress array
                    if (status === "SUCCESS") {
                        var body = progressIndicator.get("v.body");
                        body.push(newProgressStep);
                        progressIndicator.set("v.body", body);
                    }
                    else if (status === "INCOMPLETE") {
                        // Show offline error
                        console.log("No response from server, or client is offline.")
                    }
                        else if (status === "ERROR") {
                            // Show error message
                            console.log("Error: " + errorMessage);
                        }
                }
            );
        }
        
        
    },
    
    onButtonPressed : function(component, event, helper) {
        var actionClicked = event.getSource().getLocalId();
        var navigate = component.get('v.navigateFlow');
        navigate(actionClicked);
    },
    
    navigateToSObj : function(component, event, helper) {
        console.log('navigateToSObj');
        
        var theId = component.get('v.navToId');
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": theId,
            "slideDevName": "detail"
        });
        navEvt.fire();
    }
})
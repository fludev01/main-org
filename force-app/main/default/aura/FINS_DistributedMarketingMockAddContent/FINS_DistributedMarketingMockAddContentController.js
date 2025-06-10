({
    init : function(component, event, helper) {
        
	},
    updateShowContent1 : function(component, event, helper) {
        component.set("v.ShowContent1",true);
	},
    onPicklistChange: function(component, event, helper) {
        component.set("v.selectedIndustry",event.getSource().get("v.value"));
        component.set("v.IndustrySelected",true);
    },
    onContentChange: function(component, event, helper) {
        component.set("v.selectedContent",event.getSource().get("v.value"));
    },
    removeContent: function(component, event, helper) {
        component.set("v.selectedContent",'');
    },
    templateSelection: function(component, event, helper) {
        console.log("test");
		var action = component.get("c.getContent");
        action.setParams({
            template: component.get("v.SelectedTemplate")
        });
		action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
            	console.log(response.getReturnValue())
            	component.set("v.Content",response.getReturnValue());
            }else{
                console.log("Error");
            }
        });
        $A.enqueueAction(action);
    },
})
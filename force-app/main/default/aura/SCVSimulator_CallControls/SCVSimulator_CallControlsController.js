({
    init : function(component, event, helper) {   
        var interval = window.setInterval(function () {
            var seconds = component.get("v.seconds");
            var minutes = component.get("v.minutes");
            seconds++;
            if (seconds == 60) {
                seconds = 0;
                minutes++;
            }
            component.set("v.seconds", seconds);
            component.set("v.minutes", minutes); 
        }, 1000);
        
        component.set("v.setIntervalId", interval);   
        
    },
    
    endCall : function(component, event, helper){
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            //workspaceAPI.closeTab({tabId: focusedTabId});
            
            window.clearInterval(component.get("v.setIntervalId"));
            
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "Success!",
                "message": "The call transcript has been successfully captured.",
                "type": "success"
            });
            toastEvent.fire();
            
        })
        .catch(function(error) {
            console.log(error);
        });
        
    }
    
})
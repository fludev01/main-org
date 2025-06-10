({
    onInit : function(component, event, helper){
        var navService = component.find("navService");
        var pageReference = {
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Inside_View_Tab'
            }
        };
        component.set("v.pageReference", pageReference);
        var defaultUrl = "#";

        navService.generateUrl(pageReference).then($A.getCallback(function(url){
                component.set("v.url", url ? url : defaultUrl);
        }),
        $A.getCallback(function(error){
            component.set("v.url", defaultUrl);
        }));
    },
    
    navigateToApp : function(component, event, helper){
        var workspaceAPI = component.find("workspace");
        workspaceAPI.isConsoleNavigation().then(function(response){
            console.log(response);
            if(response){
               helper.navigateToAppSubTab(component, event, helper);
               //helper.setTabLabel(component, event, helper);
            }
            else{
                helper.navigateToAppWindow(component, event, helper);
            }
        })
        .catch(function(error) {
            console.log(error);
        });
    }
})
({
    navigateToAppSubTab : function(component, event, helper){
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response){
            if(response.tabId){
                workspaceAPI.openSubtab({
                    parentTabId: response.tabId,
                    url: component.get("v.url"),
                    focus: true
                });
            }
            else{
                helper.navigateToAppTab(component, event, helper);
            }
        })
        .catch(function(error) {
            console.log(error);
        });
    },

    navigateToAppTab : function(component, event, helper){
        console.log('rabble rabble rabble');
        var workspaceAPI = component.find("workspace");
        workspaceAPI.openTab({
            pageReference: component.get("v.pageReference"),
            focus: true
        }).then(function(response){
            /*
            workspaceAPI.setTabLabel({
                tabId: response,
                label: "Inside View"
            });
            */
            workspaceAPI.getTabInfo({
                tabId: response
        }).then(function(tabInfo){
            console.log("The recordId for this tab is: " + tabInfo.recordId);
        });
        }).catch(function(error) {
            console.log(error);
        });
    },

    navigateToAppWindow : function(component, event, helper){
        window.open(component.get("v.url"), '_blank');
    },

    setTabLabel : function(component, event, helper){
        console.log('test test');
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response){
            console.log('Response: ' + JSON.stringify(response))
            workspaceAPI.setTabLabel({
                tabId: response.tabId,
                label: "Inside View"
            });
        })
        .catch(function(error) {
            console.log(error);
        });
    }
})
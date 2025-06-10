({
	getRecordDet : function(component) {
        var parentUrl='/lightning/r/'+component.get("v.sObjectName")+'/'+component.get("v.recordId")+'/view';
        console.log("parent url ----"+parentUrl);
        var childUrl='/lightning/r/'+component.get("v.childObject")+'/'+component.get("v.recValue")+'/view';
        console.log("Child url ----"+childUrl);
		var workspaceAPI = component.find("workspace");
        workspaceAPI.openTab({
            url: parentUrl,
            focus: true
        }).then(function(response) {
            workspaceAPI.openSubtab({
                parentTabId: response,
                url: childUrl,
                focus: false
            });
        })
        .catch(function(error) {
            console.log(error);
        });
	}
})
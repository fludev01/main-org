({
	doInit : function(cmp, event, helper) {
		//cmp.set("v.iframeUrl","https://powerforms-d.docusign.net/e649177c-7b2e-4d2c-a82f-97fbcce7c3de?env=demo&acct=b8fe5ad5-e79b-4499-b262-95d242f6f96d");
	},
     handleClick: function(component, event, helper) {
        var navigate = component.get("v.navigateFlow");
            navigate("NEXT");
	}
})
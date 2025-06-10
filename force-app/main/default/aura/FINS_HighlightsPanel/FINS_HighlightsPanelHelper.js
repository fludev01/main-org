({
	applyStyles : function(component, data, transaction) {
        
		console.log("Inside apply styles helper ", );

        // Check categories and apply appropriate bg color
        //var category = $("#categoryIconContainer span");
        var category = component.find('categoryIconContainer');
        /*switch (data.FinServ__ClientCategory__c) {
            case "Platinum":
                $(category.children[0]).css("background-color", "#e5e4e2");
                break;
            case "Gold":
                $(category.children[0]).css("background-color", "#ffd700");
                break;
            case "Silver":
                $(category.children[0]).css("background-color", "#c0c0c0");
                break;
            case "Bronze":
                $(category.children[0]).css("background-color", "#cd7f32");
                break;
        };*/
        
        // Check status and apply appropriate icon
         var status = $("#statusIconContainer span");
        //var status = component.find('statusIconContainer').getElement();
        switch (data.FinServ__Status__c) {
            case "Prospect":
                component.set("v.currentStatus", "custom39");
                break;
            case "Onboarding":
                component.set("v.currentStatus", "custom13");
                break;
            case "Active":
                component.set("v.currentStatus", "custom14");
                break;
            case "Deceased":
                component.set("v.currentStatus", "custom86");
                break;
            case "Inactive":
                component.set("v.currentStatus", "custom7");
                break;
        };
        
        // Check segments and apply appropriate icon and color
         var segment = $("#segmentIconContainer span");
        //var segment = component.find('segmentIconContainer').getElement();
        switch (data.FinServ__MarketingSegment__c) {
            case "Mass Affluent":
                segment.css("background-color", "#acd360");
                component.set("v.currentSegment", "custom17");
                break;
            case "High Net Worth":
                segment.css("background-color", "#89c059");
                component.set("v.currentSegment", "custom17");
                break;
            case "Female Investor":
                segment.css("background-color", "#ff7b84");
                component.set("v.currentSegment", "custom17");
                break;
            case "Millennial":
                segment.css("background-color", "#6488e3");
                component.set("v.currentSegment", "custom15");
                break;
        };
        
        //Check last transaction type and update icon bg
        var transactionType = $("#transactionIconContainer span");
        var transaction = component.get("v.accTransaction");
        console.log('transaction',transaction);
        
        if(transaction) {
            var transactionStatus = transaction.FinServ__TransactionStatus__c;
            switch (transaction.FinServ__TransactionType__c) {
                    case "Deposit Balance":
                        // transactionType.css("padding", "0.2em");
                        // $("#transactionIconContainer span span svg use").css("fill", "white");
                        component.set("v.currentTransaction", "custom:custom17");
                        break;
                    case "ATM Deposit":
                        component.set("v.currentTransaction", "custom:custom16");
                        break;
                    case "Online Transfer":
                        component.set("v.currentTransaction", "custom:custom27");
                        break;
                    case "Credit Card Payment":
                        component.set("v.currentTransaction", "custom:custom45");
                        break;
                    default:
                        component.set("v.currentTransaction", "custom:custom41");
                        break;
            };
            if (transactionStatus == "Cleared") {
               transactionType.css("background-color", "#4CAF50");
            } else if (transactionStatus == "Processing") {
                transactionType.css("background-color", "#FFEB3B");
            } else {
                transactionType.css("background-color", "#43b5b5");
            }
        }
        else {
            component.set("v.currentTransaction", "custom:custom41");
            transactionType.css("background-color", "#43b5b5");
        }
        
        

        var spinner = component.find("highlightsSpinner");
    	$A.util.toggleClass(spinner, "slds-hide");
	}

    
})
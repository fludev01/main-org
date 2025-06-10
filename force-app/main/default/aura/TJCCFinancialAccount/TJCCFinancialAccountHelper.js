/*
Call these methods in the component controller by passing in the keyword 'arguments'
as the first parameter this passes [controller, event, helper] to the helper method

example: helper.goToUrl(arguments, "https://google.com")


Signatures:

goToUrl(Keyword arguments, String url)
goToSObject(Keyword arguments, String objectId, Boolean isRedirect [optional, default false])
toggleClass(Keyword arguments, String auraId, String ClassName)
addClass(Keyword arguments, String auraId, String ClassName)
removeClass(Keyword arguments, String auraId, String ClassName)
createComponent(Keyword arguments, String componentName w/ namespace, Object attributes, String location [optional, default "v.body"])
appendComponent(Keyword arguments, String componentName w/ namespace, Object attributes, String location [optional, default "v.body"])

fireApex(Keyword arguments, String ApexFunctionName w/ namespace, Object params, Function callback [receives return value] or String attributeName [sets this attr to return value])
helper.fireApex(arguments,"c.getAccounts", {}, "v.accountProducts")

fireEvent(Keyword arguments, String eventName, Object params[optional, sets event payload])
addEventHandler(Keyword arguments, String eventName, String actionName)

*/

({
    goToUrl : function(args, url) {
        let [component, event, helper] = args
        var urlEvent = $A.get("e.force:navigateToURL");
        if(urlEvent){
        urlEvent.setParams({
            "url": url
        });
        urlEvent.fire();
        }else{
            window.location.href = url  
        }
        
    },

	cont : function(args , object){
		let [component, event, helper] = args
        
        component.set("v.trans", object  )
        component.set("v.filtered", object  )
		
	},
    
    navigateToSObject: function(
		recordId,
		objectApiName,
		type,
		actionName
	) {
		type = type || 'standard__recordPage'
		actionName = actionName || 'view'
		$A.createComponent(
			'lightning:navigation',
			{},
			(newCmp, status, errorMessage) => {
				if (status === 'SUCCESS') {
					let pageRef = {
						type,
						attributes: {
							recordId,
							objectApiName,
							actionName
						}
					}
					newCmp.navigate(pageRef)
				} else if (status === 'INCOMPLETE') {
					console.log('No response from server or client is offline.')
				} else if (status === 'ERROR') {
					console.log('Error: ', errorMessage)
				}
			}
		)
	},
    
    toggleClass : function(args, auraId, className){
        let [component, event, helper] = args
        let el = component.find(auraId)
        if(el.length){
            el.forEach(e => $A.util.toggleClass(e, className))
        }else{
            $A.util.toggleClass(el, className)            
        }
    },
    
    addClass : function(args, auraId, className){
        let [component, event, helper] = args
        let el = component.find(auraId)
        if(el.length){
            el.forEach(e => $A.util.addClass(e, className))
        }else{
            $A.util.addClass(el, className)            
        }

    },
    
    removeClass : function(args, auraId, className){
        let [component, event, helper] = args
        let el = component.find(auraId)
        if(el.length){
            el.forEach(e => $A.util.removeClass(e, className))
        }else{
            $A.util.removeClass(el, className)            
        }
    },
    
    createComponent : function(args, compName, attributes, location, append){
        
        let [component, event, helper] = args
        location = location || "v.body"
        $A.createComponent(
            compName,
            attributes,
            function(newCmp, status, errorMessage){
                
                //Add the new button to the body array
                if (status === "SUCCESS") {
                    if(append){
                        var body = component.get(location);
                        body.push(newCmp);
                        component.set(location, body);
                    }else{
                        component.set(location, newCmp);  
                    }
                }
                else if (status === "INCOMPLETE") {
                    console.log("No response from server or client is offline.")
                    // Show offline error
                }
                    else if (status === "ERROR") {
                        console.log("Error: " + errorMessage);
                        // Show error message
                    }
            }
        );
    },
    
    appendComponent : function(args, compName, attributes, location){
        let [component, event, helper] = args
        helper.createComponent(args, compName, attributes, location, true)
    },
    
    fireApex : function(args, ApexFunctionName, params, option ){
        let [component, event, helper] = args
        let action = component.get(ApexFunctionName);
        action.setParams(params)
        action.setCallback(this, function(a) {
            if(a.getState() === 'ERROR'){
                console.log("There was an error:")
                console.log(a.getError())
            } else if (a.getState() === 'SUCCESS'){
                if(typeof option === "string"){
                    component.set(option, a.getReturnValue())
                }else{
                    option(a.getReturnValue())
                }
                console.log(a.getReturnValue())	
            }
            
        })
        $A.enqueueAction(action);
    },
    
    fireEvent : function(args, eventName, params){
        let [component, event, helper] = args
        var compEvent = component.getEvent(eventName);
        compEvent.setParams(params);
        compEvent.fire();
    },
    
    addEventHandler : function(args, eventName, actionName) {
        let [component, event, helper] = args
        component.addHandler(eventName, component, actionName);
    }
    
    
})
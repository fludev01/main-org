({
    //Component Name: WelcomeProfile
    //Author : Raj Rao, Principal Solution Engineer, Salesforce.com
    //Date Released : March 25, 2016
    doInit: function(component, event, helper) {
		helper.loadUser(component,null)
    },
})
({
	handleClick : function(component, event, helper) {
        component.set("v.openmodel",true);
    },
    closeModal:function(component,event,helper){    
        var cmpTarget = component.find('editDialog');
        var cmpBack = component.find('overlay');
        $A.util.removeClass(cmpBack,'slds-backdrop--open');
        $A.util.removeClass(cmpTarget, 'slds-fade-in-open');
        component.set('v.openmodel',false);
        
    },
    setTo1 : function(component, event, helper) {
        component.set("v.Path",1);
    },
    setTo2 : function(component, event, helper) {
        component.set("v.Path",2);
    },
    setTo3 : function(component, event, helper) {
        component.set("v.Path",3);
    }, 
    setTo4 : function(component, event, helper) {
        component.set("v.Path",4);
    },
})
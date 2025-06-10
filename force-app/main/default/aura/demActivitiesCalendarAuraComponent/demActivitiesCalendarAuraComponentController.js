({
	newTask: function(cmp, evt, helper){
        var defaultData = Object.assign({}, cmp.get('v.defaultData'));
        $A.get("e.force:createRecord").setParams({
            "entityApiName": "Task",
            "defaultFieldValues": Object.assign(defaultData, evt.getParam('defaultFieldValues')),
            "navigationLocation":"LOOKUP"
        }).fire();
	},
    newEvent: function(cmp, evt, helper){
        var defaultData = Object.assign({}, cmp.get('v.defaultData'));
        $A.get("e.force:createRecord").setParams({
            "entityApiName": "Event",
            "defaultFieldValues": Object.assign(defaultData, evt.getParam('defaultFieldValues')),
            "navigationLocation":"LOOKUP"
        }).fire();
	},
    doInit: function(cmp, evt, helper){
        const validObjects = ['Account', 'Contact', 'Opportunity'];
        cmp.set('v.dummy', (cmp.get('v.dummy') + 1));
        if (cmp.get('v.recordId')){
            helper.getObjectName(cmp, evt, helper, function(objectName){
                if (validObjects.indexOf(objectName) >= 0){
                    cmp.set('v.showForRecord', true);
                    helper.getDefaultWhoAndWhat(cmp, evt, helper);
                } else {
                    cmp.set('v.hasError', true);
                    cmp.set('v.errorMessage', 'This component is only for ' + validObjects.join(', ') + ' record page and Home.');
                }
            });
        } else {
            cmp.set('v.showForHome', true);
        }
    }
})
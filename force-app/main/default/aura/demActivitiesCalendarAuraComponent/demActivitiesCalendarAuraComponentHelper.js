({
	getObjectName: function(cmp, evt, helper, callback){
		var action = cmp.get("c.getObjectNameById");	
        action.setParams({
            recordId: cmp.get('v.recordId')
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (cmp.isValid() && state === "SUCCESS") {
                var ret = response.getReturnValue();
                if (ret){
                    callback(ret);
                }
            }
        });
        $A.enqueueAction(action); 
	},
    getDefaultWhoAndWhat: function(cmp, evt, helper){
        var action = cmp.get("c.getDefaults");	
        action.setParams({
            recordId: cmp.get('v.recordId')
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (cmp.isValid() && state === "SUCCESS") {
                var rets = response.getReturnValue();
                var whatId = rets[0];
                var whoId = rets[1];
                var defaultData = {};
                if (whatId) defaultData.WhatId = whatId;
                if (whoId) defaultData.WhoId = whoId;
                cmp.set('v.defaultData', defaultData);
            }
        });
        $A.enqueueAction(action);
    }
})
({
	 init : function(component, event, helper) {
         var now = new Date();
         var formattedDateTime = $A.localizationService.formatDate(now, "MM/dd/yyyy, hh:mm a");
         component.set('v.dateTime', formattedDateTime);
     }
})
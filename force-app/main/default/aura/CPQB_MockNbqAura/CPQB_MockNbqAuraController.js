({
  handleQleNav: function(component, event) {
    var quoteId = event.getParam("quoteId");
    var urlEvent = $A.get("e.force:navigateToURL");
    urlEvent.setParams({
      url: "/apex/sbqq__sb?scontrolCaching=1&id=" + quoteId
    });
    urlEvent.fire();
  }
});
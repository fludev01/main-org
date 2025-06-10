({
	init : function(component, event, helper) {
		let appState = {
            messages: [],
            messagesToShow: [],
            stage: 1
        };
        let conversationStartedMessage = {
            Message_Type__c: 'Conversation Started',
            time: new Date().toISOString()
        }
        appState.messages.push(conversationStartedMessage);
        appState.messagesToShow.push(conversationStartedMessage);
       
        helper.fetchConversationData(component, event, helper, appState);
	}
})
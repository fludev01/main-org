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
       
        window.addEventListener('keydown', function(e){
            if(e.key == 'ArrowRight'){
                helper.handleKeyPress(component, event, helper, 'right');
            } else if(e.key == 'ArrowLeft'){
                helper.handleKeyPress(component, event, helper, 'left');
            } else if(e.key == 'ArrowDown'){
                helper.handleKeyPress(component, event, helper, 'down');
            }
        });
        
        let conversationId = component.get('v.conversation');
        helper.fetchConversationData(component, event, helper, conversationId, appState);
       
    }
})
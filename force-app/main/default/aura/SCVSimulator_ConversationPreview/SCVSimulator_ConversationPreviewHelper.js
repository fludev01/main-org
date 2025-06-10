({
    handleKeyPress : function(component, event, helper, typeOfChange) {
        
        const currentStage = component.get('v.state').stage;
        const newAppState = component.get('v.state');
        
        let newStage = 0;
        
        // If right arrow is pressed, move conversation forward. If left arrow, move convo back.
        // If down arrow is pressed, reset the conversation.
        if(typeOfChange == 'right'){
            newStage = currentStage+1;
            newAppState.stage = newStage;
        } else if(typeOfChange == 'left'){
            newStage = currentStage > 0 ? currentStage-1 : currentStage;
            newAppState.stage = newStage;
        } else if(typeOfChange == 'down'){
            newStage = 0;
            newAppState.stage = newStage;
        }
        
        const action = component.get('c.publishPlatformEvent');   
        action.setParams({
            newStage: newStage
        });
        
        action.setCallback(this, function(response){
            var state = response.getState();
            var res = response.getReturnValue();    
        });
        
        $A.enqueueAction(action); 
        
        // this doesn't wait for platform event return - otherwise it takes a few seconds to publish the changes
        this.handleStageChange(component, event, helper, newStage, newAppState);  
        
    },
    
    
    handleStageChange: function(component, event, helper, newStage, appState){  
        let newAppState = appState;
        let numOfNewMessages;
        
        // check to see if there is a stage available for the aligned stage; if not, push all messages
        // this should be updated to not allow stages to be set past what the conversation allows
        if(newStage < newAppState.messageMapping.length){
            numOfNewMessages = newAppState.messageMapping[newAppState.stage];
        } else {
            numOfNewMessages = newAppState.messages.length;
        }
        
        let messagesToShow = [];
        
        for(let i = 0; i < numOfNewMessages; i++){
            //Only add current timestamp to messages with a null time value, so you don't overwrite old messages
            if (newAppState.messages[i].time === null || newAppState.messages[i].time === ''){
                newAppState.messages[i].time = new Date().toISOString();
                console.log('Message with new timestamp:',JSON.parse(JSON.stringify(newAppState.messages[i])))
            }
            messagesToShow.push(newAppState.messages[i]);
        }
        
        newAppState.messagesToShow = messagesToShow;     
        console.log('newAppState', JSON.parse(JSON.stringify(newAppState)));
        
        component.set('v.state', newAppState);
        $A.get('e.force:refreshView').fire();
    },
    
    
    fetchConversationData: function(component, event, helper, appState){
        console.log('appState',appState);
        var action = component.get("c.fetchConversation");
        
        
        action.setParams({ 
            conversationId : component.get('v.recordId'),
            voiceCallRecordId : component.get('v.recordId')
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            var convo = response.getReturnValue();
            
            if (state === "SUCCESS") { 
             
                //push messages into state
                for(let i = 0; i < convo.messages.length; i++){
                                 
                    // Process scv_message record to format data for front end
                    let tempMessage = convo.messages[i];
                    
                    // assign null timestamps to be tacked on at time of keypress
                    tempMessage.time = new Date().toISOString();
                    
                    appState.messages.push(tempMessage);
                    
                    // if the last message, tack on the 'conversation ended' message & Assign null timestamp
                    if(i == convo.messages.length-1){
                        if(i != 0){
                            let tempNextMessage = convo.messages[i+1];     
                            appState.messages.push({
                                Message_Type__c: 'Conversation Ended',
                                time: new Date().toISOString()
                            });
                        }     
                    }   
                }
                
                // push messages one at a time into the conversation
                let messageMapping = [0];
                
                for(let x = 1; x <= convo.messages.length+1; x++){
                    messageMapping.push(x);    
                }
                
                appState.messageMapping = messageMapping;
                component.set('v.state', appState);
                
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }      
            }
            
        });
        
        $A.enqueueAction(action);
        
    }
})
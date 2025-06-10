public class SCVSimulator_CT {
    
    @AuraEnabled
    public static void publishPlatformEvent(Decimal newStage) {
        SCVSimulator_ConversationChange__e  conversationPlatformEvt = new SCVSimulator_ConversationChange__e();
        conversationPlatformEvt.Stage__c = newStage;
        EventBus.publish(conversationPlatformEvt);
    }
	
    @AuraEnabled
    public static SCVSimulator_ConversationWrapper fetchConversation(String conversationId, String voiceCallRecordId){
        return new SCVSimulator_ConversationWrapper(conversationId, voiceCallRecordId);
    }
    
    public class SCVSimulator_ConversationWrapper {
        @AuraEnabled public SCVSimulator_Conversation__c conversation {get; set;}
        @AuraEnabled public List<SCVSimulator_Conversation_Message__c> messages {get; set;}
        
        public SCVSimulator_ConversationWrapper(String conversationId, String voiceCallRecordId) {
            
            this.conversation = [SELECT Id FROM SCVSimulator_Conversation__c WHERE Id = :conversationId LIMIT 1];
            
            this.messages = [SELECT Id, SCVSimulator_Conversation__c, Message__c, Conversation_Order__c, Message_Type__c
                             FROM SCVSimulator_Conversation_Message__c 
                             WHERE SCVSimulator_Conversation__c =:conversationId 
                             ORDER BY Conversation_Order__c, LastModifiedDate ASC];
        }
    }
    
    @AuraEnabled
    public static void routeWork() {
        
        VoiceCall workItem = [SELECT Id FROM VoiceCall WHERE OwnerId =:UserInfo.getUserId() ORDER BY CallStartDateTime desc LIMIT 1];
        ServiceChannel channel = [SELECT Id FROM ServiceChannel WHERE MasterLabel ='Phone'];
        
        AgentWork work = new AgentWork();
        work.WorkItemId = workItem.Id;
        work.ServiceChannelId = channel.Id;    
        work.UserId = UserInfo.getUserId();
        
        insert work;
   
    }

}
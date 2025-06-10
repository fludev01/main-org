global class SCVSimulator_ConversationPicklist extends VisualEditor.DynamicPickList{
    
    global override VisualEditor.DataRow getDefaultValue(){
        
        SCVSimulator_Conversation__c tempConversation = [SELECT Id, Name FROM SCVSimulator_Conversation__c LIMIT 1];
        if(tempConversation != null){
            VisualEditor.DataRow defaultValue = new VisualEditor.DataRow(tempConversation.Name, tempConversation.Id);
            return defaultValue;
        } else {
            return null;
        }
    }
    
    global override VisualEditor.DynamicPickListRows getValues() {
        
        VisualEditor.DynamicPickListRows  conversationOptions = new VisualEditor.DynamicPickListRows();
        List<SCVSimulator_Conversation__c> conversationList = [SELECT Id, Name FROM SCVSimulator_Conversation__c];
        
        for(integer i = 0; i < conversationList.size(); i++){
            conversationOptions.addRow(new VisualEditor.DataRow(conversationList[i].Name, 
                                                     ''+conversationList[i].Id));
        }
        
        return conversationOptions;
    }
}
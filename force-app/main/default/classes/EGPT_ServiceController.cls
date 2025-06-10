public without sharing class EGPT_ServiceController {

    @AuraEnabled(cacheable=true)
    public static List<ChatSuggestion__c> getSuggestionList() {
        try {
            return [
                SELECT Id, Keyword__c, Response__c, (SELECT Name FROM EinsteinDataSources__r)
                FROM ChatSuggestion__c];    
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static List<ChatResponse__c> getResponseList() {
        try {
            return [
                SELECT Id, Keyword__c, Response__c, TypingTime__c, MessageType__c, EndChat__c, Prompt__c, (SELECT Name, Variant__c, IconName__c, Order__c FROM Chat_Response_Actions__r ORDER BY Order__c)
                FROM ChatResponse__c];    
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static EGPTConfiguration__c getConfiguration(){
        try {
            return [
                SELECT ServiceStartingMessage__c, ServiceContactName__c, ServiceContactPhone__c, ServiceContactEmail__c, ServiceContactAvatar__c, ServiceContactInitials__c, ServiceUseAvatar__c, ServiceAgentName__c, ServiceKnowledgeArticleTitle__c, ServiceKnowledgeArticleContent__c, ServiceCaseSummary__c
                FROM EGPTConfiguration__c
               LIMIT 1];    
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static Case getCaseDetails(Id recordId){
        try {
            return [
                SELECT Id, Subject, Description
                FROM Case
                WHERE Id =: recordId];    
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


}
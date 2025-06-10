public class FINS_JH_fscAlertsCtrl {

   
    //Account focused to be remove once the rest of these are built
    @AuraEnabled
    public static List<FinServ__Alert__c> getAlerts(String parentId){
           return [Select Id, Name, FinServ__Severity__c
                from FinServ__Alert__c where FinServ__Account__c = :parentId]; 
    }
    
    //Contact focused
    @AuraEnabled
    public static List<FinServ__Alert__c> getContactAlerts(String parentId){
        return [Select Id, Name, FinServ__Severity__c, FinServ__Active__c, Score__c, FinServ__Priority__c, FinServ__Message__c, FinServ__MessageDescription__c
                from FinServ__Alert__c where Contact__c = :parentId];
    }
    
    //Opportunity focused
    @AuraEnabled
    public static List<FinServ__Alert__c> getOpportunityAlerts(String parentId){
        return [Select Id, Name, FinServ__Severity__c, FinServ__Active__c, Score__c, FinServ__Priority__c, FinServ__Message__c, FinServ__MessageDescription__c
                from FinServ__Alert__c where Opportunity__c = :parentId];
    }
    
    
    //Object* focused

}
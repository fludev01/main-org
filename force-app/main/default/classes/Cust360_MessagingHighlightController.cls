public class Cust360_MessagingHighlightController {

    @AuraEnabled
    public static Contact getContact (Id sessionId) {
        
        Contact c = [
            Select Name,Cust360_CSAT__c,Cust360_Metric1__c,Cust360_Metric2__c,Cust360_ChurnRisk__c,Cust360_Contact_Picture_URL__c,Cust360_Id__c,MailingCity,MailingState from Contact 
            where Id in (Select EndUserContactId from MessagingSession where Id = :sessionId)
        ];
        return c;
    }
    
}
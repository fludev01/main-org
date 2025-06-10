public with sharing class FINS_HighlightsCT {

    @AuraEnabled
    public static FinServ__FinancialAccountTransaction__c lastTransactionQ(String accountId) {
        //System.debug('lastTransactionQ');
        try{
            
            List<FinServ__FinancialAccountTransaction__c> transactions = [SELECT FinServ__Amount__c,FinServ__FinancialAccount__c,FinServ__TransactionDate__c,FinServ__TransactionId__c,FinServ__TransactionStatus__c,FinServ__TransactionType__c,Id,Name,Reason_for_Hold__c 
																			FROM FinServ__FinancialAccountTransaction__c WHERE FinServ__FinancialAccount__r.FinServ__PrimaryOwner__c = :accountId
                                                                         	ORDER BY FinServ__Amount__c DESC NULLS FIRST];
            //System.debug('transactions: ' + transactions);
            return transactions[0];
            
        } 
        catch(Exception ex){
            System.debug('{"error": "' + ex.getMessage() + '"}');
            return null;
        }
    }
    
    @AuraEnabled
    public static Account getAccountQ(String accountId) {
        //System.debug('getAccountQ');
        try{
            // return [SELECT Id, Name, Client_Type__c, FinServ__ClientCategory__c, FinServ__Status__c, Status_Icon__c, FinServ__MarketingSegment__c, Last_Transaction__c 
            return [SELECT Id, Name, FinServ__ClientCategory__c, FinServ__Status__c, FinServ__MarketingSegment__c 
                    FROM Account 
                    WHERE id=:accountId];
        } catch(Exception ex){
            System.debug('{"error": "' + ex.getMessage() + '"}');
            return null;
        }

    }
    /*
    @AuraEnabled
    public static Transactions__c lastTransaction() {
        Transactions__c trans=[select Id, Type__c, Status__c,Available_Balance__c, Transaction_Amount__c, Transaction_Date__c, Financial_Account_aa__c, Account_Holder__c from Transactions__c where Financial_Account_aa__c='a3yC000000132vHIAQ' order by Transaction_Date__c DESC LIMIT 1];
        // Perform isAccessible() check here 
        String str = '$' + trans.Transaction_Amount__c + ' ' + trans.Type__c + ' ' + '(' + trans.Status__c + ')'; 
        // update account object 
        Account accObj = [Select Id, Last_Transaction__c from Account where Name='Claire Adams'];
        accObj.Last_Transaction__c = str;
        try{
             update accObj;
        } catch (DMLException e) {
             System.debug(e.getMessage());
        }
        return trans;
    }
    */
    @AuraEnabled
    public static Account getAccount() {
        //Account acc = [Select Id, Name, Client_Type__c, FinServ__ClientCategory__c, FinServ__Status__c, Status_Icon__c, FinServ__MarketingSegment__c, Last_Transaction__c from Account where Name='Claire Adams'];
        Account acc = [Select Id, Name, FinServ__ClientCategory__c, FinServ__Status__c, FinServ__MarketingSegment__c,FINS_Last_Transaction__c  from Account where Name='Claire Adams'];
        // Perform isAccessible() check here 
        return acc;
    }
 
    
    @AuraEnabled
    public static SocialPersona getSocialPersona(String accountId) {
        SocialPersona sp = new SocialPersona();
        try{
            Account acc = [SELECT Id, Name, FinServ__PrimaryContact__c 
                            FROM Account 
                            WHERE id=:accountId];
            Contact con = [SELECT Id, Name 
                            FROM Contact 
                            WHERE id =: acc.FinServ__PrimaryContact__c];
            sp = [SELECT ExternalPictureURL,Id,Name,ParentId 
                  	FROM SocialPersona
                 WHERE ParentId =: acc.FinServ__PrimaryContact__c];
                
                return sp;
        }
        catch(Exception e){
            System.Debug('Error in getSocialPersona: ' + e.getMessage() );
            return null;
        }
    }

}
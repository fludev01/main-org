public class FINS_Teller_DisputeTransation {
    
    @AuraEnabled
    Public Static FinServ__FinancialAccountTransaction__c[] getRecs(String recId )
    {
        return [SELECT Id, Name, Disputed__c, OwnerId , FinServ__Amount__c,FinServ__BillingStatements__c,FinServ__CardAccountID__c,FinServ__Description__c,FinServ__FinancialAccount__c,
                FinServ__MerchantCategoryCode__c,FinServ__PostDate__c,FinServ__RunningBalance__c,FinServ__SourceSystemId__c,FinServ__SourceTransactionType__c,
                FinServ__TransactionDate__c,FinServ__TransactionId__c,FinServ__TransactionStatus__c,FinServ__TransactionSubtype__c,FinServ__TransactionType__c 
                FROM FinServ__FinancialAccountTransaction__c WHERE FinServ__FinancialAccount__c  = :recId ORDER BY FinServ__TransactionDate__c DESC];
    }
    
    @AuraEnabled
    Public Static FinServ__FinancialAccount__c[] getFARecs(String recId ) {
        return [SELECT FinServ__PrimaryOwner__c,Id,Name FROM FinServ__FinancialAccount__c WHERE Id  =:recId ];
    }
    
    @AuraEnabled
    public static FinServ__FinancialAccountTransaction__c[] getTransactions(String recId){
        List<FinServ__FinancialAccount__c> fServs = [Select Id from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c =:recId];
        List<String> fAccounts=new List<String>();
        FinServ__FinancialAccountTransaction__c[] toBeReturned = new FinServ__FinancialAccountTransaction__c[]{};
            
            for(FinServ__FinancialAccount__c fServ:fServs){
                List<FinServ__FinancialAccountTransaction__c> finTrans = [Select Id, FinServ__FinancialAccount__c, FinServ__PostDate__c, FinServ__TransactionDate__c, FinServ__Description__c, FinServ__Amount__c, FinServ__TransactionId__c, FinServ__IsDisputed__c from FinServ__FinancialAccountTransaction__c where finServ__FinancialAccount__c=:fServ.Id];
                for(FinServ__FinancialAccountTransaction__c finTran:finTrans){
                    toBeReturned.add(finTran);
                }
            }
        return toBeReturned;
    }
    
    @AuraEnabled
    Public Static FinServ__FinancialAccountTransaction__c[] updateRows(string recId, FinServ__FinancialAccountTransaction__c[] rows )
    {
        
        update rows;
        return [SELECT Id, Name, Disputed__c, OwnerId , FinServ__Amount__c,FinServ__BillingStatements__c,FinServ__CardAccountID__c,FinServ__Description__c,FinServ__FinancialAccount__c,
                FinServ__MerchantCategoryCode__c,FinServ__PostDate__c,FinServ__RunningBalance__c,FinServ__SourceSystemId__c,FinServ__SourceTransactionType__c,
                FinServ__TransactionDate__c,FinServ__TransactionId__c,FinServ__TransactionStatus__c,FinServ__TransactionSubtype__c,FinServ__TransactionType__c 
                FROM FinServ__FinancialAccountTransaction__c WHERE FinServ__FinancialAccount__c  = :recId ORDER BY FinServ__TransactionDate__c DESC];   
    } 
}
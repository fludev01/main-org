public with sharing class FinServCommunity {
	@AuraEnabled
    public static Account getUserAccount() {
        String userId = UserInfo.getUserId();
        User user = [SELECT AccountId FROM User WHERE Id = :userId];
        if (user.AccountId != null) {
            Account account = [SELECT FinServ__TotalInvestments__c, FinServ__TotalInsurance__c,
                               FinServ__TotalBankDeposits__c,
                               FinServ__WalletShare__c 
                               FROM Account
                               WHERE Id = :user.AccountId ];
            return account;
        } else {
            return null;
        }
    }

    @AuraEnabled
    public static Account getUserHouseholdAccount() {
        String userId = UserInfo.getUserId();
        User user = [SELECT ContactId, AccountId FROM User WHERE Id = :userId];
        if (user.ContactId != null && user.AccountId != null) {
            List<AccountContactRelation> relations = [SELECT AccountId FROM AccountContactRelation WHERE ContactId =: user.ContactId AND AccountId != :user.AccountId];
            if (relations.size() > 0) {
                string householdAccountId = relations[0].AccountId;
                Account account = [SELECT FinServ__TotalFinancialAccounts__c,
                        FinServ__WalletShare__c,
                        FinServ__LastInteraction__c,
                        FinServ__NextInteraction__c
                FROM Account
                WHERE Id = :householdAccountId ];
                return account;
            }
        }
        return null;
    }

    @AuraEnabled
    public static List<FinServ__FinancialAccount__c> getBankingAccounts() {
        return getFinancialAccounts('Bank Account');

    }

    @AuraEnabled
    public static List<FinServ__FinancialAccount__c> getInvestmentAccounts() {
        return getFinancialAccounts('Investment Account');

    }

    @AuraEnabled
    public static List<FinServ__FinancialAccount__c> getInsurancePolicies() {
        return getFinancialAccounts('Insurance Policy');

    }
    
    // New - Savings & Loans
    @AuraEnabled
    public static List<FinServ__FinancialAccount__c> getSavingsAccounts() {
        return getFinancialAccounts('Savings Account');
    }
    @AuraEnabled
    public static List<FinServ__FinancialAccount__c> getLoanAccounts() {
        return getFinancialAccounts('Loan Account');
    }
    // End - Savings & Loans

    @AuraEnabled
    public static List<FinServ__AssetsAndLiabilities__c> getAssetsAndLiabilities() {
        String userId = UserInfo.getUserId();
        User user = [SELECT AccountId FROM User WHERE Id = :userId];
        if (user.AccountId != null) {
            List<FinServ__AssetsAndLiabilities__c> items =
            [SELECT Id, Name, FinServ__Amount__c, FinServ__Ownership__c, FinServ__AssetsAndLiabilitiesType__c
            FROM FinServ__AssetsAndLiabilities__c
            WHERE FinServ__PrimaryOwner__c = :user.AccountId];
            return items;
        } else {
            return null;
        }
    }

    private static  List<FinServ__FinancialAccount__c> getFinancialAccounts(string recordType) {
        string recordTypeId = getFinancialAccountRecordTypeId(recordType);
        String userId = UserInfo.getUserId();
        User user = [SELECT AccountId FROM User WHERE Id = :userId];
        if (user.AccountId != null) {
            List<FinServ__FinancialAccount__c> accounts =
            [SELECT Id, Name, FinServ__FinancialAccountType__c, FinServ__Ownership__c, FinServ__HeldAway__c, FinServ__Balance__c, FinServ__Premium__c, FinServ__InsuredAmount__c, FinServ__OpenDate__c, FinServ__FinancialAccountNumber__c 
            FROM FinServ__FinancialAccount__c
            WHERE FinServ__PrimaryOwner__c = :user.AccountId AND RecordTypeId = :recordTypeId];
            return accounts;
        } else {
            return null;
        }
    }
    
    @AuraEnabled
    public static  List<FinServ__FinancialAccount__c> getFinancialAccounts1(string recordType) {
        string recordTypeId = getFinancialAccountRecordTypeId(recordType);
        String userId = UserInfo.getUserId();
        User user = [SELECT AccountId FROM User WHERE Id = :userId];
        if (user.AccountId != null) {
            List<FinServ__FinancialAccount__c> accounts =
            [SELECT Id, Name, FinServ__FinancialAccountType__c, FinServ__Ownership__c, FinServ__HeldAway__c, FinServ__Balance__c, FinServ__Premium__c, FinServ__InsuredAmount__c, FinServ__OpenDate__c, FinServ__FinancialAccountNumber__c 
            FROM FinServ__FinancialAccount__c
            WHERE FinServ__PrimaryOwner__c = :user.AccountId AND RecordTypeId = :recordTypeId];
            return accounts;
        } else {
            return null;
        }
    }

    @TestVisible
    private static Id getFinancialAccountRecordTypeId(string recordTypeName) {
        return Schema.SObjectType.FinServ__FinancialAccount__c.getRecordTypeInfosByName().get(recordTypeName).getRecordTypeId();
    }

    @AuraEnabled
    public static List<FinServ__FinancialGoal__c> getGoals() {
        String userId = UserInfo.getUserId();
        User user = [SELECT AccountId FROM User WHERE Id = :userId];
        if (user.AccountId != null) {
            return [SELECT Id, Name, FinServ__TargetDate__c, FinServ__TargetValue__c, FinServ__ActualValue__c, FinServ__Description__c, FinServ__Status__c
            FROM FinServ__FinancialGoal__c WHERE FinServ__PrimaryOwner__c = :user.AccountId];
        }
        return null;
    }
}
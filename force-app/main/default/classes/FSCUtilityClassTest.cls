/*************************
* @Class Name:- FSCUtilityClassTest
* @Description:- Test class for FSCUtilityClass
**************************/
@IsTest
public with sharing class FSCUtilityClassTest {
    
    //This test method is to get base path of community site 
    @IsTest 
    static void testgetBasePath() {
        Map<String, Object> input = new Map<String, Object>();
        Map<String, Object> output = new Map<String, Object>();
        Map<String, Object> args = new Map<String, Object>();
        args.put('input', input);
        args.put('output', output);
        Callable callableMethod = (Callable)Type.forName('FSCUtilityClass').newInstance();
        Object countryPicklistValueObj = callableMethod.call('getBasePath', args);
        System.assertEquals('{result={BasePath=}}', String.valueOf(countryPicklistValueObj));    
    }
    
    //This test method is to get the account source system Id 
    @IsTest 
    static void testGetAccountSourceSystemId() {
        Integer intNumber = 1;
        List<Account> listAccount = TestDataFactory.createAccounts(intNumber);
        List<FinServ__Card__c> listCardsCreated = TestDataFactory.createCards(listAccount);
        //insert list of Service Catalog Requests from test data factory
        List<SvcCatalogRequest> listServiceCatalogReq = TestDataFactory.createServiceCatalogRequest(intNumber, listAccount);
        insert listServiceCatalogReq;
        SvcCatalogRequest svcCatalogRequestRec = [SELECT Id, CatalogItemName FROM SvcCatalogRequest WHERE CatalogItemName = 'TestCatalog0' WITH SECURITY_ENFORCED LIMIT 1];
        Test.startTest();
        String recordId = FSCUtilityClass.getAccountSourceSystemId(svcCatalogRequestRec.Id);
        Test.stopTest();
        System.assertEquals(recordId, '2340'); 
    }
    
    //This test method is to get the card source system id
    @IsTest 
    static void testGetCardsSourceSystemId() {
        //insert list of accounts from test data factory
        Integer intNumber = 1;
        List<Account> listAccount = TestDataFactory.createAccounts(intNumber);
        List<FinServ__Card__c> listCardsCreated = TestDataFactory.createCards(listAccount);
        Test.startTest();
        Map<String, Map<String, String>> finalCardDetails = FSCUtilityClass.getCardsSourceSystemId(listAccount[0].FinServ__SourceSystemId__c);
        Test.stopTest();
        Map<String, String> cardAttr = new Map<String, String>();
        cardAttr = finalCardDetails.get('SourceSystemId');
        String sourceSysId = cardAttr.get('XXXX-6382');
        System.assertEquals(sourceSysId, '12345');
    }
    
    //This test method is to get the card source system id
    @IsTest 
    static void testGetFinancialAccSourceSystemId() {
        //insert list of accounts from test data factory
        Integer intNumber = 1;
        List<Account> listAccount = TestDataFactory.createAccounts(intNumber);
        List<FinServ__FinancialAccount__c> financialAcc = TestDataFactory.createFinancialAccounts(1, listAccount);
        Test.startTest();
        String finAccSourceSysId = FSCUtilityClass.getFinancialAccSourceSystemId(listAccount[0].FinServ__SourceSystemId__c, 'XXXX-6210');
        Test.stopTest();
        System.assertEquals(finAccSourceSysId, '234454330');
    }
    
    //This test method is to get the financial account id
    @IsTest 
    static void testGetFinancialAccountId() {
        //insert list of accounts from test data factory
        Integer intNumber = 1;
        List<Account> listAccount = TestDataFactory.createAccounts(intNumber);
        List<FinServ__FinancialAccount__c> financialAcc = TestDataFactory.createFinancialAccounts(1, listAccount);
        Test.startTest();
        String financialAccountId = FSCUtilityClass.getFinancialAccountId(listAccount[0].FinServ__SourceSystemId__c, 'XXXX-6210');
        Test.stopTest();
        System.assert(financialAccountId != null);
    }
}
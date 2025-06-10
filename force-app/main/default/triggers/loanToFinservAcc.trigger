/* Existing Trigger
* 
* 
* trigger loanToFinservAcc on FINS_Lending_Loan__c (after update) {
List<FinServ__FinancialAccount__c> listFinserv = new List<FinServ__FinancialAccount__c>();
for(FINS_Lending_Loan__c a : Trigger.New) {
if(a.Stage__c == 'Complete'){
FinServ__FinancialAccount__c finAcc = new FinServ__FinancialAccount__c();
finAcc.FinServ__PrimaryOwner__c = a.Account__c;
finAcc.Name = 'Commercial Loan';
finAcc.FinServ__Status__c = 'Open';
finAcc.RecordTypeId = '012B0000000QxI6IAK';
finAcc.FinServ__OpenDate__c = date.today();
finAcc.FinServ__Balance__c = a.Amount_Requested__c;
finAcc.RecordTypeId  = '012B0000000gUHg';
listFinserv.add(finAcc);
}

}
insert(listFinserv);
}
*/

/**
* 
* 
* Updated Trigger
*/

trigger loanToFinservAcc on FINS_Lending_Loan__c (after update) {
    List<FinServ__FinancialAccount__c> listFinserv = new List<FinServ__FinancialAccount__c>();
    for(FINS_Lending_Loan__c a : Trigger.New) {
        if(a.Stage__c == 'Complete'){
            System.debug(a.product_type__c);
            FinServ__FinancialAccount__c finAcc = new FinServ__FinancialAccount__c();
            finAcc.FinServ__PrimaryOwner__c = a.Account__c;
            
            RecordType rec = [SELECT Id, Description FROM RecordType where Name ='Commercial Loan' and description = 'For nCino loan process'];
            finAcc.RecordTypeId  = rec.Id;
            finAcc.Name = 'Commercial Loan';
            finAcc.FinServ__Status__c = 'Open';
            finAcc.FinServ__OpenDate__c = date.today();
            finAcc.FinServ__Balance__c = a.Amount_Requested__c;
            listFinserv.add(finAcc);
        }
        
    }
    insert(listFinserv);
}
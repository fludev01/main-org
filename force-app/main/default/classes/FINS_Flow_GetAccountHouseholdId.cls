global class FINS_Flow_GetAccountHouseholdId {
	global class Response {
        @InvocableVariable
        global string HouseholdId;
    }
    
    global class Input {
        @InvocableVariable
        global String recId;
    }
    @InvocableMethod(label='FINS Flow - Get Household Id' description='Input an Account ID and returns what the Household ID is related to that account.')
    global static List<Response> getObjectResults(List<Input> inputs) {
        List<Response> responses = new List<Response>();
       
        for(Input input : inputs) {
            Id householdRecTypeId = Schema.Sobjecttype.Account.getRecordTypeInfosByName().get('Household').getRecordTypeId();
            Id rid = input.recId;
            ID contactAccountId = [Select PersonContactId From Account Where Id = :rid ].PersonContactId;
            Response response = new Response();
            
            String getHouseholdId = [Select Id,Account.Name, ContactId, Contact.Name, Account.RecordType.Id,AccountId
                                FROM AccountContactRelation 
                                WHERE Account.RecordTypeId = :householdRecTypeId 
                                and ContactId = :contactAccountId 
                                and FinServ__PrimaryGroup__c = true].AccountId;
           response.HouseholdId = getHouseholdId; 
           responses.add(response);
        }
        
        return responses;
    }
}
public without sharing class demCalendarController {
	
    private static String getAccountIdByOpporunityId(String oppId){
        Opportunity opp = [SELECT AccountId FROM Opportunity WHERE Id = :oppId];
        return opp.AccountId;
    }

    @AuraEnabled(cacheable=true)
	public static List<Task> getTasks(String recordId) {
        String objectName = getObjectNameById(recordId); 
        if (objectName == 'Account'){
            return [SELECT Id, Subject, Type, Status, ActivityDate, IsClosed FROM Task WHERE WhatId = :recordId OR AccountId = :recordId];        
        } else if (objectName == 'Contact'){
            return [SELECT Id, Subject, Type, Status, ActivityDate, IsClosed FROM Task WHERE WhoId = :recordId];        
        } else if (objectName == 'Opportunity'){     
            String accId = getAccountIdByOpporunityId(recordId);    
            return [SELECT Id, Subject, Type, Status, ActivityDate, IsClosed FROM Task WHERE WhatId = :accId OR AccountId = :accId];        
        }
        return null;
	}
    @AuraEnabled(cacheable=true)
	public static List<Task> getAllTasks() {
        String meId = UserInfo.getUserId(); 
        return [SELECT Id, Subject, Type, Status, ActivityDate, IsClosed, AccountId, Account.Name, WhoId, Who.Name FROM Task WHERE OwnerId = :meId];        
	}

    @AuraEnabled(cacheable=true)
	public static List<Event> getEvents(String recordId) {
        String objectName = getObjectNameById(recordId); 
        if (objectName == 'Account'){
            return [SELECT Id, Subject, StartDateTime, EndDateTime FROM Event WHERE WhatId = :recordId OR AccountId = :recordId];        
        } else if (objectName == 'Contact'){
            return [SELECT Id, Subject, StartDateTime, EndDateTime FROM Event WHERE WhoId = :recordId];        
        } else if (objectName == 'Opportunity'){     
            String accId = getAccountIdByOpporunityId(recordId);    
            return [SELECT Id, Subject, StartDateTime, EndDateTime FROM Event WHERE WhatId = :accId OR AccountId = :accId];
        }
        return null;		
	}
    @AuraEnabled(cacheable=true)
	public static List<Event> getAllEvents() {
        String meId = UserInfo.getUserId(); 
        return [SELECT Id, Subject, StartDateTime, EndDateTime, AccountId, Account.Name, WhoId, Who.Name FROM Event WHERE OwnerId = :meId];        
	}

    @AuraEnabled(cacheable=true)
	public static List<Opportunity> getOpportunities(String recordId) {
        String objectName = getObjectNameById(recordId); 
        if (objectName == 'Account'){
            return [SELECT Id, Name, CloseDate, IsClosed, IsWon FROM Opportunity WHERE AccountId = :recordId];        
        } else if (objectName == 'Contact'){
            return [SELECT Id, Name, CloseDate, IsClosed, IsWon FROM Opportunity WHERE ContactId = :recordId];        
        } else if (objectName == 'Opportunity'){     
            String accId = getAccountIdByOpporunityId(recordId);    
            return [SELECT Id, Name, CloseDate, IsClosed, IsWon FROM Opportunity WHERE AccountId = :accId];     
        }
        return null;		
	}
    @AuraEnabled(cacheable=true)
	public static List<Opportunity> getAllOpportunities() {
        String meId = UserInfo.getUserId();
        return [SELECT Id, Name, CloseDate, IsClosed, IsWon, AccountId, Account.Name, ContactId FROM Opportunity WHERE OwnerId = :meId];        
	}


    @AuraEnabled
    public static String getObjectNameById(String recordId){
        return Id.valueOf(recordId).getSObjectType().getDescribe().getName();
    }

    
    @AuraEnabled
    public static List<String> getDefaults(String recordId){
        String objectName = getObjectNameById(recordId);
        List<String> rets = new List<String>();
        if (objectName == 'Account'){
            rets.add(recordId);
            rets.add(null);
        } else if (objectName == 'Contact'){
            Contact ct = [SELECT AccountId FROM Contact WHERE Id = :recordId];
            rets.add(ct.AccountId);
            rets.add(recordId);
        } else if (objectName == 'Opportunity'){
            Opportunity opp = [SELECT AccountId FROM Opportunity WHERE Id = :recordId];
            rets.add(opp.AccountId);
            rets.add(null);
        }
        return rets;
    }

}
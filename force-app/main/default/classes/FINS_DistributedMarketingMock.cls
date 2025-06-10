public class FINS_DistributedMarketingMock {
@AuraEnabled 
    public static List<FINS_Distributed_Marketing_Template__c > getTemplateContent() {
        List<FINS_Distributed_Marketing_Template__c > dmcontent = [Select Name,Footer_Image_URL__c,Id,Header_Image_URL__c ,Logo_URL__c ,Primary_Description__c ,Primary_Header__c,Industry__c From FINS_Distributed_Marketing_Template__c ORDER BY Name ASC]; 
        return dmcontent; 
    }
    @AuraEnabled 
    public static List<sObject> getRecordInfo(String recid) {
        Id rid = recId;
        Schema.SObjectType sobjectType = rid.getSObjectType();
        string type = String.valueOf(sobjectType);
        if(type == 'Account'){
            String checkType = [SELECT RecordType.Name FROM Account WHERE ID = :rid].RecordType.Name;
            if(checkType == 'Person Accounts' || (checkType == 'FSC Person Accounts' )){
                return [SELECT Name FROM Account WHERE ID = :rid];
            }
        }else if(type == 'Lead'){
            return [SELECT Name FROM Lead WHERE ID = :rid];
        }else if(type == 'Contact'){
            return [SELECT Name FROM Contact WHERE ID = :rid];
        }else{
            return null;
        }
        return null;
    }
    
    
	@AuraEnabled 
    public static List<FINS_Distributed_Marketing_Content__c > getContent(String template) {
        List<FINS_Distributed_Marketing_Content__c > dmcontent = [Select Name,Id, Layout__c  ,Distributed_Marketing_Template__r.Industry__c,Image_URL__c, Description__c, Distributed_Marketing_Template__c   From FINS_Distributed_Marketing_Content__c  WHERE Distributed_Marketing_Template__r.Name = :template ORDER BY Name ASC]; 
        return dmcontent; 
    } 
    
    @AuraEnabled 
    public static List < String > getselectOptions(sObject objObject, string fld) {
        List < String > allOpts = new list < String > ();
        // Get the object type of the SObject.
        Schema.sObjectType objType = objObject.getSObjectType();
        
        // Describe the SObject using its object type.
        Schema.DescribeSObjectResult objDescribe = objType.getDescribe();
        
        // Get a map of fields for the SObject
        map < String, Schema.SObjectField > fieldMap = objDescribe.fields.getMap();
        
        // Get the list of picklist values for this field.
        list < Schema.PicklistEntry > values =
            fieldMap.get(fld).getDescribe().getPickListValues();
        
        // Add these values to the selectoption list.
        for (Schema.PicklistEntry a: values) {
            allOpts.add(a.getValue());
        }
        allOpts.sort();
        return allOpts;
    }
}
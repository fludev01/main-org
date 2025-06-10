public class DE_GetRecordData {
    
    @AuraEnabled
    public static String getRec(String recordId,String reqField,String objApiName)
    {
        String query = 'SELECT '+reqField+' from '+objApiName+' where Id=\''+recordId+'\'';
        List<sObject> sobjList = Database.query(query);
        return   (String) sobjList[0].get(reqField);
    }

}
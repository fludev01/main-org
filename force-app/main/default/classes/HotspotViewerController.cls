public with sharing class HotspotViewerController {
    public HotspotViewerController() {

    }

    @AuraEnabled
public static List<FilesWrapper> getRelatedFiles(Id recordId){
    
    List<ContentDocument> cdList = new List<ContentDocument>();
    List<ContentDocumentLink> cdlList = [SELECT ContentDocumentId FROM ContentDocumentLink
                                         WHERE LinkedEntityId = :recordId];
    Set<Id> cdIds = new Set<Id>();
    List<FilesWrapper> lstFiles = new List<FilesWrapper>();
    for (ContentDocumentLink cdl : cdlList) {
        cdIds.add(cdl.ContentDocumentId); 
    }        
    cdList = [SELECT Id, Title, FileType, OwnerId, Owner.Name, CreatedDate,
              CreatedById, CreatedBy.Name, ContentSize
              FROM ContentDocument WHERE Id IN :cdIds];

    Map<Id,Prototype_Screen_Configuration__c> mapFildIdToPSC = new Map<Id,Prototype_Screen_Configuration__c>();
    List<Id> pscIds = new List<Id>();
    for( Prototype_Screen_Configuration__c psc : [SELECT Id,Name,startFlag__c,sheight__c, File_VersionId__c FROM Prototype_Screen_Configuration__c WHERE Prototype_Configuration__c =: recordId]) {
        mapFildIdToPSC.put( psc.File_VersionId__c, psc);
        pscIds.add(psc.Id);
    }
    Map<Id, List<Hotspots__c>>  mapPCSIdToHotspots = new Map<Id, List<Hotspots__c>>();
    for( Hotspots__c hsp : [SELECT Id, Height__c,Prototype_Screen_Configuration__c,Target_Screen__c,Target_URL__c,Width__c,X_cordinate__c,Y_cordinate__c FROM Hotspots__c WHERE Prototype_Screen_Configuration__c IN :pscIds]) {
        if( !mapPCSIdToHotspots.containsKey(hsp.Prototype_Screen_Configuration__c)) {
            mapPCSIdToHotspots.put(hsp.Prototype_Screen_Configuration__c, new List<Hotspots__c>());
        }
        mapPCSIdToHotspots.get( hsp.Prototype_Screen_Configuration__c).add(hsp);
    }

    for (ContentDocument cd : cdList) {
        ContentVersion cv = [SELECT Id FROM ContentVersion WHERE ContentDocumentId = :cd.Id AND IsLatest = true];
        String cvDownloadURL = URL.getSalesforceBaseUrl().toExternalForm() + '/sfc/servlet.shepherd/version/download/' + cv.Id;
        
            FilesWrapper fw = new FilesWrapper();
            fw.docId = cd.Id;
            fw.title = cd.Title;
            fw.fileType = cd.FileType;
            fw.contentVersionId = cv.Id;
            fw.docURL = cvDownloadURL;
            if( mapFildIdToPSC.containsKey(cv.Id) ) {
                fw.prototypeScreenConfig = mapFildIdToPSC.get(cv.Id);
                if( mapPCSIdToHotspots.containsKey(mapFildIdToPSC.get(cv.Id).Id) ) {
                    fw.hotspots = mapPCSIdToHotspots.get(mapFildIdToPSC.get(cv.Id).Id);
                }
            }
            
            
            lstFiles.add(fw);
        
        
    }

    return lstFiles;
}



public class FilesWrapper{

    @AuraEnabled
    public string docId { get; set;}

    @AuraEnabled
    public string title { get; set;}

    @AuraEnabled
    public string fileType { get; set;}

    @AuraEnabled
    public string contentVersionId { get; set;}
    
    @AuraEnabled
    public string docURL { get; set;}

    @AuraEnabled
    public Prototype_Screen_Configuration__c prototypeScreenConfig;
    
    @AuraEnabled
    public List<Hotspots__c> hotspots;


}

}
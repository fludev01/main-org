public with sharing class FINS_Qsyd_GW_Controller {
    
    @AuraEnabled 
    public static Opportunity getOpptyAccountInfoByOpptyId(String opptyId){
        try{
            System.debug('Opportunity Id: ' + opptyId);
            List<Opportunity> opps = [SELECT Id, StageName, RecordType.Name, Name, AccountId, Account.FirstName, Account.LastName, Account.Name, Account.BillingStreet, Account.BillingCity, Account.OwnerId, Account.BillingPostalCode, Account.BillingState, Account.AccountNumber, Account.Phone, Account.PersonEmail, CloseDate FROM Opportunity WHERE Id =:opptyId WITH SECURITY_ENFORCED];
            Opportunity o = opps[0];
            System.debug(o);
            return o;
        } catch(Exception e){
            System.debug('The following exception has occurred: ' + e.getMessage());
            return null;
        }
    }

    @AuraEnabled 
    public static InsurancePolicy getExistingPolicy(String opptyId){
        try{
            List<InsurancePolicy> existingPolicy = [SELECT Id, Status, RecordType.Name, PremiumAmount, ProductId 
                                                    FROM InsurancePolicy 
                                                    WHERE SourceOpportunityId=:opptyId WITH SECURITY_ENFORCED Order By CreatedDate DESC ];
            if(existingPolicy.size() > 0){
                return existingPolicy[0];
            } else {
                return null;
            }   
        } catch(DmlException e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            return null;
        } 
         
    }



    @AuraEnabled 
    public static Boolean deletePolicyById(String policyId, String opptyId){
        try{
            List<InsurancePolicy> policy = new List<InsurancePolicy>();
            List<InsurancePolicyAsset> policyAssets = new List<InsurancePolicyAsset>();
            List<InsurancePolicyCoverage> policyCoverages = new List<InsurancePolicyCoverage>();
            List<Opportunity> opportunities = new List<Opportunity>();
            List<Task> tasks = new List<Task>();
            List<OpportunityLineItem> opptyLineItems = new List<OpportunityLineItem>();

           
           if(opptyId != null){
                tasks = [SELECT Id FROM Task WHERE whatId = :opptyId WITH SECURITY_ENFORCED];
                opportunities = [SELECT Id FROM Opportunity WHERE Id = :opptyId WITH SECURITY_ENFORCED];
                opptyLineItems = [SELECT Id FROM OpportunityLineItem WHERE OpportunityId = :opptyId WITH SECURITY_ENFORCED];
                System.debug('>>> opptyLineItems: ' + opptyLineItems);
                deleteFinServAlert(opptyId);
                delete opptyLineItems;
                delete tasks;
                opportunities[0].FINS_Insurance_PolicyCenter_Update__c = false;
                update opportunities; 
            }

             if(policyId != null){
                policy = [SELECT Id FROM InsurancePolicy WHERE Id=:policyId WITH SECURITY_ENFORCED];
                policyAssets = [SELECT Id FROM InsurancePolicyAsset WHERE InsurancePolicyId=:policyId WITH SECURITY_ENFORCED];
                for(Integer i = 0; i < policyAssets.size(); i++){
                    List<InsurancePolicyCoverage> c = [SELECT Id FROM InsurancePolicyCoverage WHERE InsurancePolicyAssetId=:policyAssets[i].Id AND InsurancePolicyId = :policyId WITH SECURITY_ENFORCED] ;
                    policyCoverages.addAll(c);        
                    delete policyCoverages; 
                    delete policyAssets;
                    delete policy;
                }
            }
            
            return true;
        } catch(DmlException e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            return false;
        }   
        
    }

    @AuraEnabled 
    public static Opportunity updateOpportunityStage(String opptyId, String updateOpptyStatus){
        try{  
            List<Opportunity> opps = [SELECT Id, StageName FROM Opportunity WHERE Id =:opptyId WITH SECURITY_ENFORCED];   
            if(opps.size() > 0){
               Opportunity o = opps[0];
                o.StageName = updateOpptyStatus;
                update o;    
                return o;
            }else{
                return null;
            }
            
        } catch(DmlException e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            return null;
        } 
    
    }

    @AuraEnabled 
    public static InsurancePolicy updatePolicyStatus(String updatePolicyStatus, String policyId){ 
        try{  
            List<InsurancePolicy> policies = [SELECT Id, Status, NameInsuredId, effectiveDate, PremiumAmount FROM InsurancePolicy WHERE Id =:policyId WITH SECURITY_ENFORCED];
            if(policies.size() > 0){
                policies[0].Status = updatePolicyStatus; 
                update policies;   
                return policies[0];   
            }else { 
                return null;
            }
        } catch(DmlException e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            return null;
        } 
      
    }

    @AuraEnabled 
    public static InsurancePolicy updatePolicyAmount(String policyId, String amountString){ 
        try{  
            List<InsurancePolicy> policies = [SELECT Id, Status, NameInsuredId, effectiveDate, PremiumAmount FROM InsurancePolicy WHERE Id =:policyId WITH SECURITY_ENFORCED];
            if(policies.size() > 0){
                policies[0].PremiumAmount =  Decimal.valueOf(amountString);  
                update policies;   
                return policies[0];   
            }else { 
                return null;
            } 
        } catch(DmlException e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            return null;
        }  
    }


    @AuraEnabled 
    public static InsurancePolicy createInsurancePolicy(String opptyId, String accountId, String insurancePolicyRecordTypeName,String planType, String paymentPlanTotalString, String effectiveDateStr, String opptyName, String productId, String policyId, String status, String producerId){

        String insurancePolicyTypeId;
        Date effectiveDate, expireDate;
		String PolicyName;
        String agencyId;
                
        try {
            insurancePolicyTypeId = [SELECT Id FROM RecordType WHERE SobjectType = 'InsurancePolicy' AND Name = :insurancePolicyRecordTypeName ].Id;
            InsurancePolicy ip = new InsurancePolicy();
            Opportunity op = [SELECT Id,Account.OwnerId FROM Opportunity WHERE Id = :opptyId WITH SECURITY_ENFORCED LIMIT 1 ];   
            String accountOwnerId = op.Account.OwnerId;
            op.OwnerId = accountOwnerId;
            update op;
            List<Producer> producers = [SELECT Id, Name,AccountId,Type FROM Producer WHERE Id=: producerId WITH SECURITY_ENFORCED] ; 
            if(producers.size() > 0){
                agencyId  = producers[0].AccountId;
            }
           
            if(!String.isEmpty(insurancePolicyTypeId)){
                ip.RecordTypeId  = insurancePolicyTypeId;
            }
            effectiveDate = Date.valueOf(effectiveDateStr);
            DateTime effectiveDateTime = DateTime.newInstance(effectiveDate, Time.newInstance(23,59,59,59));
            ip.EffectiveDate = effectiveDateTime;
            ip.ExpirationDate =  effectiveDateTime.addYears(1);
            ip.NameInsuredId = accountId;
            PolicyName = 'PN-'+ generateRandomString(6);
            
            ip.PolicyName = PolicyName;
            ip.SaleDate = DateTime.now();
            ip.SourceOpportunityId = opptyId; 
            
            ip.Name = PolicyName;   
            ip.PolicyType = planType;    
            if(paymentPlanTotalString != null){
                ip.PremiumAmount = Decimal.valueOf(paymentPlanTotalString);  
            }
            ip.Status = status; 
            ip.ProductId = productId;
            ip.Id = policyId; 
            ip.ProducerId = producerId;

            op.FINS_Agency_Broker__c = agencyId;
            op.FINS_Application_Received_Date__c = effectiveDateTime;
            DateTime dt = effectiveDateTime.addDays(7);
            op.FINS_Quote_Due_By__c = date.newInstance(dt.year(), dt.month(), dt.day());
            
            update op;
            upsert ip;  
            return ip;  
        } catch(DmlException e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            return null; 
        }    
            

    }  

    @AuraEnabled   
    public static List<OpportunityLineItem> upsertOpportunityLineItem(String opptyId, String productId, Integer qty, Double price){
         List<OpportunityLineItem> opptyLineItems = new List <OpportunityLineItem>();
        OpportunityLineItem opptyLineItem = new OpportunityLineItem();
        Integer i = 0;
        try{
            Opportunity oppty = [SELECT Id FROM Opportunity WHERE Id=:opptyId LIMIT 1];
            List<Pricebook2> pbs = [SELECT Id FROM Pricebook2 WHERE Name = 'Standard Price Book' LIMIT 1]; 
            if(pbs.size() > 0){
                oppty.PriceBook2Id = pbs[0].Id;
                update oppty;
            }
            opptyLineItems = [SELECT Id FROM OpportunityLineItem WHERE Product2Id = :productId AND OpportunityId = :opptyId WITH SECURITY_ENFORCED];
            if(opptyLineItems.size() ==  0){    
                opptyLineItem = new OpportunityLineItem();
                opptyLineItem.Product2Id = productId;
                opptyLineItem.OpportunityId = opptyId;
                if(qty != null){ 
                    opptyLineItem.Quantity = qty;
                } 
                if(price != null){ 
                    opptyLineItem.UnitPrice = price;
                }  
                opptyLineItem.ServiceDate = Date.Today();
                opptyLineItems.add(opptyLineItem);
                System.debug('>>> size = 0');
            } else{ 
                opptyLineItem = opptyLineItems[0];
                if(qty != null){ 
                    opptyLineItem.Quantity = qty;
                } 
                if(price != null){ 
                    opptyLineItem.UnitPrice = price;
                }  
                opptyLineItem.ServiceDate = Date.Today();
                upsert opptyLineItem;
            }
           
            System.debug('opptyLineItem');
            System.debug('>>> upsertOpportunityLineItem');
            System.debug(opptyLineItems);
            upsert opptyLineItems;
            return opptyLineItems;
        }  catch(DmlException e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            return null; 
        } 
    }



    private static String generateRandomString(Integer len) {
        final String chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        String randStr = '';
        while (randStr.length() < len) {
            Integer idx = Math.mod(Math.abs(Crypto.getRandomInteger()), chars.length());
            randStr += chars.substring(idx, idx+1);
        }
        return randStr; 
    }

    @AuraEnabled
    public static List<InsurancePolicyAsset> createInsuranceCustomerPropertyAndAssets(String propertyRecordTypeName, String propertyListString, String opptyId, String accountId, String insPolicyId, Boolean isPersonal, String productName){
        try {
            List<CustomerProperty> cps = new List<CustomerProperty>(); 
            cps = (List<CustomerProperty>) JSON.deserialize(propertyListString, List<CustomerProperty>.class);

            String customerPropertyRecordTypeId = [SELECT Id FROM RecordType Where SobjectType = 'CustomerProperty' AND Name = :propertyRecordTypeName WITH SECURITY_ENFORCED].Id;

            //CHECK FOR EXISTING RECORDS BY VIN NUMBER (THIS COULD MOVE TO INIT)

            List<CustomerProperty> thisAccountCps = new List<CustomerProperty> ();
            Map<String, String> thisAccountCpsLookUpMap = new Map<String, String>();
            thisAccountCps = [SELECT Id, VIN, INS_Property_Code__c FROM CustomerProperty WHERE PrimaryOwnerId = :accountId WITH SECURITY_ENFORCED]; 
            for(Integer i = 0; i < thisAccountCps.size(); i++){
                if(isPersonal){
                    thisAccountCpsLookUpMap.put(thisAccountCps[i].VIN, thisAccountCps[i].Id);
                }else{
                    thisAccountCpsLookUpMap.put(thisAccountCps[i].INS_Property_Code__c, thisAccountCps[i].Id);
                }
                
            }

            //CREATE CUSTOMERPROPERTY RECORDS
            for(Integer j = 0; j < cps.size(); j++){
                if(!String.isEmpty(customerPropertyRecordTypeId)){ 
                    cps[j].recordTypeId = customerPropertyRecordTypeId;
                } 
                if(isPersonal){
                     if(thisAccountCpsLookUpMap.containsKey(cps[j].VIN) ){ 
                        cps[j].Id = thisAccountCpsLookUpMap.get(cps[j].VIN); 
                    }
                }else{
                     if(thisAccountCpsLookUpMap.containsKey(cps[j].INS_Property_Code__c) ){ 
                        cps[j].Id = thisAccountCpsLookUpMap.get(cps[j].INS_Property_Code__c);
                    }
                }
            } 
            
            upsert cps;
            Opportunity oppty = [SELECT Id FROM Opportunity WHERE Id = :opptyId LIMIT 1];
            if(oppty != null){
                oppty.Description = cps[0].Street + ' ' + cps[0].City + ' ' + cps[0].State;
                if(productName != null){
                    oppty.Description = productName + ' - ' + oppty.Description;
                }
                oppty.FINS_Insurance_Rating_State__c = cps[0].State;
                update oppty;
            }
            System.debug('>>>' + cps);
            //CREATE INSURANCE POLICY ASSETS
            List<InsurancePolicyAsset> insuranceAssets = new List<InsurancePolicyAsset>(); 
            List<InsurancePolicyAsset> temp = new List<InsurancePolicyAsset>(); 
            InsurancePolicyAsset insAsset = new InsurancePolicyAsset();

            for(Integer z = 0; z < cps.size(); z++){
                temp = [SELECT Id FROM InsurancePolicyAsset WHERE InsurancePolicyId = :insPolicyId AND CustomerPropertyId = :cps[z].Id ]; 
                if(temp != null && temp.size() > 0){ 
                    insAsset.Id = temp[0].Id;
                }else{
                    insAsset.InsurancePolicyId = insPolicyId;
                    insAsset.CustomerPropertyId = cps[z].Id;
                    
                    insuranceAssets.add(insAsset); 
                }

            }  

            upsert insuranceAssets;  
            System.debug('Insurance assets: ' + JSON.serialize(insuranceAssets));
  
            return insuranceAssets;
        }
        catch(DmlException e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            return null;
        } 
        
    } 

    @AuraEnabled
    public static List<InsurancePolicyCoverage> createInsurancePolicyCoverage(String insurancePolicyCoverageJSONString, String opptyId, String accountId, String insurancePolicyId, String insuranceAssetsJSONString){ 
        try {
            List<InsurancePolicyAsset> ipas = new List<InsurancePolicyAsset>(); 
            ipas = (List<InsurancePolicyAsset>) JSON.deserialize(insuranceAssetsJSONString,   List<InsurancePolicyAsset>.class);

            
            List<InsurancePolicyCoverage> ipc = new List<InsurancePolicyCoverage>(); 
            ipc = (List<InsurancePolicyCoverage>) JSON.deserialize(insurancePolicyCoverageJSONString,   List<InsurancePolicyCoverage>.class);
            
            for(Integer i = 0; i < ipc.size(); i++ ){
                ipc[i].InsurancePolicyAssetId = ipas[0].Id;
            }
            

            upsert ipc;
            return ipc;  
        }
        catch(DmlException e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            return null;
        } 
        
    }  



    @AuraEnabled
    public static List<InsurancePolicyAsset> createInsurancePolicyAsset(String insurancePolicyAssetsJSONString){
        try {
            List<InsurancePolicyAsset> ipa = new List<InsurancePolicyAsset>(); 
            ipa = (List<InsurancePolicyAsset>) JSON.deserialize(insurancePolicyAssetsJSONString, List<InsurancePolicyAsset>.class);
           upsert ipa;
           return ipa; 
        }
        catch(DmlException e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            return null;
        } 
        
    }  

    @AuraEnabled
    public static List<InsurancePolicyParticipant> InsurancePolicyParticipant(String InsurancePolicyParticipantJSONString){
        try {
            List<InsurancePolicyParticipant> ipp = new List<InsurancePolicyParticipant>(); 
            ipp = (List<InsurancePolicyParticipant>) JSON.deserialize(InsurancePolicyParticipantJSONString, List<InsurancePolicyParticipant>.class);
           upsert ipp;
           return ipp; 
        }
        catch(DmlException e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            return null;
        } 
    }       

   @AuraEnabled
    public static String getProducers() {
        List<Producer> producers = new List<Producer>();
        try{
            producers = [ SELECT Id, Name, External_ID__c, INS_Producer_Code__c, InternalUserId,AccountId,Type FROM Producer ];
            System.debug(JSON.serialize(producers));  
            return JSON.serialize(producers);
        }
       catch(DmlException e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            return null;
        } 
       
    }
       

    @AuraEnabled
    public static List<Product2> getProducts(String productFamily) {
        //Test String 'Commercial Insurance' 

        List<Product2> products  = new List<Product2> ();
        try{
            products = [ SELECT Id, Name, FINS_Premium__c, FINS_Order__c,ProductCode FROM Product2 WHERE Family = :productFamily AND IsActive = true ORDER BY FINS_Order__c NULLS LAST];
            return products;
        }
       catch(DmlException e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            return null;
        } 
    } 


    @AuraEnabled
    public static String getExistingCustomerPropertyCommercialProperty(String accountId) { 
        //Targeting RecordType 'Commercial Property, Resident Property'  
        
        system.debug('>>>>> getExistingCustomerPropertyCommercialProperty');
        system.debug(accountId);   
        String  existingCommercialPropertiesJSONString = '';     
        List<CustomerProperty> existingCommercialProperties = new List<CustomerProperty> ();
        try{ 
            existingCommercialProperties = [SELECT Id, Name, Street, State, City, PostalCode, Country,INS_Property_Code__c, FloorCount, Description, YearBuilt, ConstructionClass,BuiltUpArea FROM CustomerProperty WHERE PrimaryOwnerId = :accountId AND RecordType.Name LIKE '%Commercial Property%'];         
            if(existingCommercialProperties.size() == 0 ){
                return null; 
            } 
            existingCommercialPropertiesJSONString = JSON.serialize(existingCommercialProperties);
            System.debug(existingCommercialProperties);
            return existingCommercialPropertiesJSONString;    
        } 
         catch(DmlException e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            return null;   
        }   
       
    }

    @AuraEnabled
    public static Opportunity updateOpportunityAfterHandlingINSToolkitEvent(String opptyId) { 
        
        System.debug('>>>>> updateOpportunityAfterHandlingINSToolkitEvent');
         
        List<Opportunity> opptyList = new List<Opportunity>();
        try{  
            opptyList = [SELECT Id FROM Opportunity WHERE Id = :opptyId];
            Opportunity oppty = opptyList[0];
            oppty.FINS_Insurance_PolicyCenter_Update__c = true; 
            System.debug(oppty);
            update oppty;
            return oppty;

        } 
         catch(DmlException e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            return null;   
        }   
       
    }

    @AuraEnabled
    public static String createQuoteAttachementChatterPost(String opptyId, String filename, String staticResourceFileName, String chatterFeedText,String mentionUserExternalId) { 
        StaticResource pdf = [SELECT Id, Name, Body FROM StaticResource WHERE Name = :staticResourceFileName LIMIT 1];
        if(pdf != null){
           
            Date dt = Date.today();
            String dateString = String.valueOf(dt.day()) +'-'+  String.valueOf(dt.month() +'-'+String.valueOf(dt.year()));
            String filenameWithDate = filename + ' ' + dateString;
            ContentVersion contentVersion = new ContentVersion(
                versionData = pdf.Body, 
                title = filenameWithDate,
                PathOnClient = filenameWithDate + '.pdf'  
            ); 
            insert contentVersion;
            contentVersion = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:contentVersion.Id LIMIT 1];

            ContentDocumentLink contentDocLink = new ContentDocumentLink();
			contentDocLink.ContentDocumentId = contentVersion.ContentDocumentId;
            contentDocLink.LinkedEntityId = opptyId;
            contentDocLink.ShareType = 'V'; 
            insert contentDocLink; 

            // The MessageBodyInput object holds the text in the post
            ConnectApi.MessageBodyInput messageBodyInput = new ConnectApi.MessageBodyInput();
            messageBodyInput.messageSegments = new List<ConnectApi.MessageSegmentInput>();

            ConnectApi.MentionSegmentInput mentionSegmentInput = new ConnectApi.MentionSegmentInput();

            if(mentionUserExternalId != null){
                List<User> mentionedUserList = [SELECT Id FROM User WHERE External_ID__c=: mentionUserExternalId LIMIT 1];
                if(mentionedUserList.size() > 0){
                    mentionSegmentInput.id = mentionedUserList[0].Id;
                    messageBodyInput.messageSegments.add(mentionSegmentInput);
                }  
            } 

            ConnectApi.FeedItemInput feedItemInput = new ConnectApi.FeedItemInput();
            feedItemInput.subjectId = opptyId;

            ConnectApi.TextSegmentInput textSegmentInput = new ConnectApi.TextSegmentInput();
            textSegmentInput.text = chatterFeedText; 


            messageBodyInput.messageSegments.add(textSegmentInput);
            feedItemInput.body = messageBodyInput;

            List<String> fileIds = new List<String>();
            fileIds.add(contentVersion.ContentDocumentId);
            ConnectApi.FilesCapabilityInput filesInput = new ConnectApi.FilesCapabilityInput();
            filesInput.items = new List<ConnectApi.FileIdInput>();
            for (String fileId : fileIds) {
                ConnectApi.FileIdInput idInput = new ConnectApi.FileIdInput();
                idInput.id = fileId;
                filesInput.items.add(idInput);
            }

            ConnectApi.FeedElementCapabilitiesInput feedElementCapabilitiesInput = new ConnectApi.FeedElementCapabilitiesInput();
            feedElementCapabilitiesInput.files = filesInput;
            feedItemInput.capabilities = feedElementCapabilitiesInput;
             feedItemInput.visibility = ConnectApi.FeedItemVisibilityType.AllUsers;
            ConnectApi.FeedElement feedElement = ConnectApi.ChatterFeeds.postFeedElement(Network.getNetworkId(), feedItemInput);
            return feedElement.Id;
        }else{
            return null;
        }
  
    }

   @AuraEnabled
    public static String createTextChatterPost(String opptyId, String chatterFeedText, String boldText, String mentionUserExternalId) { 

        List<Opportunity> opptyList = [SELECT Account.Id FROM Opportunity WHERE Id = :opptyId];
        String feedOwnerId;
        if(opptyList.size() > 0){
            feedOwnerId = opptyList[0].Account.Id;
        } else {
            return null;
        }

        try{
            ConnectApi.FeedItemInput feedItemInput = new ConnectApi.FeedItemInput();
            ConnectApi.MentionSegmentInput mentionSegmentInput = new ConnectApi.MentionSegmentInput();
            ConnectApi.MessageBodyInput messageBodyInput = new ConnectApi.MessageBodyInput();
            ConnectApi.TextSegmentInput textSegmentInput = new ConnectApi.TextSegmentInput();
            ConnectApi.TextSegmentInput textSegment;
            ConnectApi.MentionSegmentInput mentionSegment;
            ConnectApi.MarkupBeginSegmentInput markupBeginSegment;
            ConnectApi.MarkupEndSegmentInput markupEndSegment;
            ConnectApi.MarkupBeginSegmentInput markupBeginParaSegment;
            ConnectApi.MarkupEndSegmentInput markupEndParaSegment;
             ConnectApi.MarkupBeginSegmentInput markupBeginPara2Segment;
            ConnectApi.MarkupEndSegmentInput markupEndPara2Segment;

            messageBodyInput.messageSegments = new List<ConnectApi.MessageSegmentInput>();
            // if(mentionUserExternalId != null){
            //     List<User> mentionedUserList = [SELECT Id FROM User WHERE External_ID__c=: mentionUserExternalId LIMIT 1];
            //     if(mentionedUserList.size() > 0){
            //         mentionSegmentInput.id = mentionedUserList[0].Id;
            //         messageBodyInput.messageSegments.add(mentionSegmentInput);
            //     }  
            // }
            if(boldText != null){



                
                markupBeginParaSegment = new ConnectApi.MarkupBeginSegmentInput();
                markupBeginParaSegment.markupType = ConnectApi.MarkupType.Paragraph;
                messageBodyInput.messageSegments.add(markupBeginParaSegment);
                    markupBeginSegment = new ConnectApi.MarkupBeginSegmentInput();
                    markupBeginSegment.markupType = ConnectApi.MarkupType.Bold;
                    messageBodyInput.messageSegments.add(markupBeginSegment);
                    textSegment = new ConnectApi.TextSegmentInput();
                    textSegment.text = boldText;
                    messageBodyInput.messageSegments.add(textSegment);
                    markupEndSegment = new ConnectApi.MarkupEndSegmentInput();
                    markupEndSegment.markupType = ConnectApi.MarkupType.Bold;
                    messageBodyInput.messageSegments.add(markupEndSegment);
                    markupEndParaSegment = new ConnectApi.MarkupEndSegmentInput();
                    markupEndParaSegment.markupType = ConnectApi.MarkupType.Paragraph;
                messageBodyInput.messageSegments.add(markupEndParaSegment);

                markupBeginPara2Segment = new ConnectApi.MarkupBeginSegmentInput();
                markupBeginPara2Segment.markupType = ConnectApi.MarkupType.Paragraph;
                messageBodyInput.messageSegments.add(markupBeginPara2Segment);
                   
                ConnectApi.TextSegmentInput blankTextSegment = new ConnectApi.TextSegmentInput();
                blankTextSegment.text = '.';
                messageBodyInput.messageSegments.add(blankTextSegment);
                markupEndPara2Segment = new ConnectApi.MarkupEndSegmentInput();
                markupEndPara2Segment.markupType = ConnectApi.MarkupType.Paragraph;
                messageBodyInput.messageSegments.add(markupEndPara2Segment);

            } 
  

            textSegmentInput.text = chatterFeedText;
            messageBodyInput.messageSegments.add(textSegmentInput);

            feedItemInput.body = messageBodyInput;  
            feedItemInput.feedElementType = ConnectApi.FeedElementType.FeedItem;
            feedItemInput.subjectId = opptyId; 
            feedItemInput.visibility = ConnectApi.FeedItemVisibilityType.AllUsers;
            // feedItemInput.parent = new ConnectAPI.UserDetail ();

      
            ConnectApi.FeedElement feedElement = ConnectApi.ChatterFeeds.postFeedElement(Network.getNetworkId(), feedItemInput);
            return feedElement.Id;     
        }
        catch(DmlException e){
               System.debug('The following exception has occurred: ' + e.getMessage());
            return null;
        }
    }

    @AuraEnabled
    public static FinServ__Alert__c createFinServAlert(String opptyId, String policyId, String message){
        List<FinServ__Alert__c> faList = new List<FinServ__Alert__c> ();
 
        try{
            faList = [SELECT Id FROM FinServ__Alert__c WHERE FinServ__Message__c = :message AND FinServ__Insurance_Policy__c =: policyId AND Opportunity__c = :opptyId];
            if (faList.size() > 0){
                return faList[0];
            }

            FinServ__Alert__c fa = new FinServ__Alert__c();
            fa.FinServ__Active__c = true;
            fa.FinServ__Insurance_Policy__c = policyId;
            fa.FinServ__Message__c = message;
            fa.Opportunity__c = opptyId;
            fa.FinServ__Severity__c = 'Warning';  
            insert fa; 
            return fa;  
        }  catch(DmlException e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            return null;
        } 
    }     

    @AuraEnabled
    public static void deleteFinServAlert(String opptyId){
        List<FinServ__Alert__c> faList = new List<FinServ__Alert__c>();
        try{
            faList = [SELECT Id FROM FinServ__Alert__c WHERE Opportunity__c = :opptyId];
            for(Integer i = 0; i < faList.size(); i++){
                faList[i].FinServ__Active__c = false;
            }
            update faList; 
        }  catch(DmlException e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
        } 
    }       

    @AuraEnabled
    public static Task createTask(String description, String opptyId, String subject, String taskOwner){
        List<Task> taskList = new List<Task>();
        Task t = new Task();
        try{ 
            taskList = [SELECT Id FROM Task WHERE whatId = :opptyId AND Subject = :subject];
            if (taskList.size() > 0){
                t = taskList[0];
            }
            
            t.Description = description;  
            t.whatId = opptyId;
            t.IsVisibleInSelfService = true;
            t.Subject = subject;
            t.Status = 'Not Started';
            t.ActivityDate = Date.today();
            if(taskOwner != null){
                t.OwnerId = taskOwner;
            }
            upsert t; 
            return t;
        }  catch(DmlException e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
            return null;
        } 
    }         

    @AuraEnabled
    public static void closeTask(String opptyId){
        List<Task> tList = new List<Task>();
        try{ 
            tList = [SELECT Id FROM Task WHERE WhatId = :opptyId];
            for(Integer i = 0; i < tList.size(); i++){
                tList[i].Status = 'Completed';
            }
            update tList; 
        }  catch(DmlException e) {
            System.debug('The following exception has occurred: ' + e.getMessage());
        } 
    }    


}
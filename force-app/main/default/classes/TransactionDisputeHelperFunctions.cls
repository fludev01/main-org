/*
 * Copyright 2022 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */

 /**
 * @description transaction dispute service process helper functions
*/

global with sharing class TransactionDisputeHelperFunctions implements Callable {
    public Object call(String action, Map<String, Object> args) {

        Map<String, Object> inputMap = (Map<String, Object>)args.get('input');
        Map<String, Object> outputMap = (Map<String, Object>)args.get('output');
        Map<String, Object> options = (Map<String, Object>)args.get('options');

        

        // invoke the post Connect API to create a SvcCatalogRequest
        if(action == 'callCreateCaseApi') {
            return createCaseServiceRequest(inputMap, outputMap);
        }
        return null;
    }

    private Object createCaseServiceRequest(Map<String, Object> inputMap, Map<String, Object> outputMap) {
        ConnectApi.ServiceProcessRequestInputRepresentation input = new ConnectApi.ServiceProcessRequestInputRepresentation();

        // add svcCatalogItemDefApiName
        String svcCatalogItemDefApiName = (String)inputMap.get('svcCatalogItemDefApiName');
        input.svcCatalogItemDefApiName = svcCatalogItemDefApiName;

  
        // add caseInfo
        input.caseInfo = new Map<String, ConnectApi.GenericObject>();
        ConnectApi.GenericObject caseSubject = new ConnectApi.GenericObject();
        caseSubject.value = 'Transaction Dispute Service Request';
        input.caseInfo.put('Subject', caseSubject);

       
        ConnectApi.GenericObject caseAccountId = new ConnectApi.GenericObject();
        String accountId = (String)inputMap.get('AccountId');
        caseAccountId.value = accountId;
        input.caseInfo.put('AccountId', caseAccountId);
        Object isCommunitySite = inputMap.get('isCommunitySite');
        ConnectApi.GenericObject caseOriginObj = new ConnectApi.GenericObject();
        if(isCommunitySite != null && Boolean.valueOf(isCommunitySite)) {
            caseOriginObj.value = 'Web';
        } else {
            caseOriginObj.value = 'Phone';
        }
        input.caseInfo.put('Origin', caseOriginObj);

        // add the attribute financial_account_id
        input.attributes = new Map<String, ConnectApi.GenericObject>();
        
        
        ConnectApi.GenericObject faObj = new ConnectApi.GenericObject();
        String financialAccountId = (String)inputMap.get('FinancialAccountId');
        faObj.value = financialAccountId;
        input.attributes.put('Financial_Account_Id', faObj);
        
        ConnectApi.GenericObject caseFAId = new ConnectApi.GenericObject();
        caseFAId.value = financialAccountId;
        input.caseInfo.put(getNamespacePrefix() + '__FinancialAccount__c', caseFAId);


        // add the attribute source_system_id
        ConnectApi.GenericObject sourceSystemObj = new ConnectApi.GenericObject();
        String sourceSystemId = (String)inputMap.get('SourceSystemId');
        sourceSystemObj.value = sourceSystemId;
        input.attributes.put('source_system_id', sourceSystemObj);


        // add the Dispute_Type
        ConnectApi.GenericObject disputeTypeObj = new ConnectApi.GenericObject();
        String disputeType = (String)inputMap.get('DisputeType');
        disputeTypeObj.value = disputeType;
        input.attributes.put('Dispute_Type', disputeTypeObj);




        // add the attribute ListOfTransactions
        ConnectApi.GenericObject transactionObj = new ConnectApi.GenericObject();
        List<Map<String, Object>> transactionList = new List<Map<String, Object>>();
        Object tranObj = inputMap.get('DisputedTransactions');
        if(tranObj != null) {
            Map<String, Object> transactions = (Map<String, Object>)tranObj;

            Map<String, Object> transactionMap = new Map<String, Object>();
            String tranId = (String)transactions.get('TransactionId');
            transactionMap.put('lot_Transaction_Id2', tranId);

            String tranDate = (String)transactions.get('TransactionPostedDate');
            transactionMap.put('lot_Transaction_Posted_Date', tranDate);

            String tranDesc = (String)transactions.get('TransactionDescription');
            transactionMap.put('lot_Transaction_Description', tranDesc);

            Double tranAmt = (Double)transactions.get('TransactionAmount');
            transactionMap.put('lot_Transaction_Amount', tranAmt);

            String tranAmtCurrency = (String)transactions.get('TransactionAmountCurrency');
            transactionMap.put('lot_Transaction_Amount_Currency', tranAmtCurrency);

            String tranCode = (String)transactions.get('TransactionCode');
            transactionMap.put('lot_Transaction_Code', tranCode);

            transactionList.add(transactionMap);
            transactionObj.value = transactionList;
            input.attributes.put('ListOfTransactions', transactionObj);
        }

         
        // add the Original_Transaction_Id
        ConnectApi.GenericObject origTxnObj = new ConnectApi.GenericObject();
        String origtxnid = (String)inputMap.get('OriginalTransactionId');
        origTxnObj.value = origtxnid;
        input.attributes.put('Original_Transaction_Id', origTxnObj);

        // add the Amount_On_Reciept
        ConnectApi.GenericObject amtOnRecieptObj = new ConnectApi.GenericObject();
        Double amtReciept = (Double)inputMap.get('AmountOnReciept');
        amtOnRecieptObj.value = amtReciept;
        input.attributes.put('Amount_On_Reciept', amtOnRecieptObj);
 
         // add the Date_Received
        ConnectApi.GenericObject DateReceivedObj = new ConnectApi.GenericObject();
        String dateReceived = (String)inputMap.get('DateReceived');
        DateReceivedObj.value = dateReceived;
        input.attributes.put('Date_Received', DateReceivedObj);

        // add the Date_Returned
        ConnectApi.GenericObject DateReturnedObj = new ConnectApi.GenericObject();
        String dateReturned = (String)inputMap.get('DateReturned');
        DateReturnedObj.value = dateReturned;
        input.attributes.put('Date_Returned', DateReturnedObj);

        // add the Expected_Delivery_Date
        ConnectApi.GenericObject expectedDelDateObj = new ConnectApi.GenericObject();
        String expectedDelDate = (String)inputMap.get('ExpectedDeliveryDate');
        expectedDelDateObj.value = expectedDelDate;
        input.attributes.put('Expected_Delivery_Date', expectedDelDateObj);

        // add the Date_Merchant_Contacted_NotRecd
        ConnectApi.GenericObject dateMerchContactedNRObj = new ConnectApi.GenericObject();
        String dateMerchContactedNR = (String)inputMap.get('DateMerchContactedNR');
        dateMerchContactedNRObj.value = dateMerchContactedNR;
        input.attributes.put('Date_Merchant_Contacted_NotRecd', dateMerchContactedNRObj);

        // add the Merchant_Response_NotRecd
        ConnectApi.GenericObject merchResponseNRObj = new ConnectApi.GenericObject();
        String merchResponseNR = (String)inputMap.get('MerchResponseNR');
        merchResponseNRObj.value = merchResponseNR;
        input.attributes.put('Merchant_Response_NotRecd', merchResponseNRObj);

        // add the Date_Merchant_Contacted_Unknown
        ConnectApi.GenericObject dateMerchContactedUKObj = new ConnectApi.GenericObject();
        String dateMerchContactedUK = (String)inputMap.get('DateMerchContactedUK');
       dateMerchContactedUKObj.value = dateMerchContactedUK;
        input.attributes.put('Date_Merchant_Contacted_Unknown', dateMerchContactedUKObj);

        // add the Merchant_Response_Unknown
        ConnectApi.GenericObject merchResponseUKObj = new ConnectApi.GenericObject();
        String merchResponseUK = (String)inputMap.get('MerchResponseUK');
        merchResponseUKObj.value = merchResponseUK;
        input.attributes.put('Merchant_Response_Unknown', merchResponseUKObj);

        // add the Amount_Authorized
        ConnectApi.GenericObject amtAuthObj = new ConnectApi.GenericObject();
        Double amtAuth = (Double)inputMap.get('AmountAuthorized');
        amtAuthObj.value = amtAuth;
        input.attributes.put('Amount_Authorized', amtAuthObj);

        // add the Date_Merchant_Notified_Subscription
        ConnectApi.GenericObject dateMerchNotifiedSubObj = new ConnectApi.GenericObject();
        String dateMerchNotifiedSub = (String)inputMap.get('DateMerchNotifiedSub');
        dateMerchNotifiedSubObj.value = dateMerchNotifiedSub;
        input.attributes.put('Date_Merchant_Notified_Subscription', dateMerchNotifiedSubObj);

        // add the Reason_for_Cancellation
        ConnectApi.GenericObject reasonForCancellationObj = new ConnectApi.GenericObject();
        String reasonForCancellation = (String)inputMap.get('ReasonForCancellation');
        reasonForCancellationObj.value = reasonForCancellation;
        input.attributes.put('Reason_for_Cancellation', reasonForCancellationObj);

        // add the Cancellation_Date
        ConnectApi.GenericObject cancellationDateObj = new ConnectApi.GenericObject();
        String cancellationDate = (String)inputMap.get('CancellationDate');
        cancellationDateObj.value = cancellationDate;
        input.attributes.put('Cancellation_Date', cancellationDateObj);

        // add the Cancellation_Confirmation_Number
        ConnectApi.GenericObject cancellationConfirmObj = new ConnectApi.GenericObject();
        String cancellationConfirm = (String)inputMap.get('CancellationConfirmationNumber');
        cancellationConfirmObj.value = cancellationConfirm;
        input.attributes.put('Cancellation_Confirmation_Number', cancellationConfirmObj);

        // add the Other_Reason
        ConnectApi.GenericObject otherReasonObj = new ConnectApi.GenericObject();
        String otherReason = (String)inputMap.get('OtherReason');
        otherReasonObj.value = otherReason;
        input.attributes.put('Other_Reason', otherReasonObj);

        
       //new fields start here
       
        
        // add the Provisional_Credit_Percentage
        ConnectApi.GenericObject provcreditpctgobj = new ConnectApi.GenericObject();
        Double provCreditPctg = (Double)inputMap.get('ProvisionalCreditPercentage');
        provcreditpctgobj.value = provCreditPctg;
        input.attributes.put('Provisional_Credit_Percentage', provcreditpctgobj);

        // add the Provisional_Credit_Given
        ConnectApi.GenericObject provcreditgvnobj = new ConnectApi.GenericObject();
        Double provCreditAmt = (Double)inputMap.get('ProvisionalCreditAmount');
        provcreditgvnobj.value = provCreditAmt;
        input.attributes.put('Provisional_Credit_Given', provcreditgvnobj);
        


		// add the Other_Suspicious_Activity
        ConnectApi.GenericObject othersusactobj = new ConnectApi.GenericObject();
        String susActivity = (String)inputMap.get('SusActivity');
        othersusactobj.value = susActivity;
        input.attributes.put('Other_Suspicious_Activity', othersusactobj);
  
		// add the Permission_Given_To_Others
        ConnectApi.GenericObject permgivenobj = new ConnectApi.GenericObject();
        String permGiven = (String)inputMap.get('PermGiven');
        permgivenobj.value = permGiven;
        input.attributes.put('Permission_Given_To_Others', permgivenobj);        
       
        // add the Any_Additional_Details_Given
        ConnectApi.GenericObject addldetailsobj = new ConnectApi.GenericObject();
        String addlDetails = (String)inputMap.get('AddlDetails');
        addldetailsobj.value = addlDetails;
        input.attributes.put('Any_Additional_Details_Given', addldetailsobj); 

		// add the Financial_Account_Link
        ConnectApi.GenericObject finacctlinkobj = new ConnectApi.GenericObject();
        String finAcctLink = (String)inputMap.get('SelectedFA');
        finacctlinkobj.value = finAcctLink;
        input.attributes.put('Financial_Account_Link', finacctlinkobj);  
        
        // add the Financial_Account_Name
        ConnectApi.GenericObject fanameobj = new ConnectApi.GenericObject();
        String finAcctName = (String)inputMap.get('Faname');
        fanameobj.value = finAcctName;
        input.attributes.put('Financial_Account_Name', fanameobj);
    
        // add the Financial_Account_Type
        ConnectApi.GenericObject fatypeobj = new ConnectApi.GenericObject();
        String finAcctType = (String)inputMap.get('Fatype');
        fatypeobj.value = finAcctType;
        input.attributes.put('Financial_Account_Type', fatypeobj);
        
        // add the Financial_Account_Last_4_Digits
        ConnectApi.GenericObject falast4obj = new ConnectApi.GenericObject();
        String finAcctLast4 = (String)inputMap.get('FALast4');
        falast4obj.value = finAcctLast4;
        input.attributes.put('Financial_Account_Last_4_Digits', falast4obj);
       

        
        // Invoke API and set the response
        ConnectApi.ServiceProcessRepresentation output = ConnectApi.IServiceProcessConnectFamily.createCaseServiceProcess(input);
        Map<String, String> responseMap = new Map<String, String>();
        responseMap.put('caseId', output.caseId);
        responseMap.put('caseNumber', output.caseNumber);
        responseMap.put('svcCatalogRequestId', output.svcCatalogRequestId);
        outputMap.put('apiResponse', responseMap);

        return outputMap;
    }

  
    private String getNamespacePrefix() {
         ApexClass ac = [SELECT NamespacePrefix FROM ApexClass WHERE Name = 'PrepareQueryStatement'];
         return ac.NameSpacePrefix;
    }
}
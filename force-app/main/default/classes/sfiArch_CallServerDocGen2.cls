/**
 * This class exposes a method that can be invoked by Salesforce Process Builder.  It calls an Integration Procedure
 * that can send an email.
 *
 * @author Joe McMaster (jmcmaster@salesforce.com)  
 * @author Dean Fischesser (dfischesser@salesforce.com)
 *
 * @version 1.0
 *
 * History
 * =======
 * 1.0 - Apr 3, 2019 - Initial Version (Email Sample)
 * 2.0 - Mar 7, 2022 - Modifed by Dean to strucutre for calling Document Generation from a Salesforce Flow
 *
 */

global class sfiArch_CallServerDocGen2 {
    @InvocableMethod (label = 'DocGen ServerSide2')

      global static List<IntegrationProcedureActionOutput>  callDocGenServer(List<IntegrationProcedureActionInput> input)  {
       
       /* Initialize variables */
            Map<String, Object> ipInput = new Map<String, Object> ();
            Map<String, Object> ipOutput = new Map<String, Object> ();
            Map<String, Object> ipOptions = new Map<String, Object> ();

       /* Get values passed into the class */
            ipInput.put('templateId',input[0].documentTemplateId);
            ipInput.put('objectId',input[0].documentTemplateDrObjectId);
          	ipInput.put('title',input[0].docTitleVar);
          	ipInput.put('outputFileFormat',input[0].fileFormatVar);

            
            /* Call the IP via runIntegrationService, 
            and save the output to ipOutput */
            ipOutput = (Map<String, Object>) omnistudio.IntegrationProcedureService.runIntegrationService(input[0].procedureAPIName, ipInput, ipOptions);
            IntegrationProcedureActionOutput outputValues = new IntegrationProcedureActionOutput();
            
            if(ipOutput.containsKey('isSuccessfulTransaction')){
                outputValues.docContentVersionId = String.valueOf(ipOutput.get('docContentVersionId')) ;
                outputValues.errorMessage = String.valueOf(ipOutput.get('errorMessage')) ;
                outputValues.isSuccessfulTransaction = String.valueOf(ipOutput.get('isSuccessfulTransaction')) ;
                outputValues.jobId = String.valueOf(ipOutput.get('jobId')) ;
                outputValues.pdfContentVersionId = String.valueOf(ipOutput.get('pdfContentVersionId')) ;
            }

            List<IntegrationProcedureActionOutput> returnedValues = new List<IntegrationProcedureActionOutput>();
            returnedValues.add(outputValues);       

            return returnedValues;      
    }

       /* Input class */
       global class IntegrationProcedureActionInput {
       
           @InvocableVariable(label=' Integration Procedure Type_Subtype')
           global String procedureAPIName;        
    
           @InvocableVariable(label='Document Template Id')
           global String documentTemplateId;
           
           @InvocableVariable(label='Source Object Id for DocTemplate DR')
           global String documentTemplateDrObjectId;
           
           @InvocableVariable(label='Document Title')
           global String docTitleVar;
           
           @InvocableVariable(label='File Format')
           global String fileFormatVar;
           
        
       }
  
       /* Output class */
       global class IntegrationProcedureActionOutput {
     
           @InvocableVariable(label='docContentVersionId')
           global String docContentVersionId;
         
           @InvocableVariable(label='errorMessage')
           global String errorMessage;
         
           @InvocableVariable(label='isSuccessfulTransaction')
           global String isSuccessfulTransaction;
         
           @InvocableVariable(label='jobId')
           global String jobId;
           
           @InvocableVariable(label='pdfContentVersionId')
           global String pdfContentVersionId;
         
       } 
 }
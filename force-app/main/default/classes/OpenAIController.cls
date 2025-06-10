public without sharing class OpenAIController {
    private static String CHAT_GPT_KEY = OpenAiKey__c.getOrgDefaults().Key__c; //Custom Setting
    //private static final String ENDPOINT ='https://bot-svc-llm.sfproxy.einsteintest1.test1-uswest2.aws.sfdc.cl/v1.0/generations';
    private static final String ENDPOINT ='https://api.openai.com/v1/chat/completions';

    @AuraEnabled
    public static String getResponse(String searchString){
        try{
            searchString = (searchString).trim();
            searchString = (searchString).replaceAll('\n','').replaceAll('\r','');
            String seachQueryEscaped = (searchString).trim();
            Http http = new Http();
            String reqBody = '{ "model": "gpt-3.5-turbo", "messages": [{"role": "user", "content": "'+seachQueryEscaped+'"}] }';
            System.debug('Query '+seachQueryEscaped+' '+reqBody);
            HttpRequest request = new HttpRequest();
            request.setEndpoint(ENDPOINT);
            request.setMethod('POST');
            request.setHeader('Authorization', 'Bearer '+String.escapeSingleQuotes(CHAT_GPT_KEY).trim());
            //Setting timeout to max 120 second to get whole response from Chat GPT Open API
            request.setTimeout(120000);
            request.setHeader('Content-Type', 'application/json;charset=UTF-8');
            // Set the body as a JSON object
            request.setBody(reqBody);
            HttpResponse response = http.send(request);
            // Parse the JSON response
            if(response.getStatusCode() != 200) {
                System.debug('The status code returned was not expected: ' + response.getStatusCode() + ' ' + response.getBody());
                return response.getBody();
            }
            return response.getBody();
            /*
            Http http = new Http();
            String requestBody = '{"prompt": "'+searchString+'","temperature": 0.5,"max_tokens": 512}';
            system.debug(requestBody);
            HttpRequest request = new HttpRequest();
            request.setEndpoint(ENDPOINT);
            request.setMethod('POST');
            request.setHeader('Content-Type', 'application/json');
            request.setHeader('Authorization', 'API_KEY '+String.escapeSingleQuotes(CHAT_GPT_KEY).trim());
            request.setHeader('X-Org-Id', '00DDn00000CXENB');
            request.setHeader('X-LLM-Provider', 'OpenAI');
            request.setHeader('X-B3-Parentspanid', 'HK3OV9CvYUMnEpwy');
            request.setHeader('X-B3-Spanid', 'aH28teOosjEBp9Yw');
            request.setHeader('X-B3-Traceid', 'qF7Atq7U5fwP3e23');
            request.setHeader('X-Envoy-Upstream-Service-Time', '1019');
            request.setHeader('X-Request-Id', '3b4090ec-9638-5224-b2da-011abcadb159');
            //Setting timeout to max 120 second to get whole response from Chat GPT Open API
            request.setTimeout(120000);
            // Set the body as a JSON object
            request.setBody(requestBody);
            HttpResponse response = http.send(request);
            // Parse the JSON response
            if(response.getStatusCode() != 200) {
                System.debug('The status code returned was not expected: ' + response.getStatusCode() + ' ' + response.getBody());
                return response.getBody();
            }
            return response.getBody();
            */
        }catch(Exception ex){
            System.debug('Exception in Catch of Server-Side Controller '+ex);
            throw new AuraHandledException(ex.getMessage());
        }
    }
}
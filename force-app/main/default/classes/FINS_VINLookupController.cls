// Apex Controller
public class FINS_VINLookupController {
    @AuraEnabled
    public static string getVINDetails(String input) {
        String url = 'https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/' + input + '?format=json';
        System.debug('>>' + url);
        String response = getResponse(url);
        return response;
    }
    
    public static string getResponse(string strURL){
        Http h = new Http();
        HttpRequest req = new HttpRequest();
        HttpResponse res = new HttpResponse();
        req.setMethod('GET');
        req.setEndpoint(strURL); 
        req.setTimeout(120000);
        res = h.send(req); 
        String responseBody = res.getBody(); 
        return responseBody;
    }
}
public class einsteinBulkAction_JC {
    public string query{get; set;}
    public PageReference init() {
        query = ApexPages.currentPage().getParameters().get('query');
        return null;
    }   
}
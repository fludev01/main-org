public class FINS_EinsteinAwesomeController {  

    @AuraEnabled
    public static string getLeadStuff(String leadid) {
        Lead leadyay = [select name, title, company, city, FINS_escore__c, FINS_CustomL__c,
        FINS_Indicator_1_Positive__c, FINS_Top_Predictive_1__c, FINS_Top_Predictive_Result_1__c, FINS_Indicator_1_Strength__c,  
        FINS_Indicator_2_Positive__c, FINS_Top_Predictive_2__c, FINS_Top_Predictive_Result_2__c, FINS_Indicator_2_Strength__c,
        FINS_Indicator_3_Positive__c, FINS_Top_Predictive_3__c, FINS_Top_Predictive_Result_3__c, FINS_Indicator_3_Strength__c,
        FINS_Indicator_4_Positive__c, FINS_Top_Predictive_4__c, FINS_Top_Predictive_Result_4__c, FINS_Indicator_4_Strength__c,
        FINS_Indicator_5_Positive__c, FINS_Top_Predictive_5__c, FINS_Top_Predictive_Result_5__c, FINS_Indicator_5_Strength__c  from Lead where Id = :leadid];
        
        String namey = leadyay.name + '#*#' + leadyay.title + '#*#' + leadyay.company + '#*#' + leadyay.city + '#*#' + leadyay.FINS_escore__c + '#*#' + leadyay.FINS_Indicator_1_Positive__c + '#*#' + leadyay.FINS_Top_Predictive_1__c + '#*#' + leadyay.FINS_Top_Predictive_Result_1__c + '#*#' + leadyay.FINS_Indicator_2_Positive__c + '#*#' + leadyay.FINS_Top_Predictive_2__c + '#*#' + leadyay.FINS_Top_Predictive_Result_2__c + '#*#' + leadyay.FINS_Indicator_3_Positive__c + '#*#' + leadyay.FINS_Top_Predictive_3__c + '#*#' + leadyay.FINS_Top_Predictive_Result_3__c + '#*#' + leadyay.FINS_Indicator_4_Positive__c + '#*#' + leadyay.FINS_Top_Predictive_4__c + '#*#' + leadyay.FINS_Top_Predictive_Result_4__c + '#*#' + leadyay.FINS_Indicator_5_Positive__c + '#*#' + leadyay.FINS_Top_Predictive_5__c + '#*#' + leadyay.FINS_Top_Predictive_Result_5__c + '#*#' + leadyay.FINS_CustomL__c + '#*#' + leadyay.FINS_Indicator_1_Strength__c + '#*#' + leadyay.FINS_Indicator_2_Strength__c + '#*#' + leadyay.FINS_Indicator_3_Strength__c + '#*#' + leadyay.FINS_Indicator_4_Strength__c + '#*#' + leadyay.FINS_Indicator_5_Strength__c;
        return namey;
    }
    
    
    @AuraEnabled
    public static string getOpptyStuff(String opptyid) {
        Opportunity opptyay = [select Account.name, CloseDate,
        FINS_Last_Activity_Text__c, FINS_Last_Activity_Type__c, FINS_Last_Activity_Subject__c,
        FINS_Name_of_Contact__c, FINS_Competitor_they_Mentioned__c,
        FINS_Slowing_Reason__c, FINS_Boosting_Reason__c, Name from Opportunity where Id = :opptyid];
        
        string datetimestr =  opptyay.CloseDate.format();  
        
        String namey = opptyay.Account.name + '#*#' + datetimestr + '#*#' + opptyay.FINS_Last_Activity_Subject__c + '#*#' + opptyay.FINS_Last_Activity_Text__c + '#*#' + opptyay.FINS_Last_Activity_Type__c + '#*#' + opptyay.FINS_Name_of_Contact__c + '#*#' + opptyay.FINS_Competitor_they_Mentioned__c + '#*#' + opptyay.FINS_Slowing_Reason__c + '#*#' + opptyay.FINS_Boosting_Reason__c + '#*#' + opptyay.Name; 
        return namey;
    }
    
    @AuraEnabled
    public static string getMoreOpptyStuff(String opptyid) {
        Opportunity opptyay = [select Account.name, CloseDate,
        FINS_Last_Activity_Text__c, FINS_Last_Activity_Type__c, FINS_Last_Activity_Subject__c,
        FINS_Winning_Unlikely__c, FINS_Prospect_Unresponsive__c, 
        FINS_Competitor_Mentioned__c, FINS_Name_of_Contact__c, FINS_Competitor_they_Mentioned__c,
        FINS_Deal_Slowing__c, FINS_Slowing_Reason__c, FINS_Deal_boosting__c, FINS_Boosting_Reason__c,
        FINS_Time_Consuming_Oppty__c, FINS_No_Communication__c, FINS_Re_engaged__c, FINS_Task_Overdue__c, 
        FINS_Email_Subject__c, FINS_Email_Body__c,  
        FINS_Contact_to_email__c, FINS_Contact_to_email__r.name, FINS_Contact_to_email__r.email  from Opportunity where Id = :opptyid];
        
        string datetimestr =  opptyay.CloseDate.format();  
    

        
        String namey = opptyay.Account.name + '#*#' + datetimestr + '#*#' + opptyay.FINS_Last_Activity_Subject__c + '#*#' + opptyay.FINS_Last_Activity_Text__c + '#*#' + opptyay.FINS_Last_Activity_Type__c + '#*#' + opptyay.FINS_Winning_Unlikely__c + '#*#' + opptyay.FINS_Prospect_Unresponsive__c + '#*#' + opptyay.FINS_Competitor_Mentioned__c + '#*#' + opptyay.FINS_Name_of_Contact__c + '#*#' + opptyay.FINS_Competitor_they_Mentioned__c + '#*#' + opptyay.FINS_Deal_Slowing__c + '#*#' + opptyay.FINS_Slowing_Reason__c + '#*#' + opptyay.FINS_Deal_boosting__c + '#*#' + opptyay.FINS_Boosting_Reason__c + '#*#' + opptyay.FINS_Time_Consuming_Oppty__c + '#*#' + opptyay.FINS_No_Communication__c + '#*#' + opptyay.FINS_Re_engaged__c + '#*#' + opptyay.FINS_Task_Overdue__c + '#*#' + opptyay.FINS_Email_Subject__c + '#*#' + opptyay.FINS_Email_Body__c + '#*#' + opptyay.FINS_Contact_to_email__c + '#*#' + opptyay.FINS_Contact_to_email__r.name + '#*#' + opptyay.FINS_Contact_to_email__r.email;
        return namey;
    }
    
    @AuraEnabled
    public static string getAccountStuff(String accountid) {
        Account acctyay = [select name, FINS_Einstein_Account_Insights__c,
        FINS_Einstein_Article_1_Title__c, FINS_Einstein_Article_2_Title__c, FINS_Einstein_Article_3_Title__c,
        FINS_Einstein_Article_1_Source__c, FINS_Einstein_Article_2_Source__c, FINS_Einstein_Article_3_Source__c,
        FINS_Einstein_Article_1_Date__c, FINS_Einstein_Article_2_Date__c, FINS_Einstein_Article_3_Date__c,
        FINS_Einstein_Article_1_URL__c, FINS_Einstein_Article_2_URL__c, FINS_Einstein_Article_3_URL__c from Account where Id = :accountid];
         
        Date articleDate1 = acctyay.FINS_Einstein_Article_1_Date__c;
        if(articleDate1 == null){
            articleDate1 = Date.today();
        }
        Date articleDate2 = acctyay.FINS_Einstein_Article_2_Date__c;
        if(articleDate2 == null){
            articleDate2 = Date.today();
        }
        Date articleDate3 = acctyay.FINS_Einstein_Article_3_Date__c;
        if(articleDate3 == null){
            articleDate3 = Date.today();
        }
        Date todayDate = Date.today();
        Integer daysbetween1 = articleDate1.daysBetween(todayDate);
        Integer daysbetween2 = articleDate2.daysBetween(todayDate);
        Integer daysbetween3 = articleDate3.daysBetween(todayDate);
                    
        String namey = acctyay.name + '#*#' + acctyay.FINS_Einstein_Account_Insights__c + '#*#' + acctyay.FINS_Einstein_Article_1_Title__c + '#*#' + daysbetween1 + '#*#' + acctyay.FINS_Einstein_Article_1_Source__c + '#*#' + acctyay.FINS_Einstein_Article_1_URL__c + '#*#' + acctyay.FINS_Einstein_Article_2_Title__c + '#*#' + daysbetween2 + '#*#' + acctyay.FINS_Einstein_Article_2_Source__c + '#*#' + acctyay.FINS_Einstein_Article_2_URL__c + '#*#' + acctyay.FINS_Einstein_Article_3_Title__c + '#*#' + daysbetween3 + '#*#' + acctyay.FINS_Einstein_Article_3_Source__c + '#*#' + acctyay.FINS_Einstein_Article_3_URL__c;
        return namey;
    }
    
    @AuraEnabled
    public static string getHomeLeadStuff(String emailis) {
        Lead leadyay = [select name, title, company, city, FINS_escore__c, FINS_CustomL__c,
        FINS_Indicator_1_Positive__c, FINS_Top_Predictive_1__c, FINS_Top_Predictive_Result_1__c, FINS_Indicator_1_Strength__c,  
        FINS_Indicator_2_Positive__c, FINS_Top_Predictive_2__c, FINS_Top_Predictive_Result_2__c, FINS_Indicator_2_Strength__c,
        FINS_Indicator_3_Positive__c, FINS_Top_Predictive_3__c, FINS_Top_Predictive_Result_3__c, FINS_Indicator_3_Strength__c,
        FINS_Indicator_4_Positive__c, FINS_Top_Predictive_4__c, FINS_Top_Predictive_Result_4__c, FINS_Indicator_4_Strength__c,
        FINS_Indicator_5_Positive__c, FINS_Top_Predictive_5__c, FINS_Top_Predictive_Result_5__c, FINS_Indicator_5_Strength__c, Id  from Lead where Email = :emailis];
        
        String namey = leadyay.name + '#*#' + leadyay.title + '#*#' + leadyay.company + '#*#' + leadyay.city + '#*#' + leadyay.FINS_escore__c + '#*#' + leadyay.FINS_Indicator_1_Positive__c + '#*#' + leadyay.FINS_Top_Predictive_1__c + '#*#' + leadyay.FINS_Top_Predictive_Result_1__c + '#*#' + leadyay.FINS_Indicator_2_Positive__c + '#*#' + leadyay.FINS_Top_Predictive_2__c + '#*#' + leadyay.FINS_Top_Predictive_Result_2__c + '#*#' + leadyay.FINS_Indicator_3_Positive__c + '#*#' + leadyay.FINS_Top_Predictive_3__c + '#*#' + leadyay.FINS_Top_Predictive_Result_3__c + '#*#' + leadyay.FINS_Indicator_4_Positive__c + '#*#' + leadyay.FINS_Top_Predictive_4__c + '#*#' + leadyay.FINS_Top_Predictive_Result_4__c + '#*#' + leadyay.FINS_Indicator_5_Positive__c + '#*#' + leadyay.FINS_Top_Predictive_5__c + '#*#' + leadyay.FINS_Top_Predictive_Result_5__c + '#*#' + leadyay.FINS_CustomL__c + '#*#' + leadyay.FINS_Indicator_1_Strength__c + '#*#' + leadyay.FINS_Indicator_2_Strength__c + '#*#' + leadyay.FINS_Indicator_3_Strength__c + '#*#' + leadyay.FINS_Indicator_4_Strength__c + '#*#' + leadyay.FINS_Indicator_5_Strength__c + '#*#' + leadyay.Id;
        return namey;
    }
    
    
    @AuraEnabled
    public static string getHomeOpptyStuff(String nameis) {
        Opportunity opptyay = [select Account.name, CloseDate,
        FINS_Last_Activity_Text__c, FINS_Last_Activity_Type__c, FINS_Last_Activity_Subject__c,
        FINS_Name_of_Contact__c, FINS_Competitor_they_Mentioned__c,
        FINS_Slowing_Reason__c, FINS_Boosting_Reason__c, Name, Id from Opportunity where Name = :nameis];
        
        string datetimestr =  opptyay.CloseDate.format();  
        
        String namey = opptyay.Account.name + '#*#' + datetimestr + '#*#' + opptyay.FINS_Last_Activity_Subject__c + '#*#' + opptyay.FINS_Last_Activity_Text__c + '#*#' + opptyay.FINS_Last_Activity_Type__c + '#*#' + opptyay.FINS_Name_of_Contact__c + '#*#' + opptyay.FINS_Competitor_they_Mentioned__c + '#*#' + opptyay.FINS_Slowing_Reason__c + '#*#' + opptyay.FINS_Boosting_Reason__c + '#*#' + opptyay.Name + '#*#' + opptyay.Id; 
        return namey;
    }
    
    @AuraEnabled
    public static string getHomeAccountStuff(String nameis) {
        Account acctyay = [select name, FINS_Einstein_Account_Insights__c,
        FINS_Einstein_Article_1_Title__c, FINS_Einstein_Article_2_Title__c, FINS_Einstein_Article_3_Title__c,
        FINS_Einstein_Article_1_Source__c, FINS_Einstein_Article_2_Source__c, FINS_Einstein_Article_3_Source__c,
        FINS_Einstein_Article_1_Date__c, FINS_Einstein_Article_2_Date__c, FINS_Einstein_Article_3_Date__c,
        FINS_Einstein_Article_1_URL__c, FINS_Einstein_Article_2_URL__c, FINS_Einstein_Article_3_URL__c, Id from Account where Name = :nameis];
         
        Date articleDate1 = acctyay.FINS_Einstein_Article_1_Date__c;
        if(articleDate1 == null){
            articleDate1 = Date.today();
        }
        Date articleDate2 = acctyay.FINS_Einstein_Article_2_Date__c;
        if(articleDate2 == null){
            articleDate2 = Date.today();
        }
        Date articleDate3 = acctyay.FINS_Einstein_Article_3_Date__c;
        if(articleDate3 == null){
            articleDate3 = Date.today();
        }
        Date todayDate = Date.today();
        Integer daysbetween1 = articleDate1.daysBetween(todayDate);
        Integer daysbetween2 = articleDate2.daysBetween(todayDate);
        Integer daysbetween3 = articleDate3.daysBetween(todayDate);
                    
        String namey = acctyay.name + '#*#' + acctyay.FINS_Einstein_Account_Insights__c + '#*#' + acctyay.FINS_Einstein_Article_1_Title__c + '#*#' + daysbetween1 + '#*#' + acctyay.FINS_Einstein_Article_1_Source__c + '#*#' + acctyay.FINS_Einstein_Article_1_URL__c + '#*#' + acctyay.FINS_Einstein_Article_2_Title__c + '#*#' + daysbetween2 + '#*#' + acctyay.FINS_Einstein_Article_2_Source__c + '#*#' + acctyay.FINS_Einstein_Article_2_URL__c + '#*#' + acctyay.FINS_Einstein_Article_3_Title__c + '#*#' + daysbetween3 + '#*#' + acctyay.FINS_Einstein_Article_3_Source__c + '#*#' + acctyay.FINS_Einstein_Article_3_URL__c + '#*#' + acctyay.Id;
        return namey;
    }
}
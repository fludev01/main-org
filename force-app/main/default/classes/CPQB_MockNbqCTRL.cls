public with sharing class CPQB_MockNbqCTRL {

    @AuraEnabled
    public static Product2 getProductDetails(Id productId) {
        return [SELECT Id, Name FROM Product2 WHERE Id =:productId];
    }

    @AuraEnabled
    public static Id generateQuote(Id recordId, Id recProductId, String currencyISOCode) {
        Integer subTerm = 12;
        System.debug('Record Id: ' + recordId);
        System.debug('Product Id: ' + recProductId);
        // Need Std Pricebook and currency code to load in product models
        Id stdPriceBook = getPriceBookId();

        ProductModel[] listOfProds = new ProductModel[]{};

        // load in the product model
        ProductModel prodToAdd = readProduct(recProductId, stdPriceBook, currencyISOCode);
        listOfProds.add(prodToAdd);
        System.debug(JSON.serializePretty(prodToAdd));


        Date startDate = System.today();
        Id quoteId = createOppAndQuote(recordId, subTerm);
        QuoteModel newQuoteModel = readQuote(quoteId);

        QuoteModel quoteWithProds = addProduct(newQuoteModel, listOfProds, 0);
        System.debug(quoteWithProds);

        // Continuation should now work properly in SF lightning
        calculateQuote(quoteWithProds, 'CPQB_MockNbqCallback');

        return quoteWithProds.record.Id;
    }

    public static Id getPriceBookId() {
        if(Test.isRunningTest()) {
            return Test.getStandardPricebookId();
        } else {
            return [SELECT Id, IsStandard FROM Pricebook2 WHERE IsStandard = TRUE LIMIT 1].Id;
        }
    }

    public static Id convertToAccAndOpp(Id recordId, Integer subTerm) {
        String emailAddr = [SELECT Id, Email FROM Lead WHERE Id =:recordId].Email;
        Database.LeadConvert leadConversion = new Database.LeadConvert();
        leadConversion.setLeadId(recordId);

        LeadStatus convertStatus = [SELECT Id, MasterLabel FROM LeadStatus WHERE IsConverted=true LIMIT 1];
        leadConversion.setConvertedStatus(convertStatus.MasterLabel);

        Database.LeadConvertResult conversionResult = Database.convertLead(leadConversion);
        System.assert(conversionResult.isSuccess());
        Id oppId = conversionResult.getOpportunityId();
        Id accId = conversionResult.getAccountId();

        // Get Std Pricebook
        Id stdPriceBook = getPriceBookId();
        // Initialize New Quote
        SBQQ__Quote__c q = new SBQQ__Quote__c(SBQQ__Type__c='Quote',
                                              SBQQ__Status__c='Draft',
                                              SBQQ__Primary__c=true,
                                              SBQQ__SubscriptionTerm__c=subTerm,
                                              SBQQ__StartDate__c=System.Today().addDays(1),
                                              SBQQ__ExpirationDate__c=System.Today().addMonths(1),
                                              SBQQ__PricebookId__c = stdPriceBook
                                             );
        
        // Link to Opportunity and Account if Ids are set
        if(oppId != null) {
            q.SBQQ__Opportunity2__c=oppId;
        }
        if(accId != null) {
            q.SBQQ__Account__c=accId;
        }

        // Insert the quote
        try {
            Database.insert(q);
            System.debug('Successfully inserted new Quote: ' + q.Id);
        } catch (DmlException e) {
            System.debug('An error occurred inserting the Quote: ' + e);
            System.debug('Stack trace:' + e.getStackTraceString());
            throw new AuraHandledException(e.getMessage());
        }
        
        return q.Id;
    }

    public static Id createOppAndQuote(Id recordId, Integer subTerm) {
        Id oppId;
        Id accId;
        // Get Std Pricebook
        Id stdPriceBook = getPriceBookId();

        Date realStart = System.today();
        
        SObjectType thisObjectType = recordId.getSobjectType();
        System.debug(thisObjectType);
        
        // if lead
        if(Lead.getSObjectType() == thisObjectType) {
            return convertToAccAndOpp(recordId, subTerm);
        }
        
        // Check if Record id is account
        if(Account.getSObjectType() == thisObjectType) {
            accId = recordId;
            // create opp
            Opportunity newOpp = new Opportunity(AccountId=recordId,
                                                Name='Einstein Opportunity',
                                                Pricebook2Id=stdPriceBook,
                                                CloseDate=realStart.addMonths(2),
                                                StageName='Qualification');
            // Insert the Opp
            try {
                Database.insert(newOpp);
                System.debug('Successfully inserted new Opp: ' + newOpp.Id);
            } catch (DmlException e) {
                System.debug('An error occurred inserting the Opportunity: ' + e);
                System.debug('Stack trace:' + e.getStackTraceString());
                throw new AuraHandledException(e.getMessage());
            }
            oppId = newOpp.Id;
        }

        // Check if Record type is Opp
        if(Opportunity.getSObjectType() == thisObjectType) {
            // if opp use the existing one and try to grab the account Id
            oppId = recordId;
            List<Opportunity> theOpp = [SELECT Id, AccountId FROM Opportunity WHERE Id =: oppId];
            if (theOpp.size() > 0 && theOpp[0].AccountId != null) {
                accId = theOpp[0].AccountId;
            }
        }

        // Initialize New Quote
        SBQQ__Quote__c q = new SBQQ__Quote__c(SBQQ__Type__c='Quote',
                                              SBQQ__Status__c='Draft',
                                              SBQQ__Primary__c=true,
                                              SBQQ__SubscriptionTerm__c=subTerm,
                                              SBQQ__StartDate__c=realStart.addDays(1),
                                              SBQQ__ExpirationDate__c=realStart.addMonths(2),
                                              SBQQ__PricebookId__c = stdPriceBook
                                             );
        
        // Link to Opportunity and Account if Ids are set
        if(oppId != null) {
            q.SBQQ__Opportunity2__c=oppId;
        }
        if(accId != null) {
            q.SBQQ__Account__c=accId;
        }

        // Insert the quote
        try {
            Database.insert(q);
            System.debug('Successfully inserted new Quote: ' + q.Id);
        } catch (DmlException e) {
            System.debug('An error occurred inserting the Quote: ' + e);
            System.debug('Stack trace:' + e.getStackTraceString());
            throw new AuraHandledException(e.getMessage());
        }
        
        return q.Id;
    }

    /*
    * CPQ Product APIs
    */
    public static QuoteModel addProduct(QuoteModel quote, ProductModel[] products, Integer groupKey) {
        AddProductsContext ctx = new AddProductsContext(quote, products, groupKey);
        String quoteJSON = SBQQ.ServiceRouter.load('SBQQ.QuoteAPI.QuoteProductAdder', null, JSON.serialize(ctx));
        return (QuoteModel) JSON.deserialize(quoteJSON, QuoteModel.class);
    }
    
    private class AddProductsContext {
        private QuoteModel quote;
        private ProductModel[] products;
        private Integer groupKey;
        private final Boolean ignoreCalculate = true; //Must be hardcoded to true
        
        private AddProductsContext(QuoteModel quote, ProductModel[] products, Integer groupKey) {
            this.quote = quote;
            this.products = products;
            this.groupKey = groupKey;
        }
    }
    
    public static ProductModel readProduct(Id productId, Id pricebookId, String currencyCode) {
        ProductReaderContext ctx = new ProductReaderContext(pricebookId, currencyCode);
        String productJSON = SBQQ.ServiceRouter.load('SBQQ.ProductAPI.ProductLoader',
                                                     productId, JSON.serialize(ctx));
        return (ProductModel) JSON.deserialize(productJSON, ProductModel.class);
    }

    private class ProductReaderContext {
        private Id pricebookId;
        private String currencyCode;
        private ProductReaderContext(Id pricebookId, String currencyCode) {
            this.pricebookId = pricebookId;
            this.currencyCode = currencyCode;
        }
    }


    /*
    * CPQ Quote API functions
    */
    public static QuoteModel readQuote(String quoteId) {
        String quoteJSON = SBQQ.ServiceRouter.read('SBQQ.QuoteAPI.QuoteReader', quoteId);
        return (QuoteModel) JSON.deserialize(quoteJSON, QuoteModel.class);
    }
    /*
    public static QuoteModel saveQuote(QuoteModel quote) {
        String quoteJSON = SBQQ.ServiceRouter.save('SBQQ.QuoteAPI.QuoteSaver',
                                                   JSON.serialize(quote));
        return (QuoteModel) JSON.deserialize(quoteJSON, QuoteModel.class);
    }
    */
    
    public static void calculateQuote(QuoteModel quote, String callbackClass) {
        QuoteCalculatorContext ctx = new QuoteCalculatorContext(quote, callbackClass);
        SBQQ.ServiceRouter.load('SBQQ.QuoteAPI.QuoteCalculator', null, JSON.serialize(ctx));
    }

    private class QuoteCalculatorContext {
        private QuoteModel quote;
        private String callbackClass;
        public QuoteCalculatorContext(QuoteModel quote, String callbackClass) {
            this.quote = quote;
            this.callbackClass = callbackClass;
        }
        
    }

    /*
    * CPQ Model classes
    */
    public class QuoteModel { 
        public SBQQ__Quote__c record; 
        public QuoteLineModel[] lineItems; 
        public QuoteLineGroupModel[] lineItemGroups; 
        public Integer nextKey; 
        public Boolean applyAdditionalDiscountLast; 
        public Boolean applyPartnerDiscountFirst; 
        public Boolean channelDiscountsOffList; 
        public Decimal customerTotal; 
        public Decimal netTotal; 
        public Decimal netNonSegmentTotal; 
    }     
    
    public class QuoteLineModel { 
        public SBQQ__QuoteLine__c record; 
        public Boolean amountDiscountProrated; 
        public Integer parentGroupKey; 
        public Integer parentItemKey; 
        public Integer key; 
        public Boolean upliftable; 
        public String configurationType; 
        public String configurationEvent; 
        public Boolean reconfigurationDisabled; 
        public Boolean descriptionLocked; 
        public Boolean productQuantityEditable; 
        public Decimal productQuantityScale; 
        public String dimensionType; 
        public Boolean productHasDimensions; 
        public Decimal targetCustomerAmount; 
        public Decimal targetCustomerTotal; 
    } 
    
    public class QuoteLineGroupModel { 
        public SBQQ__QuoteLineGroup__c record; 
        public Decimal netNonSegmentTotal; 
        public Integer key; 
    }
    
    public class ProductModel {
        public Product2 record;
        public Id upgradedAssetId;
        public String currencySymbol;
        public String currencyCode;
        public String[] featureCategories;
        public OptionModel[] options;
        public FeatureModel[] features;
        public ConfigurationModel configuration;
        public ConfigAttributeModel[] configurationAttributes;
        public ConfigAttributeModel[] inheritedConfigurationAttributes;
        public ConstraintModel[] constraints; 
    }

    public class OptionModel {
        public SBQQ__ProductOption__c record;
        public Map<String,String> externalConfigurationData;
        public Boolean configurable;
        public Boolean configurationRequired;
        public Boolean quantityEditable;
        public Boolean priceEditable;
        public Decimal productQuantityScale;
        public Boolean priorOptionExists;
        public Set<Id> dependentIds;
        public Map<String,Set<Id>> controllingGroups;
        public Map<String,Set<Id>> exclusionGroups;
        public String reconfigureDimensionWarning;
        public Boolean hasDimension;
        public Boolean isUpgrade;
        public String dynamicOptionKey;
    }
    public class FeatureModel {
        public SBQQ__ProductFeature__c record;
        public String instructionsText;
        public Boolean containsUpgrades;
    }
    public class ConstraintModel {
        public SBQQ__OptionConstraint__c record;
        public Boolean priorOptionExists;
    }
    public class ConfigurationModel {
        public Id configuredProductId;
        public Id optionId;
        public SBQQ__ProductOption__c optionData; // Editable data about the option in question, such as quantity or discount
        public SBQQ__ProductOption__c configurationData;
        public SBQQ__ProductOption__c inheritedConfigurationData;
        public ConfigurationModel[] optionConfigurations;
        public Boolean configured;
        public Boolean changedByProductActions;
        public Boolean isDynamicOption;
        public Boolean isUpgrade;
        public Set<Id> disabledOptionIds;
        public Set<Id> hiddenOptionIds;
        public Decimal listPrice;
        public Boolean priceEditable;
        public String[] validationMessages;
        public String dynamicOptionKey;
    }
    public class ConfigAttributeModel {
        public String name;
        public String targetFieldName;
        public Decimal displayOrder;
        public String colmnOrder;
        public Boolean required;
        public Id featureId;
        public String position;
        public Boolean appliedImmediately;
        public Boolean applyToProductOptions;
        public Boolean autoSelect;
        public String[] shownValues;
        public String[] hiddenValues;
        public Boolean hidden;
        public String noSuchFieldName;
        public Id myId;
    }
}
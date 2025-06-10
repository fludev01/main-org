public with sharing class EGPT_SalesController {
  @AuraEnabled(cacheable=true)
  public static User getUserDetails() {
    try {
      Id userId = UserInfo.getUserId();
      return [SELECT Id, FirstName, SmallPhotoUrl FROM USER WHERE Id = :userId LIMIT 1];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static List<Map<String, Object>> getEinsteinResponseList() {
    try {
      List<Map<String, Object>> responseList = new List<Map<String, Object>>();

      List<EinsteinResponse__c> einsteinResponses = [
        SELECT Id, Question__c, Answer__c, ResponseDelay__c, ContentRegionState__c, ChangeInteractivePageState__c, TargetRecordId__c
        FROM EinsteinResponse__c
      ];

      List<EinsteinDataSource__c> einsteinDataSources = [
        SELECT Id, EinsteinResponseCard__c, Name
        FROM EinsteinDataSource__c
      ];

      List<EinsteinResponseCard__c> einsteinResponseCards = [
        SELECT Id, EinsteinResponse__c, Name, Order__c, Details__c
        FROM EinsteinResponseCard__c
        ORDER BY Order__c
      ];


      List<EinsteinResponseAction__c> einsteinResponseActions = [
        SELECT
          Id,
          EinsteinResponse__c,
          EinsteinResponseCard__c,
          Name,
          Order__c,
          Variant__c,
          IconName__c,
          Content__c,
          ActionTarget__c,
          NextMessageKeyword__c,
          TargetRecordId__c,
          TargetFieldName__c
        FROM EinsteinResponseAction__c
        ORDER BY Order__c
      ];

      for (EinsteinResponse__c response : einsteinResponses) {
        Map<String, Object> constructedResponse = new Map<String, Object>();

        List<Map<String, Object>> cardList = new List<Map<String, Object>>();
        for (EinsteinResponseCard__c card : einsteinResponseCards) {
          if (card.EinsteinResponse__c == response.Id) {
            List<Map<String, Object>> cardActionList = new List<Map<String, Object>>();
            for (EinsteinResponseAction__c action : einsteinResponseActions) {
              if (action.EinsteinResponseCard__c == card.Id) {
                Map<String, Object> constructedAction = new Map<String, Object>();
                constructedAction.put('Id', action.Id);
                constructedAction.put('Name', action.Name);
                constructedAction.put('EinsteinResponse__c', action.EinsteinResponse__c);
                constructedAction.put('EinsteinResponseCard__c', action.EinsteinResponseCard__c);
                constructedAction.put('Order__c', action.Order__c);
                constructedAction.put('Variant__c', action.Variant__c);
                constructedAction.put('IconName__c', action.IconName__c);
                constructedAction.put('Content__c', action.Content__c);
                constructedAction.put('ActionTarget__c', action.ActionTarget__c);
                constructedAction.put('NextMessageKeyword__c', action.NextMessageKeyword__c);
                constructedAction.put('TargetFieldName__c', action.TargetFieldName__c);
                constructedAction.put('TargetRecordId__c', action.TargetRecordId__c);
                if (action.TargetRecordId__c != null) {
                  constructedAction.put(
                    'TargetSObjectType__c',
                    Id.valueOf(action.TargetRecordId__c).getSObjectType().getDescribe().getName()
                  );
                }
                cardActionList.add(constructedAction);
              }
            }
            List<Map<String, Object>> cardSourceList = new List<Map<String, Object>>();
            for (EinsteinDataSource__c source : einsteinDataSources) {
              if (source.EinsteinResponseCard__c == card.Id) {
                Map<String, Object> constructedSource = new Map<String, Object>();
                constructedSource.put('Id', source.Id);
                constructedSource.put('Name', source.Name);
                constructedSource.put('EinsteinResponseCard__c', source.EinsteinResponseCard__c);
                cardSourceList.add(constructedSource);
              }
            }
            Map<String, Object> constructedCard = new Map<String, Object>();
            constructedCard.put('Id', card.Id);
            constructedCard.put('Name', card.Name);
            constructedCard.put('Details__c', card.Details__c);
            constructedCard.put('Actions', cardActionList);
            constructedCard.put('Sources', cardSourceList);
            cardList.add(constructedCard);
          }
        }

        List<Map<String, Object>> responseActionList = new List<Map<String, Object>>();
        for (EinsteinResponseAction__c action : einsteinResponseActions) {
          if (action.EinsteinResponse__c == response.Id) {
            Map<String, Object> constructedAction = new Map<String, Object>();
            constructedAction.put('Id', action.Id);
            constructedAction.put('Name', action.Name);
            constructedAction.put('EinsteinResponse__c', action.EinsteinResponse__c);
            constructedAction.put('EinsteinResponseCard__c', action.EinsteinResponseCard__c);
            constructedAction.put('Order__c', action.Order__c);
            constructedAction.put('Variant__c', action.Variant__c);
            constructedAction.put('IconName__c', action.IconName__c);
            constructedAction.put('Content__c', action.Content__c);
            constructedAction.put('ActionTarget__c', action.ActionTarget__c);
            constructedAction.put('NextMessageKeyword__c', action.NextMessageKeyword__c);
            constructedAction.put('TargetFieldName__c', action.TargetFieldName__c);
            constructedAction.put('TargetRecordId__c', action.TargetRecordId__c);
            if (action.TargetRecordId__c != null) {
              constructedAction.put(
                'TargetSObjectType__c',
                Id.valueOf(action.TargetRecordId__c).getSObjectType().getDescribe().getName()
              );
            }
            responseActionList.add(constructedAction);
          }
        }
        constructedResponse.put('Id', response.Id);
        constructedResponse.put('Question__c', response.Question__c);
        constructedResponse.put('Answer__c', response.Answer__c);
        constructedResponse.put('ContentRegionState__c', response.ContentRegionState__c);
        constructedResponse.put('ChangeInteractivePageState__c', response.ChangeInteractivePageState__c);
        constructedResponse.put('TargetRecordId__c', response.TargetRecordId__c);
        if (response.TargetRecordId__c != null) {
          constructedResponse.put(
            'TargetSObjectType__c',
            Id.valueOf(response.TargetRecordId__c).getSObjectType().getDescribe().getName()
          );
        }
        constructedResponse.put('ResponseDelay__c', response.ResponseDelay__c);
        constructedResponse.put('Cards', cardList);
        constructedResponse.put('Actions', responseActionList);
        responseList.add(constructedResponse);
      }
      return responseList;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static List<Map<String, Object>> getEinsteinResponse(Id recordId) {
    try {
      List<Map<String, Object>> responseList = new List<Map<String, Object>>();

      List<EinsteinResponse__c> einsteinResponses = [
        SELECT Id, Question__c, Answer__c, ResponseDelay__c, ContentRegionState__c
        FROM EinsteinResponse__c
        WHERE Id = :recordId
      ];

      List<EinsteinResponseCard__c> einsteinResponseCards = [
        SELECT Id, EinsteinResponse__c, Name, Order__c, Details__c
        FROM EinsteinResponseCard__c
        ORDER BY Order__c
      ];

      List<EinsteinResponseAction__c> einsteinResponseActions = [
        SELECT
          Id,
          EinsteinResponse__c,
          EinsteinResponseCard__c,
          Name,
          Order__c,
          Position__c,
          Variant__c,
          IconName__c,
          Content__c,
          ActionTarget__c,
          NextMessageKeyword__c
        FROM EinsteinResponseAction__c
        ORDER BY Order__c
      ];

      for (EinsteinResponse__c response : einsteinResponses) {
        Map<String, Object> constructedResponse = new Map<String, Object>();

        List<Map<String, Object>> cardList = new List<Map<String, Object>>();
        for (EinsteinResponseCard__c card : einsteinResponseCards) {
          if (card.EinsteinResponse__c == response.Id) {
            List<EinsteinResponseAction__c> cardActionList = new List<EinsteinResponseAction__c>();
            for (EinsteinResponseAction__c action : einsteinResponseActions) {
              if (action.EinsteinResponseCard__c == card.Id) {
                cardActionList.add(action);
              }
            }
            Map<String, Object> constructedCard = new Map<String, Object>();
            constructedCard.put('Id', card.Id);
            constructedCard.put('Name', card.Name);
            constructedCard.put('Details__c', card.Details__c);
            constructedCard.put('Actions', cardActionList);
            cardList.add(constructedCard);
          }
        }

        List<EinsteinResponseAction__c> responseActionList = new List<EinsteinResponseAction__c>();
        for (EinsteinResponseAction__c action : einsteinResponseActions) {
          if (action.EinsteinResponse__c == response.Id) {
            responseActionList.add(action);
          }
        }
        constructedResponse.put('Id', response.Id);
        constructedResponse.put('Question__c', response.Question__c);
        constructedResponse.put('Answer__c', response.Answer__c);
        constructedResponse.put('ContentRegionState__c', response.ContentRegionState__c);
        constructedResponse.put('ResponseDelay__c', response.ResponseDelay__c);
        constructedResponse.put('Cards', cardList);
        constructedResponse.put('Actions', responseActionList);
        responseList.add(constructedResponse);
      }
      return responseList;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static List<EinsteinResponse__c> getResponseList() {
    return [
      SELECT
        Question__c,
        Answer__c,
        UseLWCOverride__c,
        LWCName__c,
        ContentRegionState__c,
        ResponseDelay__c,
        (
          SELECT
            Name,
            Order__c,
            Position__c,
            Variant__c,
            IconName__c,
            Content__c,
            ActionTarget__c,
            NextMessageKeyword__c
          FROM EinsteinResponseActions__r
          ORDER BY Order__c
        ),
        (
          SELECT Name, Order__c, Details__c
          FROM EinsteinResponseCards__r
          ORDER BY Order__c
        )
      FROM EinsteinResponse__c
      WITH SECURITY_ENFORCED
    ];
  }

  @AuraEnabled(cacheable=true)
  public static EGPTConfiguration__c getConfiguration() {
    try {
      return [
        SELECT AssistantUnknownAnswerResponse__c, SalesFeaturedAccount__c, SalesUseOpenAI__c
        FROM EGPTConfiguration__c
        LIMIT 1
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static String getNameFromId(Id recordId, String sObjectName) {
    try {
      String query = 'SELECT Name FROM ' +sObjectName+ ' WHERE Id = :recordId LIMIT 1';
      sObject record = Database.query(query);
      return String.valueOf(record.get('Name'));
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

}
public class WaveContactActions_ApexController {
	public String query { get; set; }

	public WaveContactActions_ApexController() {

	}

	public PageReference init() {
		query = ApexPages.currentPage().getParameters().get('query');
		System.debug('coshea : query : ' + query);
		return null;
	}

	@remoteAction
	public Static List<Contact> getMyContacts(List<String> caseEmails) {
		List<Contact> returnList = new List<Contact>();
		for(Contact con : [SELECT Email,Id,Name,Title FROM Contact WHERE Email IN: caseEmails ORDER BY Name ASC]) {
			returnList.add(con);
		}
		return returnList;
	}

	@remoteAction
	public Static List<Campaign> getMyCampaigns() {
		return [SELECT Id,Name,NumberOfContacts,NumberOfLeads,OwnerId,Owner.Name,Parent.Name,ParentId,Status,Type FROM Campaign ORDER BY Name ASC];
	}

	@remoteAction
	public Static List<myResultsObject> createMyCampaignMembers(List<String> campaignIds, List<Contact> myContacts) {
		List<myResultsObject> returnList = new List<myResultsObject>();
		List<CampaignMember> newCampaignMembers = new List<CampaignMember>();
		List<String> successfulCreates = new List<String>();

		for(Campaign cmp : [SELECT Id,Name,NumberOfContacts,NumberOfLeads,OwnerId,Owner.Name,Parent.Name,ParentId,Status,Type FROM Campaign WHERE Id IN: campaignIds]) {
			for(Contact con : myContacts) {
				CampaignMember cmpMem = new CampaignMember();
				cmpMem.CampaignId = cmp.Id;
				cmpMem.ContactId = con.Id;
				cmpMem.createdViaWaveContactAction__c = true;
				newCampaignMembers.add(cmpMem);
			}
		}

		Database.SaveResult[] srList = Database.insert(newCampaignMembers, false);
		for (Database.SaveResult sr : srList) {
			if (sr.isSuccess()) {
				successfulCreates.add(sr.getId());
				System.debug('sr.getId() : ' + sr.getId());
			}
		}

		for(CampaignMember cmpMem : [SELECT CampaignId,Campaign.Name,Id,Name FROM CampaignMember WHERE Id IN: successfulCreates]) {
			System.debug('Campaign Member Object : ' + cmpMem);
			myResultsObject res = new myResultsObject();
			res.wasSuccess = true;
			res.theCampaignName = cmpMem.Campaign.Name;
			res.theCampaignId = cmpMem.CampaignId;
			res.theCampaignMember = cmpMem;
			returnList.add(res);
		}

		return returnList;
	}

	public class myResultsObject {
		public myResultsObject() {}

		Boolean wasSuccess;
		String theCampaignName;
		String theCampaignId;
		CampaignMember theCampaignMember;
	}

	@remoteAction
	public Static String resetMyDemo() {
		try {
			List<CampaignMember> camps = [SELECT CampaignId,Campaign.Name,Id,Name,createdViaWaveContactAction__c FROM CampaignMember WHERE createdViaWaveContactAction__c=:true];
			delete camps;
			return 'worked';
		} catch(Exception excep) {
			return excep.getMessage();
		}
	}

}
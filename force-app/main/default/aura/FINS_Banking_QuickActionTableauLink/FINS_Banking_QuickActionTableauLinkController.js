({
	 init : function(component, event, helper) {
		//var dismissActionPanel = $A.get("e.force:closeQuickAction");
         window.open('https://public.tableau.com/views/CumulusWealthAdvisors-ClientPortfolioPresentation/ClientPortfolio-PDFPrint?:language=en&Id%20=true&:display_count=y&:origin=viz_share_link?:embed=y&:showShareOptions=false&:toolbar=false&:display_count=no&:showVizHome=no&Id%20',
                    '_blank');
        // Close the action panel
        //console.log("C");
        //dismissActionPanel.fire();
        //bug: https://trailblazer.salesforce.com/issues_view?id=a1pKj000007uhvPQAC
        //prevents auto closure of window. known issue Aug 2020 EC
	},
    doneRendering: function(cmp, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
    }
})
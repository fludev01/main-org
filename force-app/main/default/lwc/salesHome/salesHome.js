import { LightningElement, api } from 'lwc';

export default class Home extends LightningElement {
    
    _showSidebar;

    @api
    get showSidebar() {
      return this._showSidebar;
    }
    set showSidebar(value) {
      this._showSidebar = value;
      this.loading = true;
      this.stopLoading(200)
    }

    loading = false;
  

    items = [
        {label: 'Pipeline', iconName: 'standard:data_streams', count: '21M', increase: '10%', subtext:'Last 12 Months'},
        {label: 'Won', iconName: 'standard:segments', count: '6M', increase: '26%', subtext:'Last 12 Months'}
    ]

    tasks = [
        { title: "Accept Transfered Account: Outscape Ltd", description: "You have been assigned a new account! Check out the details to get started.", isCompleted: false },
        { title: "Call Winter Peaks", description: "", isCompleted: true },
        { title: "Update Pipeline for Review", description: "", isCompleted: true },
        { title: "Close out Q4", description: "", isCompleted: true },
      ];

     activities = [
        {label: 'Follow-up Call', action: 'Ski Summit Opp next Steps', icon: 'standard:voice_call', time: '11:00'},
        {label: 'Drive to Lunch', action: 'Travel', icon: 'custom:custom45', time: '12:00'},
        {label: 'Lunch Meeting', action: 'Brand Partnership', icon: 'standard:event', time: '12:30'},
        {label: 'Team Meeting', action: 'FY24 Planning', icon: 'standard:event', time: '14:30'},
    ];

    stopLoading(timeoutValue) {
        setTimeout(() => {
          this.loading = false;
        }, timeoutValue);
      }
    

    

}
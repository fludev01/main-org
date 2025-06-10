import { LightningElement, api, track, wire} from 'lwc';
import MomentJs from '@salesforce/resourceUrl/moment20190701';
import { loadScript } from 'lightning/platformResourceLoader';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';

import getTasks from '@salesforce/apex/demCalendarController.getAllTasks';
import getEvents from '@salesforce/apex/demCalendarController.getAllEvents';
import getOpportunities from '@salesforce/apex/demCalendarController.getAllOpportunities';

const DAYS_OF_WEEK = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const LABELS_TASK = ['+Task','New Task','Subject','Due Date','Save','Cancel'];
const LABELS_EVENT = ['+Event','New Event','Subject','Start','End','Save','Cancel'];

export default class DemActivityCalendarWrapper extends LightningElement {
	
    
    @api recordId = null;
    @api size;
    @api labelToday;
    @api labelTitle;
    @api labelDaysOfWeek;
    @api labelsForTask;
    @api labelsForEvent;
    @api formatMonth;
    @api actionOnClick;
    @api position;

    @api 
    get dummy(){
        return '';
    }
    set dummy(val){
        this.refreshSelf();
    }

	@track thisMonth = null;
    @track isOpenNewTask = false;
    @track isOpenNewEvent = false;
    startTime = null;
    endTime = null;

	@wire(getTasks) tasks;
    @wire(getEvents) events;
    @wire(getOpportunities) opps;    

    @track newTask = {
        ActivityDate: ''
    };
    @track newEvent = {
        ActivityDate: ''
    };
    get dayOfWeeks(){
        const dows = this.labelDaysOfWeek.split(',');
        return (dows && dows.length == DAYS_OF_WEEK.length)? dows: DAYS_OF_WEEK;    
    }
    get labelsTask(){
        const inputs = this.labelsForTask.split(',');
        return (inputs && inputs.length == LABELS_TASK.length)? inputs: LABELS_TASK;    
    }
    get labelsEvent(){
        const inputs = this.labelsForEvent.split(',');
        return (inputs && inputs.length == LABELS_EVENT.length)? inputs: LABELS_EVENT;    
    }
    get labelTask(){
        return this.labelsTask[0];
    }
    get labelEvent(){
        return this.labelsEvent[0];
    }


    get isSize3(){
        return this.size && this.size == '3';
    }

    refreshed(){
        updateRecord({ fields: { Id: this.recordId } });
    }

    clickedNewTask(evt){
        console.log('detail', evt.detail);
        this.dispatchEvent(new CustomEvent('newtask', {
            detail: {
                defaultFieldValues: {
                    ActivityDate: evt.detail
                }
            }
        }));
    }
    clickedNewEvent(evt){
        this.dispatchEvent(new CustomEvent('newevent', {
            detail: {
                defaultFieldValues: {
                    'StartDateTime': evt.detail + 'T' + this.startTime + 'Z',
                    'EndDateTime': evt.detail + 'T' + this.endTime + 'Z'
                }
            }
        }));
    }

	renderedCallback(){
        if (this.thisMonth != null){
            return;
        }
		loadScript(this, MomentJs).then(() => {
            this.thisMonth = moment();
            this.startTime = moment().utc().add(1, 'hours').set({'minute': 0, 'second': 0}).format('HH:mm:ss');
            this.endTime = moment().utc().add(3, 'hours').set({'minute': 0, 'second': 0}).format('HH:mm:ss');
		});
	}


    handleChange(){
        console.log('Detect');
        alert('Detect!!');
    }

    get nextMonth(){
        if (this.size == '3' && this.thisMonth){
            return this.thisMonth.clone().add(1, 'M');
        }
        return null;
    }

    get lastMonth(){
        if (this.size == '3' && this.thisMonth){
            return this.thisMonth.clone().add(2, 'M');
        }
        return null;
    }

    get targetMonths(){
        if (this.thisMonth){
            if (this.size == '1'){
                const m1 = this.thisMonth;
                return [{
                    key: m1.format('YYYYMM'), month: m1
                }];
            } else if (this.size == '3'){
                const diff = 
                    this.position == 'left' ? 0:
                    this.position == 'right' ? -2:
                    this.position == 'center' ? -1:
                    0;
                const m1 = this.thisMonth.clone().add(diff, 'M');
                const m2 = this.nextMonth.clone().add(diff, 'M');
                const m3 = this.lastMonth.clone().add(diff, 'M');
                return [{
                    key: m1.format('YYYYMM'), month: m1
                }, {
                    key: m2.format('YYYYMM'), month: m2
                }, {
                    key: m3.format('YYYYMM'), month: m3
                }];
            }
            return [];
        }
        return [];
    }

	clickedNextMonth(){
		if (this.thisMonth){
			this.changeMonth(this.thisMonth.clone().add(1, 'M'));
		}	
	}
	clickedPreviousMonth(){
		if (this.thisMonth){
			this.changeMonth(this.thisMonth.clone().subtract(1, 'M'));
		}	
	}
	clickedThisMonth(){
		if (this.thisMonth){
			this.changeMonth(moment());
		}	
	}

	changeMonth(month) {
        this.thisMonth = month;
	}

	get showTitle(){
        if (this.size == '1'){
            const month = this.thisMonth;
            if (month){
                return month.format(this.formatMonth);
            }
        } else if (this.size == '3'){
            return this.labelTitle;
        }
		return '---';
	}

    refreshSelf(){
        refreshApex(this.tasks);
        refreshApex(this.events);
    }

    get activities() {
		const act = {};

        const opps = this.opps && this.opps.data ? this.opps.data: [];
		opps.forEach(opp => {
            const key = moment(opp.CloseDate).format('YYYYMMDD');
            if (!act.hasOwnProperty(key)){
                act[key] = [];
            }
            act[key].push({
                id: opp.Id,
                sobject: 'Opportunity',
                isClosed: opp.IsClosed,
                status: (opp.IsClosed && opp.IsWon) ? 'won': (opp.IsClosed && !opp.IsWon) ? 'dead': '', 
                subject: opp.Name
            });
        });        

        const tasks = this.tasks && this.tasks.data ? this.tasks.data: [];
		tasks.forEach(task => {
            const key = moment(task.ActivityDate).format('YYYYMMDD');
            if (!act.hasOwnProperty(key)){
                act[key] = [];
            }
            const account = task.Account && task.Account.Name ? ' (' + task.Account.Name + ')': '';
            act[key].push({
                id: task.Id,
                sobject: 'Task',
                isClosed: task.IsClosed,
                subject: task.Subject + account,
                status: ''
            });
        });
        const events = this.events && this.events.data ? this.events.data: [];
        events.forEach(event => {
            const start = moment(event.StartDateTime);
            const end = moment(event.EndDateTime);
            const account = event.Account && event.Account.Name ? ' (' + event.Account.Name + ')': '';
            const obj = {
                id: event.Id,
                sobject: 'Event',
                isClosed: false,
                subject: event.Subject + account,
                status: ''
            };
            for(let i=0; i<500; i++){
                const thisDate = start.clone().add(i, 'd');
                const key = thisDate.format('YYYYMMDD');
                if (!act.hasOwnProperty(key)){
                    act[key] = [];
                }
                act[key].push(obj);
                if (thisDate.format('YYYYMMDD') == end.format('YYYYMMDD')){
                    break;
                }
            }
        });        
        return act;
	}


}
import { LightningElement, api, track, wire} from 'lwc';
import MomentJs from '@salesforce/resourceUrl/moment20190701';
import { loadScript } from 'lightning/platformResourceLoader';


export default class DemActivityCalendar extends LightningElement {
	
    @api recordId;
	@track today = null;
	@api thisMonth;
    @api dayOfWeeks;
    @api hasTitle;
    @api isStrict;
    @api formatMonth = 'MMMM YYYY';
    @api actionOnClick = 'view';
    @api activities = [];
    @api labelTask;
    @api labelEvent;

	renderedCallback(){
        if (this.today != null){
            return;
        }
		loadScript(this, MomentJs).then(() => {
            this.today = moment();
		});
	}

    clickedNewTask(evt){
        this.dispatchEvent(new CustomEvent('newtask', {
            detail: evt.detail
        }));
    }
    clickedNewEvent(evt){
        this.dispatchEvent(new CustomEvent('newevent', {
            detail: evt.detail
        }));
    }

    get isThisMonth(){
        if (this.today && this.thisMonth){
        return this.today.format('YYYY-MM') == this.thisMonth.format('YYYY-MM');
        }
        return false;
    }

	get firstDayOfMonth() {
        const month = this.thisMonth;
		if (month){
			return month.clone().startOf('month');
		}
		return null;
    }

    get showMonth(){
        if (this.firstDayOfMonth){
            return this.firstDayOfMonth.format(this.formatMonth);
        }
        return '---';
    }

	
    get days() {
        const firstDate = this.firstDayOfMonth;
		if (firstDate && this.today){
			const today = this.today;
			const start = firstDate.clone().startOf('week');
			const end = firstDate.clone().endOf('month').endOf('week');
			const rets = [];
			for(let i=0; i<50; i++){
				const thisDate = start.clone().add(i, 'd');
                const isThisMonth = firstDate.month() == thisDate.month() ? true: false;
                const key = thisDate.format('YYYYMMDD');
				rets.push({
					text: thisDate.format(),
					key: key,
                    dateString: thisDate.format('YYYY-MM-DD'),
					isThisMonth: isThisMonth,
					isToday: (key == today.format('YYYYMMDD') ? true: false), 
					day: thisDate.day(),
					date: thisDate.date(),
					week: thisDate.week() - start.week(),
					activities: (this.activities.hasOwnProperty(key) ? this.activities[key]: [])
				});
				if (key == end.format('YYYYMMDD')){
					break;
				}
			}
			return rets;
		}
        return Array.from(new Array(35)).map((_v,i) => {
            return {
                text: 'dummy-' + i,
                day: i % 7,
                activities: [],
                isThisMonth: true
            }
        })
	}

}
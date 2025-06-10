import {LightningElement, track} from 'lwc';
import companyInfo from '@salesforce/resourceUrl/companyInfo';
import companyInfoIndustry from '@salesforce/resourceUrl/companyInfoIndustry';
import companyInfoFinancials from '@salesforce/resourceUrl/companyInfoFinancials';
import companyInfoFamilyTree from '@salesforce/resourceUrl/companyInfoFamilyTree';

export default class InsideViewCompanyInfo extends LightningElement{
    @track showOverview = true;
    @track showIndustry = false;
    @track showFinancials = false;
    @track showFamilyTree = false;

    _companyInfoURL = companyInfo;
    _companyInfoIndustryURL = companyInfoIndustry;
    _companyInfoFinancialsURL = companyInfoFinancials;
    _companyInfoFamilyTreeURL = companyInfoFamilyTree;

    selectOverview(){
        this.showOverview = true;
        this.showIndustry = false;
        this.showFinancials = false;
        this.showFamilyTree = false;
    }

    selectIndustry(){
        this.showOverview = false;
        this.showIndustry = true;
        this.showFinancials = false;
        this.showFamilyTree = false;
    }

    selectFinancials(){
        this.showOverview = false;
        this.showIndustry = false;
        this.showFinancials = true;
        this.showFamilyTree = false;
    }

    selectFamilyTree(){
        this.showOverview = false;
        this.showIndustry = false;
        this.showFinancials = false;
        this.showFamilyTree = true;
    }
}
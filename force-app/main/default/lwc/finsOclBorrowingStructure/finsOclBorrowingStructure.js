import { LightningElement, track, api } from 'lwc';
const BScolumns = [
    {
        label: 'RELATIONSHIP NAME', fieldName: 'relationshipName', type: 'url',
        typeAttributes: {
            label: { fieldName: 'relationshipName' }
        }
    },
    { label: 'RELATIONSHIP TYPE', fieldName: 'relationshipType', type: 'text' },
    { label: 'BORROWER TYPE', fieldName: 'borrowerType', type: 'text' },
    {
        label: 'ENTITY NUMBER', fieldName: 'entityNumber', type: 'url',
        typeAttributes: {
            label: { fieldName: 'entityNumber' }
        }
    },
    {
        label: 'ACTIONS', fieldName: 'actions', type: 'url',
        typeAttributes: {
            label: { fieldName: 'actions' }
        }
    },
];
const AScolumns = [];
// const data = [{
//     id: 'a',
//     relationshipName: 'United Partners ⭆',
//     relationshipType: 'Corporation',
//     borrowerType: 'Borrower',
//     entityNumber: 'aOPKj000000ocCH ⭆',
//     actions: 'Edit .  Remove'
// }];
export default class FinsOclBorrowingStructure extends LightningElement {
    @api loanname;
    @track data = [{
        id: 'a',
        relationshipName: 'United Partners ⭆',
        relationshipType: 'Corporation',
        borrowerType: 'Borrower',
        entityNumber: 'aOPKj000000ocCH ⭆',
        actions: 'Edit .  Remove'
    }];
    @track BScolumns = BScolumns;
    @track AScolumns = AScolumns;
    get loanName(){
        return this.loanname;
    }
}
import { LightningElement, wire, track } from 'lwc';
import getDocuments from '@salesforce/apex/DocumentController.getDocuments';
import searchDocuments from '@salesforce/apex/DocumentController.searchDocuments';
import updateDocumentName from '@salesforce/apex/DocumentController.updateDocumentName';
import deleteDocument from '@salesforce/apex/DocumentController.deleteDocument';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columns = [
  { label: 'Name', fieldName: 'Name' },
  { label: 'Version', fieldName: 'Document_Version__c' },
  { label: 'Category', fieldName: 'Document_Category__c' },
  {
    label: 'Action',
    type: 'button',
    typeAttributes: { label: 'Edit', name: 'edit' },
  },
  {
    label: 'Action',
    type: 'button',
    typeAttributes: { label: 'Delete', name: 'delete' },
  },
];

export default class DocumentList extends LightningElement {
  @track documents;
  @track documentData;
  @track searchResults;
  @track isEdit=false;
  @track isDelete=false;
  docRecId='';
  columns = columns;

  connectedCallback() {
    this.loadDocuments();
  }

  loadDocuments() {
    getDocuments()
      .then((result) => {
        this.documents = result;
        this.documentData = result;
      })
      .catch((error) => {
        this.showToast('Error', error.body.message, 'error');
      });
  }

  handleSearchTermChange(event) {
    const searchTerm = event.target.value;
    if (searchTerm.length >= 2) {
      searchDocuments({ searchTerm })
        .then((result) => {
          this.searchResults = result;
          this.documentData = result;
        })
        .catch((error) => {
          this.showToast('Error', error.body.message, 'error');
        });
    } else {
      this.searchResults = null;
      this.documentData = this.documents;
    }
  }

  handleRowAction(event) {
    const action = event.detail.action;
    const row = event.detail.row;
    const recordId = row.Id;

    switch (action.name) {
      case 'edit':
        this.openEditModal(row);
        break;
      case 'delete':
        this.deleteDocument(recordId);
        break;
      default:
        break;
    }
  }
  
  handleSuccess(event){
    this.isEdit=false;
    setTimeout(()=>{
       location.reload();
    },1000)
   
  }
handleCancel(event){
  this.isEdit=false;
}
openEditModal(row) {
 // alert('from edit'+row.Id)
 this.docRecId=row.Id;
  this.isEdit=true;
    
}
handleDelete(event){
    this.isDelete=false;
    setTimeout(()=>{
       location.reload();
    },1000)
   
  }

  deleteDocument(documentId) {
    this.isDelete = false;
    deleteDocument({ documentId })
      .then(() => {
         location.reload();
        this.showToast('Success', 'Document deleted successfully', 'success');
        this.loadDocuments();
      })
      .catch((error) => {
        this.showToast('Error', error.body.message, 'error');
      });
  }

  showToast(title, message, variant) {
    const toastEvent = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant,
    });
    this.dispatchEvent(toastEvent);
  }
}
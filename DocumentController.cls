public class DocumentController {
    @AuraEnabled(cacheable=true)
    public static List<Document__c> getDocuments() {
        List<Document__c> documents = [SELECT Id, Name, Document_Version__c, Document_Category__c FROM Document__c ORDER BY Name ASC NULLS LAST];
        return documents;
    }
    @AuraEnabled
    public static List<Document__c> searchDocuments(String searchTerm) {
        return [SELECT Id, Name, Document_Version__c, Document_Category__c FROM Document__c WHERE Name LIKE :('%'+searchTerm+'%')];
    }
    
    @AuraEnabled(cacheable=true)
    public static void updateDocumentName(String documentId, String newName) {
        Document__c document = new Document__c(Id = documentId, Name = newName);
        update document;
    }
    
/*    @AuraEnabled
    public static void updateDocumentName(List<DocumentUpdateDTO> documentUpdates) {
    List<Document__c> documentsToUpdate = new List<Document__c>();
    
    for (DocumentUpdateDTO dto : documentUpdates) {
        Document__c document = new Document__c(Id = dto.documentId, Name = dto.newName);
        documentsToUpdate.add(document);
    }
    update documentsToUpdate;
}
*/
    
    @AuraEnabled
    public static void deleteDocument(String documentId) {
        Document__c document = new Document__c(Id = documentId);
        delete document;
    }
    
    public class DocumentUpdateDTO {
    @AuraEnabled
    public String documentId;
    @AuraEnabled
    public String newName;
    
    public DocumentUpdateDTO(String documentId, String newName) {
        this.documentId = documentId;
        this.newName = newName;
    }
}
}
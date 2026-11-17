import { useState, useEffect } from 'react';
import { EnterpriseDocumentService } from '../service/EnterpriseDocumentService';
import { EnterpriseDocumentModel } from '../models/EnterpriseDocumentModel';

const documentService = new EnterpriseDocumentService();

export function useEnterpriseDocuments() {
  const [documents, setDocuments] = useState<EnterpriseDocumentModel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const docs = await documentService.list();
      setDocuments(docs);
    } catch (error) {
      console.error('Failed to fetch enterprise documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return { documents, loading, refetch: fetchDocuments };
}

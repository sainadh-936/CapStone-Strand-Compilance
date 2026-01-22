'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { getSession, saveSession } from '@/lib/storage';
import { DOCUMENT_TYPES } from '@/features/documents/documentTypes';
import type { Session, DocumentType } from '@/types';

export default function DocumentSelectionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<Session | null>(null);
  const [selectedDocs, setSelectedDocs] = useState<DocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const s = getSession(sessionId);
    if (!s) {
      router.push('/dashboard');
      return;
    }
    setSession(s);
    setSelectedDocs(s.requiredDocuments);
    setIsLoading(false);
  }, [sessionId, router]);

  const toggleDocument = (docType: DocumentType) => {
    setSelectedDocs(prev => 
      prev.includes(docType) 
        ? prev.filter(d => d !== docType)
        : [...prev, docType]
    );
  };

  const handleContinue = () => {
    if (!session || selectedDocs.length === 0) return;
    
    const updatedSession: Session = {
      ...session,
      requiredDocuments: selectedDocs,
    };
    saveSession(updatedSession);
    
    // Navigate to form builder for first document
    router.push(`/session/${sessionId}/forms`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-sm text-slate-400 mb-4">
          <span className="px-3 py-1.5 bg-slate-800 rounded-full">Step 2 of 4</span>
          <span>•</span>
          <span>{session?.patientName}</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Select Required Documents
        </h1>
        <p className="text-slate-400 mt-4 text-lg">
          Choose which documents need to be collected for this session
        </p>
      </div>

      <div className="space-y-4 mb-10">
        {DOCUMENT_TYPES.map(doc => {
          const isSelected = selectedDocs.includes(doc.id);
          return (
            <Card
              key={doc.id}
              hover
              onClick={() => toggleDocument(doc.id)}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'border-violet-500 bg-violet-950/30' 
                  : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                  ${isSelected ? 'bg-violet-600/30' : 'bg-slate-800'}
                `}>
                  {doc.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{doc.name}</h3>
                  <p className="text-sm text-slate-400">{doc.description}</p>
                </div>
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                  ${isSelected 
                    ? 'border-violet-500 bg-violet-500' 
                    : 'border-slate-600'
                  }
                `}>
                  {isSelected && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={() => router.push('/dashboard')}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={selectedDocs.length === 0}
          className="flex-1"
        >
          Continue ({selectedDocs.length} selected)
        </Button>
      </div>
    </div>
  );
}

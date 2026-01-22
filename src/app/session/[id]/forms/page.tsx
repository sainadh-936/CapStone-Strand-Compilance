'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/ui';
import { FormBuilder } from '@/features/forms';
import { getSession, saveSession } from '@/lib/storage';
import { getDocumentTypeInfo } from '@/features/documents/documentTypes';
import type { Session, FormSchema, DocumentType } from '@/types';

export default function FormBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<Session | null>(null);
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const s = getSession(sessionId);
    if (!s || s.requiredDocuments.length === 0) {
      router.push('/dashboard');
      return;
    }
    setSession(s);
    setIsLoading(false);
  }, [sessionId, router]);

  if (isLoading || !session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" />
      </div>
    );
  }

  const currentDocType = session.requiredDocuments[currentDocIndex];
  const totalDocs = session.requiredDocuments.length;
  const isLastDoc = currentDocIndex === totalDocs - 1;

  const handleSaveForm = (schema: FormSchema) => {
    const updatedSession: Session = {
      ...session,
      formSchemas: {
        ...session.formSchemas,
        [schema.documentType]: schema,
      },
    };
    saveSession(updatedSession);
    setSession(updatedSession);

    if (isLastDoc) {
      // All forms done, go to review
      router.push(`/session/${sessionId}/review`);
    } else {
      // Move to next document
      setCurrentDocIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentDocIndex === 0) {
      router.push(`/session/${sessionId}/documents`);
    } else {
      setCurrentDocIndex(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-sm text-slate-400 mb-4">
          <span className="px-3 py-1.5 bg-slate-800 rounded-full">Step 3 of 4</span>
          <span>•</span>
          <span>{session.patientName}</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Build Digital Forms
        </h1>
        <p className="text-slate-400 mt-4 text-lg">
          Create custom forms for each document (optional)
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex gap-3 mb-10">
        {session.requiredDocuments.map((doc, idx) => {
          const info = getDocumentTypeInfo(doc);
          return (
            <div
              key={doc}
              className={`
                flex-1 h-2 rounded-full transition-colors
                ${idx < currentDocIndex ? 'bg-emerald-500' : ''}
                ${idx === currentDocIndex ? 'bg-violet-500' : ''}
                ${idx > currentDocIndex ? 'bg-slate-700' : ''}
              `}
              title={info?.name}
            />
          );
        })}
      </div>

      <Card className="mb-8">
        <FormBuilder
          key={currentDocType} // Force remount on doc change
          documentType={currentDocType}
          initialSchema={session.formSchemas[currentDocType]}
          onSave={handleSaveForm}
          onBack={handleBack}
        />
      </Card>

      <p className="text-center text-sm text-slate-500 mt-6">
        Document {currentDocIndex + 1} of {totalDocs}
      </p>
    </div>
  );
}

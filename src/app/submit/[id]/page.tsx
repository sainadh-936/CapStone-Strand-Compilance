'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { getSession, saveSession } from '@/lib/storage';
import { getDocumentTypeInfo } from '@/features/documents/documentTypes';
import type { Session, DocumentType, DocumentSubmission, FormField } from '@/types';

export default function PublicSubmissionPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const [submissions, setSubmissions] = useState<Record<DocumentType, DocumentSubmission>>({} as Record<DocumentType, DocumentSubmission>);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const s = getSession(sessionId);
    if (!s) {
      setIsLoading(false);
      return;
    }
    setSession(s);
    
    // Check if already submitted
    if (s.status === 'submitted') {
      setIsComplete(true);
    } else if (s.status === 'link_generated') {
      // Update status to in_progress
      const updated = { ...s, status: 'in_progress' as const };
      saveSession(updated);
      setSession(updated);
    }
    
    setIsLoading(false);
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <Card className="text-center max-w-sm">
          <div className="text-5xl mb-4">🔗</div>
          <h2 className="text-xl font-semibold text-white mb-2">Link Not Found</h2>
          <p className="text-slate-400">This submission link is invalid or has expired.</p>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <Card className="text-center max-w-sm">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-semibold text-white mb-2">Submission Complete</h2>
          <p className="text-slate-400">Thank you! Your documents have been submitted successfully.</p>
        </Card>
      </div>
    );
  }

  const currentDocType = session.requiredDocuments[currentDocIndex];
  const currentDocInfo = getDocumentTypeInfo(currentDocType);
  const currentSchema = session.formSchemas[currentDocType];
  const totalDocs = session.requiredDocuments.length;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSubmissions(prev => ({
        ...prev,
        [currentDocType]: {
          ...prev[currentDocType],
          documentType: currentDocType,
          imageUrl: event.target?.result as string,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFormChange = (fieldId: string, value: string | number) => {
    setSubmissions(prev => ({
      ...prev,
      [currentDocType]: {
        ...prev[currentDocType],
        documentType: currentDocType,
        formData: {
          ...prev[currentDocType]?.formData,
          [fieldId]: value,
        },
      },
    }));
  };

  const isDocumentComplete = () => {
    const sub = submissions[currentDocType];
    if (!sub) return false;
    
    // Must have either image or form data
    const hasImage = !!sub.imageUrl;
    
    // If has form, check required fields
    if (currentSchema?.fields?.length) {
      const requiredFields = currentSchema.fields.filter(f => f.required);
      const allRequiredFilled = requiredFields.every(f => 
        sub.formData?.[f.id] !== undefined && sub.formData[f.id] !== ''
      );
      return hasImage || allRequiredFilled;
    }
    
    return hasImage;
  };

  const handleNext = () => {
    if (currentDocIndex < totalDocs - 1) {
      setCurrentDocIndex(prev => prev + 1);
    }
  };

  const handleSubmitAll = async () => {
    setIsSubmitting(true);
    
    // Save all submissions
    const allSubmissions: DocumentSubmission[] = session.requiredDocuments.map(docType => ({
      ...submissions[docType],
      documentType: docType,
      submittedAt: new Date().toISOString(),
    }));

    const updatedSession: Session = {
      ...session,
      status: 'submitted',
      submissions: allSubmissions,
    };

    saveSession(updatedSession);
    setSession(updatedSession);
    setIsComplete(true);
    setIsSubmitting(false);
  };

  const isLastDoc = currentDocIndex === totalDocs - 1;
  const canProceed = isDocumentComplete();

  return (
    <div className="min-h-screen bg-slate-950 py-6 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
            S
          </div>
          <h1 className="text-xl font-semibold text-white">{session.patientName}</h1>
          <p className="text-slate-400 text-sm">Document Submission</p>
        </div>

        {/* Progress */}
        <div className="flex gap-1 mb-6">
          {session.requiredDocuments.map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                idx < currentDocIndex ? 'bg-emerald-500' :
                idx === currentDocIndex ? 'bg-violet-500' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Current Document */}
        <Card>
          <div className="text-center mb-6">
            <span className="text-4xl mb-2 block">{currentDocInfo?.icon}</span>
            <h2 className="text-lg font-semibold text-white">{currentDocInfo?.name}</h2>
            <p className="text-sm text-slate-400">Document {currentDocIndex + 1} of {totalDocs}</p>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <ImageUploader
              currentImage={submissions[currentDocType]?.imageUrl}
              onUpload={handleImageUpload}
            />
          </div>

          {/* Digital Form Fields */}
          {currentSchema?.fields && currentSchema.fields.length > 0 && (
            <div className="border-t border-slate-800 pt-6">
              <h3 className="text-sm font-medium text-slate-400 mb-4">Or fill the digital form</h3>
              <div className="space-y-4">
                {currentSchema.fields.map(field => (
                  <FormFieldInput
                    key={field.id}
                    field={field}
                    value={submissions[currentDocType]?.formData?.[field.id] || ''}
                    onChange={(value) => handleFormChange(field.id, value)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            {isLastDoc ? (
              <Button 
                onClick={handleSubmitAll} 
                className="w-full" 
                size="lg"
                disabled={!canProceed}
                isLoading={isSubmitting}
              >
                Submit All Documents ✓
              </Button>
            ) : (
              <Button 
                onClick={handleNext} 
                className="w-full" 
                size="lg"
                disabled={!canProceed}
              >
                Next Document →
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// Image Upload Component
function ImageUploader({ 
  currentImage, 
  onUpload 
}: { 
  currentImage?: string; 
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onUpload}
        className="hidden"
      />
      
      {currentImage ? (
        <div className="relative">
          <img 
            src={currentImage} 
            alt="Uploaded document" 
            className="w-full h-48 object-cover rounded-xl"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-3 right-3 px-3 py-1.5 bg-slate-900/80 backdrop-blur text-white text-sm rounded-lg hover:bg-slate-800"
          >
            📷 Retake
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-48 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-violet-500 hover:text-violet-400 transition-colors"
        >
          <span className="text-4xl mb-2">📷</span>
          <span className="font-medium">Take Photo or Upload</span>
          <span className="text-sm">Tap to capture document</span>
        </button>
      )}
    </div>
  );
}

// Form Field Input Component
function FormFieldInput({ 
  field, 
  value, 
  onChange 
}: { 
  field: FormField; 
  value: string | number; 
  onChange: (value: string | number) => void;
}) {
  const baseClasses = "w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 min-h-[48px]";

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">
        {field.label}
        {field.required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      {field.type === 'text' && (
        <input
          type="text"
          value={value as string}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={baseClasses}
        />
      )}
      
      {field.type === 'number' && (
        <input
          type="number"
          value={value as number}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={baseClasses}
        />
      )}
      
      {field.type === 'date' && (
        <input
          type="date"
          value={value as string}
          onChange={e => onChange(e.target.value)}
          className={baseClasses}
        />
      )}
      
      {field.type === 'dropdown' && (
        <select
          value={value as string}
          onChange={e => onChange(e.target.value)}
          className={baseClasses}
        >
          <option value="">Select...</option>
          {field.options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}
    </div>
  );
}

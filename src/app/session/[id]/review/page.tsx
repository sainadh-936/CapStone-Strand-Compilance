'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Card, Badge } from '@/components/ui';
import { getSession, saveSession } from '@/lib/storage';
import { getDocumentTypeInfo } from '@/features/documents/documentTypes';
import type { Session } from '@/types';

export default function ReviewPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const s = getSession(sessionId);
    if (!s) {
      router.push('/dashboard');
      return;
    }
    setSession(s);
    setIsLoading(false);
  }, [sessionId, router]);

  const generateLink = () => {
    if (!session) return;
    
    const updatedSession: Session = {
      ...session,
      status: 'link_generated',
      linkGeneratedAt: new Date().toISOString(),
    };
    saveSession(updatedSession);
    setSession(updatedSession);
  };

  const getSubmissionUrl = () => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/submit/${sessionId}`;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getSubmissionUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareWhatsApp = () => {
    const text = `Please submit the required documents for your sample collection:\n${getSubmissionUrl()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (isLoading || !session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" />
      </div>
    );
  }

  const isLinkGenerated = session.status !== 'created';

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-sm text-slate-400 mb-4">
          <span className="px-3 py-1.5 bg-slate-800 rounded-full">Step 4 of 4</span>
          <span>•</span>
          <span>{session.patientName}</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          {isLinkGenerated ? 'Collection Link Ready' : 'Generate Collection Link'}
        </h1>
        <p className="text-slate-400 mt-4 text-lg">
          {isLinkGenerated 
            ? 'Share this link with the patient or phlebotomist' 
            : 'Review the session details and generate a shareable link'
          }
        </p>
      </div>

      {/* Session Summary */}
      <Card className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{session.patientName}</h3>
            <p className="text-slate-400">📱 {session.phoneNumber}</p>
          </div>
          <Badge status={session.status} />
        </div>

        <div className="border-t border-slate-800 pt-6 mt-6">
          <h4 className="text-sm font-medium text-slate-400 mb-4">Required Documents</h4>
          <div className="space-y-3">
            {session.requiredDocuments.map(docType => {
              const info = getDocumentTypeInfo(docType);
              const schema = session.formSchemas[docType];
              const fieldCount = schema?.fields?.length || 0;
              return (
                <div key={docType} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{info?.icon}</span>
                    <span className="text-white text-sm">{info?.name}</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {fieldCount > 0 ? `${fieldCount} fields` : 'Image only'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Link Generation / Share */}
      {!isLinkGenerated ? (
        <Button onClick={generateLink} className="w-full" size="lg">
          🔗 Generate Shareable Link
        </Button>
      ) : (
        <Card className="bg-gradient-to-br from-violet-950/50 to-indigo-950/50 border-violet-800/50">
          <div className="mb-4">
            <label className="text-sm text-slate-400 block mb-2">Submission Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={getSubmissionUrl()}
                className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white text-sm"
              />
              <Button onClick={copyLink} variant="secondary">
                {copied ? '✓ Copied' : '📋 Copy'}
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={shareWhatsApp} variant="outline" className="flex-1">
              <span className="mr-2">💬</span> Share via WhatsApp
            </Button>
            <Button 
              onClick={() => window.open(getSubmissionUrl(), '_blank')} 
              variant="ghost"
              className="flex-1"
            >
              <span className="mr-2">👁️</span> Preview
            </Button>
          </div>
        </Card>
      )}

      <div className="flex gap-4 mt-8">
        <Button 
          variant="outline" 
          onClick={() => router.push(`/session/${sessionId}/forms`)}
          className="flex-1"
        >
          ← Edit Forms
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => router.push('/dashboard')}
          className="flex-1"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}

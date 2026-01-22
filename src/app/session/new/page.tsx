'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Button, Input, Card } from '@/components/ui';
import { createSessionSchema, type CreateSessionInput } from '@/features/sessions/schemas';
import { saveSession } from '@/lib/storage';
import type { Session } from '@/types';

export default function NewSessionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Partial<CreateSessionInput>>({
    patientName: '',
    phoneNumber: '',
    gender: undefined,
    city: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Validate with Zod
    const result = createSessionSchema.safeParse({
      ...formData,
      age: formData.age ? Number(formData.age) : undefined,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    // Create new session
    const session: Session = {
      id: uuidv4(),
      patientName: result.data.patientName,
      phoneNumber: result.data.phoneNumber,
      age: result.data.age,
      gender: result.data.gender,
      city: result.data.city,
      status: 'created',
      requiredDocuments: [],
      formSchemas: {},
      submissions: [],
      createdAt: new Date().toISOString(),
    };

    saveSession(session);
    
    // Navigate to document selection
    router.push(`/session/${session.id}/documents`);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Create Collection Session
        </h1>
        <p className="text-slate-400 mt-4 text-lg">
          Enter patient details to start a new sample collection session
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Patient Name"
            placeholder="Enter patient's full name"
            required
            value={formData.patientName || ''}
            onChange={e => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
            error={errors.patientName}
          />

          <Input
            label="Phone Number"
            placeholder="+91 98765 43210"
            type="tel"
            required
            value={formData.phoneNumber || ''}
            onChange={e => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
            error={errors.phoneNumber}
          />

          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Age"
              placeholder="Optional"
              type="number"
              min={0}
              max={150}
              value={formData.age || ''}
              onChange={e => setFormData(prev => ({ ...prev, age: e.target.value ? Number(e.target.value) : undefined }))}
              error={errors.age}
            />

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Gender
              </label>
              <select
                value={formData.gender || ''}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  gender: e.target.value as 'male' | 'female' | 'other' | undefined 
                }))}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 min-h-[48px]"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <Input
            label="City"
            placeholder="Optional"
            value={formData.city || ''}
            onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
            error={errors.city}
          />

          <div className="pt-6">
            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Continue to Document Selection
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

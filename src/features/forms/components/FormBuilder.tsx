'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from '@/components/ui';
import { SortableField } from './SortableField';
import type { FormField, FieldType, FormSchema, DocumentType } from '@/types';
import { getDocumentTypeInfo } from '@/features/documents/documentTypes';

interface FormBuilderProps {
  documentType: DocumentType;
  initialSchema?: FormSchema;
  onSave: (schema: FormSchema) => void;
  onBack: () => void;
}

export function FormBuilder({ documentType, initialSchema, onSave, onBack }: FormBuilderProps) {
  const [fields, setFields] = useState<FormField[]>(initialSchema?.fields || []);
  const docInfo = getDocumentTypeInfo(documentType);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: uuidv4(),
      type,
      label: '',
      required: false,
      placeholder: '',
      options: type === 'dropdown' ? [] : undefined,
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFields(items => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = () => {
    onSave({
      documentType,
      fields,
    });
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{docInfo?.icon}</span>
          <h2 className="text-xl font-semibold text-white">{docInfo?.name}</h2>
        </div>
        <p className="text-slate-400">Build a digital form for this document (optional)</p>
      </div>

      {/* Add Field Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button size="sm" variant="outline" onClick={() => addField('text')}>
          + Text
        </Button>
        <Button size="sm" variant="outline" onClick={() => addField('number')}>
          + Number
        </Button>
        <Button size="sm" variant="outline" onClick={() => addField('dropdown')}>
          + Dropdown
        </Button>
        <Button size="sm" variant="outline" onClick={() => addField('date')}>
          + Date
        </Button>
      </div>

      {/* Form Fields */}
      {fields.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/30 rounded-xl border border-dashed border-slate-700">
          <p className="text-slate-400 mb-2">No fields added yet</p>
          <p className="text-sm text-slate-500">
            Add fields above, or skip to use image upload only
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3 mb-6">
              {fields.map(field => (
                <SortableField
                  key={field.id}
                  field={field}
                  onDelete={() => deleteField(field.id)}
                  onUpdate={(updates) => updateField(field.id, updates)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-8">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={handleSave} className="flex-1">
          {fields.length > 0 ? `Save Form (${fields.length} fields)` : 'Skip Form →'}
        </Button>
      </div>
    </div>
  );
}

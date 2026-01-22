'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { FormField } from '@/types';

interface SortableFieldProps {
  field: FormField;
  onDelete: () => void;
  onUpdate: (updates: Partial<FormField>) => void;
}

export function SortableField({ field, onDelete, onUpdate }: SortableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const fieldTypeLabels: Record<string, string> = {
    text: 'Text Input',
    number: 'Number',
    dropdown: 'Dropdown',
    date: 'Date',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-slate-800/50 border border-slate-700 rounded-xl p-4
        ${isDragging ? 'opacity-50 border-violet-500' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-1 p-1 text-slate-500 hover:text-slate-300 cursor-grab active:cursor-grabbing"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>

        {/* Field Content */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 bg-slate-700 text-slate-300 rounded">
              {fieldTypeLabels[field.type]}
            </span>
          </div>

          <input
            type="text"
            value={field.label}
            onChange={e => onUpdate({ label: e.target.value })}
            placeholder="Field label"
            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <input
            type="text"
            value={field.placeholder || ''}
            onChange={e => onUpdate({ placeholder: e.target.value })}
            placeholder="Placeholder text (optional)"
            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          {field.type === 'dropdown' && (
            <input
              type="text"
              value={field.options?.join(', ') || ''}
              onChange={e => onUpdate({ options: e.target.value.split(',').map(o => o.trim()).filter(Boolean) })}
              placeholder="Options (comma separated)"
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          )}

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={field.required}
              onChange={e => onUpdate({ required: e.target.checked })}
              className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-violet-500 focus:ring-violet-500"
            />
            <span className="text-sm text-slate-400">Required field</span>
          </label>
        </div>

        {/* Delete Button */}
        <button
          onClick={onDelete}
          className="p-2 text-slate-500 hover:text-red-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

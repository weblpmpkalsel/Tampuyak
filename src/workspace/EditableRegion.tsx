import React, { useState, useEffect, useRef } from 'react';
import { useWorkspace } from './WorkspaceContext';

interface EditableRegionProps {
  id: string;
  type?: 'text' | 'multiline';
  fallback: string;
  className?: string;
  as?: React.ElementType;
  children?: React.ReactNode;
  [key: string]: any;
}

export const EditableRegion: React.FC<EditableRegionProps> = ({
  id,
  type = 'text',
  fallback,
  className = '',
  as: Component = 'span',
  children,
  ...rest
}) => {
  const { state, setOverride, getOverrideValue } = useWorkspace();
  const [isEditing, setIsEditing] = useState(false);
  const [draftValue, setDraftValue] = useState('');
  const currentValue = getOverrideValue(id, fallback);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (state.workspaceMode !== 'edit') return;
    e.stopPropagation();
    setDraftValue(currentValue);
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setDraftValue(currentValue);
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey || type === 'text')) {
      e.preventDefault();
      applyEdit();
    }
  };

  const applyEdit = () => {
    if (!draftValue.trim()) {
      alert("Teks tidak boleh kosong.");
      setDraftValue(currentValue);
      setIsEditing(false);
      return;
    }
    if (draftValue !== currentValue) {
      setOverride(id, {
        id,
        type: type as any,
        value: draftValue,
      });
    }
    setIsEditing(false);
  };

  const handleBlur = () => {
    // Optionally apply or cancel on blur. Let's apply on blur to be standard.
    applyEdit();
  };

  if (isEditing) {
    const commonProps = {
      value: draftValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraftValue(e.target.value),
      onKeyDown: handleKeyDown,
      onBlur: handleBlur,
      className: `${className} outline-none ring-2 ring-blue-500 bg-blue-50 text-black`,
      style: { width: '100%' }
    };

    return type === 'multiline' ? (
      <textarea maxLength={2000}
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        {...commonProps}
        rows={Math.max(1, draftValue.split('\n').length)}
      />
    ) : (
      <input maxLength={255}
        type="text"
        ref={inputRef as React.RefObject<HTMLInputElement>}
        {...commonProps}
      />
    );
  }

  const isEditable = state.workspaceMode === 'edit';
  
  // Format line breaks for multiline
  let renderedContent: React.ReactNode = currentValue;
  if (type === 'multiline' && typeof currentValue === 'string') {
    renderedContent = currentValue.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < currentValue.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  }

  return (
    <Component
      onDoubleClick={handleDoubleClick}
      className={`${className} ${isEditable ? 'hover:ring-2 hover:ring-blue-200 cursor-text transition-all duration-200' : ''}`}
      title={isEditable ? 'Double click to edit' : undefined}
      {...rest}
    >
      {renderedContent}
    </Component>
  );
};

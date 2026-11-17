import React from 'react';
import { ValidationStatus } from '../EnterpriseValidationTypes';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

interface ValidationBadgeProps {
  status: ValidationStatus;
  label?: string;
  className?: string;
}

export const ValidationBadge: React.FC<ValidationBadgeProps> = ({ status, label, className = '' }) => {
  const styles = {
    PASS: 'bg-green-100 text-green-800 border-green-200',
    WARNING: 'bg-amber-100 text-amber-800 border-amber-200',
    ERROR: 'bg-red-100 text-red-800 border-red-200',
    CRITICAL: 'bg-rose-100 text-rose-900 border-rose-300 font-bold',
  };

  const icons = {
    PASS: <CheckCircle className="w-3.5 h-3.5" />,
    WARNING: <AlertTriangle className="w-3.5 h-3.5" />,
    ERROR: <XCircle className="w-3.5 h-3.5" />,
    CRITICAL: <XCircle className="w-3.5 h-3.5 fill-rose-200" />
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs border ${styles[status]} ${className}`}>
      {icons[status]}
      {label || status}
    </span>
  );
};

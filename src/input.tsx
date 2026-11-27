import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className = '', ...props }, ref) {
  return <input ref={ref} className={`ui-input ${className}`} data-slot="input" {...props}/>;
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select({ className = '', children, ...props }, ref) {
  return <select ref={ref} className={`ui-select ${className}`} data-slot="select" {...props}>{children}</select>;
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className = '', ...props }, ref) {
  return <textarea ref={ref} className={`ui-textarea ${className}`} data-slot="textarea" {...props}/>;
});

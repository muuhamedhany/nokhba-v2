'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from '@phosphor-icons/react';
import { Button } from './Button';
import { Input } from './Input';

interface PromptModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  placeholder?: string;
  initialValue?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export function PromptModal({
  isOpen,
  title,
  description,
  placeholder = '',
  initialValue = '',
  confirmText = 'إضافة',
  cancelText = 'إلغاء',
  onConfirm,
  onCancel
}: PromptModalProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue);
      setError('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError('يرجى إدخال النص المطلوب');
      return;
    }
    onConfirm(trimmed);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-forest/40 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-[2rem] p-6 shadow-2xl border border-black/5 flex flex-col gap-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-xl text-forest">{title}</h3>
              <button
                type="button"
                onClick={onCancel}
                className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-forest/50 hover:text-forest hover:bg-black/10 transition-colors"
              >
                <X weight="bold" />
              </button>
            </div>

            {description && (
              <p className="text-forest/70 text-sm">{description}</p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                ref={inputRef}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (error) setError('');
                }}
                placeholder={placeholder}
                error={error}
                className="w-full text-base"
              />

              <div className="flex items-center justify-end gap-3 mt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                  className="px-6 py-2 text-forest/70 hover:text-forest"
                >
                  {cancelText}
                </Button>
                <Button
                  type="submit"
                  className="px-6 py-2 bg-gold text-forest font-bold hover:bg-gold/90"
                >
                  {confirmText}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

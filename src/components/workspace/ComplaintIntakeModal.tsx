import React, { useState } from 'react';
import { PlusCircle, X, Send, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { TonePreset } from '../../types';

interface ComplaintIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (complaintText: string, tone: TonePreset) => Promise<void>;
  isSubmitting: boolean;
}

const SAMPLE_TEMPLATES = [
  {
    label: 'Late & Damaged Espresso Machine',
    text: 'I received my order #48192 three days late, and when I opened the box, the espresso machine was dented and leaking water. Your delivery driver was dismissive. I demand an immediate full refund.',
  },
  {
    label: 'Double Subscription Billing',
    text: 'I was double billed for my Enterprise Cloud subscription renewal on October 1st. My card statement shows two identical charges of $249.99. Please refund the duplicate transaction immediately.',
  },
  {
    label: 'Expired Warranty Safety Concern',
    text: 'My smart home thermostat purchased 16 months ago has started smoking from the rear capacitor. The 12-month warranty is expired, but this is a hazardous defect. I expect a free replacement unit.',
  },
];

export const ComplaintIntakeModal: React.FC<ComplaintIntakeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [text, setText] = useState('');
  const [tone, setTone] = useState<TonePreset>('empathetic');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || text.trim().length < 10) {
      setErrorMessage('Please enter a complaint statement of at least 10 characters.');
      return;
    }
    setErrorMessage(null);
    try {
      await onSubmit(text.trim(), tone);
      setText('');
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit complaint for analysis.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#14141c] border border-white/15 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Intake Customer Complaint</h3>
            <span className="text-xs text-white/50 font-mono">
              Process through Live Policy Retrieval & Guardrail Pipeline
            </span>
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="mb-4">
          <span className="text-[10px] font-mono uppercase text-white/40 block mb-1.5">
            Quick Fill Sample Inbound:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_TEMPLATES.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setText(sample.text)}
                className="px-2.5 py-1 rounded-md text-[11px] bg-white/[0.04] hover:bg-white/[0.08] text-white/80 border border-white/10 transition-colors text-left"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-white/70 block mb-1.5">
              Customer Complaint Statement
            </label>
            <textarea
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste raw inbound customer message (email, chat, or ticket transcript)..."
              className="w-full p-3 rounded-xl bg-black/50 border border-white/10 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-white/70 block mb-1.5">
              Initial Response Tone Preference
            </label>
            <div className="flex items-center gap-2">
              {(['empathetic', 'concise', 'formal'] as TonePreset[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${
                    tone === t
                      ? 'bg-purple-600/30 text-purple-200 border-purple-500/60 shadow-sm'
                      : 'bg-white/[0.03] text-white/60 border-white/[0.08] hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={isSubmitting || !text.trim()}
              icon={<Send className="w-3.5 h-3.5" />}
            >
              {isSubmitting ? 'Analyzing & Retrieving...' : 'Submit to Pipeline'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

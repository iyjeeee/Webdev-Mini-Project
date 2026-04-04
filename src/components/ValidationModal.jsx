import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

// Config per type — icon, colors, accent bar
const TYPE_CONFIG = {
  error: {
    icon:      AlertCircle,
    iconColor: 'text-red-500',
    bg:        'bg-red-50',
    border:    'border-red-200',
    accent:    'bg-red-500',
    title:     'text-red-800',
    text:      'text-red-600',
    dot:       'bg-red-400',
  },
  success: {
    icon:      CheckCircle,
    iconColor: 'text-green-500',
    bg:        'bg-green-50',
    border:    'border-green-200',
    accent:    'bg-green-500',
    title:     'text-green-800',
    text:      'text-green-600',
    dot:       'bg-green-400',
  },
  warning: {
    icon:      AlertTriangle,
    iconColor: 'text-yellow-500',
    bg:        'bg-yellow-50',
    border:    'border-yellow-200',
    accent:    'bg-[#FBC02D]',
    title:     'text-yellow-800',
    text:      'text-yellow-700',
    dot:       'bg-yellow-400',
  },
  info: {
    icon:      Info,
    iconColor: 'text-blue-500',
    bg:        'bg-blue-50',
    border:    'border-blue-200',
    accent:    'bg-blue-500',
    title:     'text-blue-800',
    text:      'text-blue-600',
    dot:       'bg-blue-400',
  },
};

const ValidationModal = ({
  isOpen,           // boolean — controls visibility
  onClose,          // () => void
  type = 'error',   // 'error' | 'success' | 'warning' | 'info'
  title,            // string — modal heading
  messages = [],    // string[] — list of messages/errors
  message,          // string — single message shorthand
  autoClose = false, // auto-close after ms (0 = off)
  autoCloseMs = 2500,
}) => {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.error;
  const Icon = cfg.icon;
  const allMessages = message ? [message] : messages; // normalize to array

  // Auto-close for success messages
  useEffect(() => {
    if (!isOpen || !autoClose) return;
    const t = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(t);
  }, [isOpen, autoClose, autoCloseMs, onClose]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // Backdrop — click outside to close
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()} // prevent backdrop close on inner click
      >
        {/* Colored accent top bar — matches brand style */}
        <div className={`h-1.5 w-full ${cfg.accent}`} />

        {/* Header row */}
        <div className="flex items-start justify-between px-6 pt-5 pb-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full ${cfg.bg} flex items-center justify-center shrink-0`}>
              <Icon size={18} className={cfg.iconColor} />
            </div>
            <h3 className={`font-bold text-sm leading-tight ${cfg.title}`}>
              {title || (type === 'error' ? 'Validation Error' : type === 'success' ? 'Success' : 'Notice')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100 cursor-pointer shrink-0 ml-2"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Message list */}
        <div className="px-6 py-4">
          {allMessages.length === 1 ? (
            // Single message — plain paragraph
            <p className={`text-sm leading-relaxed ${cfg.text}`}>{allMessages[0]}</p>
          ) : (
            // Multiple messages — bulleted list
            <ul className="space-y-1.5">
              {allMessages.map((msg, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0 mt-1.5`} />
                  <span className={`text-sm leading-relaxed ${cfg.text}`}>{msg}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer close button — styled like Login button for consistency */}
        <div className="px-6 pb-5">
          <div className="flex rounded-lg overflow-hidden shadow-sm">
            <div className={`w-1.5 ${cfg.accent} shrink-0`} />
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-[#111111] text-white font-bold text-sm tracking-wide hover:bg-[#222222] active:scale-[.99] transition-all cursor-pointer"
            >
              {type === 'success' ? 'Done' : 'Got it'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationModal;

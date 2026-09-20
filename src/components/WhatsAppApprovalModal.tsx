import { useState } from 'react';
import { X, MessageSquare, Check, Copy, User, Calendar, Divide, ShieldAlert, Phone } from 'lucide-react';
import { Expense } from '../types';
import { formatCurrency, generateWhatsAppApprovalMessage } from '../utils/calculator';

const DEFAULT_ROHIT_PHONE = '7065067030';

interface WhatsAppApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
  payerName: string;
  savedPhone: string;
  onSavePhone: (phone: string) => void;
}

export function WhatsAppApprovalModal({
  isOpen,
  onClose,
  expense,
  payerName,
  savedPhone,
  onSavePhone,
}: WhatsAppApprovalModalProps) {
  const [copied, setCopied] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(savedPhone || DEFAULT_ROHIT_PHONE);

  if (!isOpen || !expense) return null;

  // Build the approval URL pointing back to the current website with ?approve=expense.id&auto=1 for instant 1-tap approval
  const baseUrl = window.location.origin + window.location.pathname;
  const approvalUrl = `${baseUrl}?approve=${encodeURIComponent(expense.id)}&auto=1`;

  const messageText = generateWhatsAppApprovalMessage(expense, payerName, approvalUrl);

  const handlePhoneChange = (val: string) => {
    // Keep only numbers
    const cleaned = val.replace(/\D/g, '');
    setPhoneNumber(cleaned);
    onSavePhone(cleaned);
  };

  const handleSendWhatsApp = () => {
    const encoded = encodeURIComponent(messageText);
    let url = `https://api.whatsapp.com/send?text=${encoded}`;
    if (phoneNumber.trim().length >= 10) {
      // If 10 digits without country code, prefix India +91
      const fullNumber = phoneNumber.length === 10 ? `91${phoneNumber}` : phoneNumber;
      url = `https://wa.me/${fullNumber}?text=${encoded}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const equalThird = expense.amount / 3;
  const hasMultipleItems = expense.items && expense.items.length > 1;

  return (
    <div
      id="whatsapp-approval-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-5 sm:p-6 text-zinc-100 animate-in zoom-in-95 duration-150 relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-md shadow-amber-950/40 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {hasMultipleItems ? `${expense.items!.length} Saman Added!` : 'Approval Request Sent'}
            </h3>
            <p className="text-xs text-amber-400/90 font-medium">
              Rohit ke approval ke baad hi hisaab me judega
            </p>
          </div>
        </div>

        {/* Expense Summary Box */}
        <div className="bg-zinc-950 rounded-xl p-3.5 border border-zinc-800/80 my-3 space-y-2 text-xs">
          {hasMultipleItems ? (
            <div>
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                Saman ki List ({expense.items!.length} items):
              </span>
              <div className="space-y-1 bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/60 max-h-36 overflow-y-auto">
                {expense.items!.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-zinc-200 truncate pr-2">
                      <strong className="text-zinc-500 mr-1.5">{idx + 1}.</strong>
                      {it.name}
                    </span>
                    <span className="font-semibold text-amber-300 shrink-0">
                      {formatCurrency(it.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Saman / Item:</span>
              <span className="font-bold text-white truncate max-w-[200px]">{expense.title}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-zinc-400 font-medium">Total Bill Amount:</span>
            <span className="text-base font-black text-amber-400">
              {formatCurrency(expense.amount)}
            </span>
          </div>

          <div className="flex items-center justify-between text-zinc-400 pt-1.5 border-t border-zinc-800/60">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-zinc-500" />
              Khareeda:
            </span>
            <span className="font-semibold text-zinc-200">{payerName}</span>
          </div>

          <div className="flex items-center justify-between text-zinc-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              Date:
            </span>
            <span className="text-zinc-300">{expense.date}</span>
          </div>

          <div className="flex items-center justify-between pt-1.5 border-t border-zinc-800/60 bg-amber-950/20 -mx-3.5 -mb-3.5 p-2.5 rounded-b-xl">
            <span className="text-amber-400 font-medium flex items-center gap-1">
              <Divide className="w-3.5 h-3.5" />
              1/3 Hissa per person:
            </span>
            <span className="font-bold text-amber-300">
              {formatCurrency(equalThird)}
            </span>
          </div>
        </div>

        {/* Pre-configured Rohit WhatsApp Number */}
        <div className="mb-4">
          <label className="block text-[11px] font-semibold text-zinc-300 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-emerald-400" />
              Rohit ka WhatsApp Number:
            </span>
            <span className="text-emerald-400/90 text-[10px] font-medium">Direct chat linked</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-zinc-500 font-mono">+91</span>
            <input
              type="tel"
              placeholder="7065067030"
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="w-full pl-11 pr-3 py-2 bg-zinc-950 border border-emerald-500/40 rounded-xl text-xs text-zinc-100 placeholder-zinc-600 focus:outline-hidden focus:border-emerald-500 transition-colors font-mono font-semibold"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleSendWhatsApp}
            id="send-whatsapp-approval-btn"
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 active:scale-[0.99]"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>Rohit (+91 {phoneNumber || '7065067030'}) ko WhatsApp Bhejo</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopy}
              className="py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-zinc-700/50"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy Message</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="py-2.5 px-3 bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-xl transition-colors text-center border border-zinc-800"
            >
              Band Karein
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

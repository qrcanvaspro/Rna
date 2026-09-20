import { useState, type FormEvent } from 'react';
import { RotateCcw, AlertTriangle, X, Lock } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResetConfirmModal({ isOpen, onClose, onConfirm }: ResetConfirmModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === '123225') {
      setPassword('');
      setError('');
      onConfirm();
    } else {
      setError('Galat password! Dobara koshish karein.');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <div
      id="reset-confirm-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="w-full max-w-md bg-zinc-900 border border-rose-500/40 rounded-2xl shadow-2xl p-5 sm:p-6 text-zinc-100 animate-in zoom-in-95 duration-150 relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-950/40 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Reset All Expenses to ₹0?
            </h3>
            <p className="text-xs text-rose-400/90 font-medium">
              Sara hisaab delete hoga aur balance 0 ho jayega
            </p>
          </div>
        </div>

        <p className="text-xs text-zinc-300 mb-4 bg-rose-950/20 border border-rose-900/30 p-3 rounded-xl leading-relaxed">
          ⚠️ Yeh karne se <strong>Rohit, Nitish aur Arpit</strong> ke saare kharche poori tarah delete ho jayenge aur har kisi ka balance <strong>₹0.00</strong> ho jayega.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-zinc-400" />
              Security Password Dalein:
            </label>
            <input
              type="password"
              inputMode="numeric"
              autoFocus
              placeholder="Security password dalein"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-rose-500 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-hidden transition-colors"
            />
            {error && (
              <p className="text-xs text-rose-400 mt-1 font-medium">{error}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="submit"
              id="confirm-full-reset-btn"
              className="py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950/50 active:scale-[0.99]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Haan, Sara Delete Karein</span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl transition-colors text-center"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { X, Check, CheckCircle, ShieldCheck, User, Calendar, Divide } from 'lucide-react';
import { Expense } from '../types';
import { formatCurrency } from '../utils/calculator';

interface IncomingApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (expense: Expense) => void;
  onReject: (expense: Expense) => void;
  expense: Expense | null;
  payerName: string;
}

export function IncomingApprovalModal({
  isOpen,
  onClose,
  onApprove,
  onReject,
  expense,
  payerName,
}: IncomingApprovalModalProps) {
  if (!isOpen || !expense) return null;

  const equalThird = expense.amount / 3;
  const hasMultipleItems = expense.items && expense.items.length > 1;

  return (
    <div
      id="incoming-approval-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="w-full max-w-md bg-zinc-900 border border-amber-500/30 rounded-2xl shadow-2xl p-5 sm:p-6 text-zinc-100 animate-in zoom-in-95 duration-150 relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-zinc-800 transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-950/50 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-white tracking-tight">
              {hasMultipleItems ? `Approve ${expense.items!.length} Items?` : 'Approve Room Expense?'}
            </h3>
            <p className="text-xs text-amber-300/90 font-medium">
              {payerName} ne is saman ko approve karne ke liye bheja hai
            </p>
          </div>
        </div>

        {/* Details Box */}
        <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800 my-3 space-y-2.5 text-xs">
          {hasMultipleItems ? (
            <div>
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                Saman ki List ({expense.items!.length} items):
              </span>
              <div className="space-y-1.5 bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/60 max-h-40 overflow-y-auto">
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
              <span className="font-bold text-white text-sm truncate max-w-[200px]">
                {expense.title}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-zinc-400 font-medium">Total Bill Amount:</span>
            <span className="text-base font-black text-emerald-400">
              {formatCurrency(expense.amount)}
            </span>
          </div>

          <div className="flex items-center justify-between text-zinc-400 pt-1.5 border-t border-zinc-800/60">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-zinc-500" />
              Khareeda (Payer):
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

          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 bg-emerald-950/25 -mx-4 -mb-4 p-3 rounded-b-xl">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Divide className="w-3.5 h-3.5" />
              Sabhi ka 1/3 Hissa:
            </span>
            <span className="font-bold text-emerald-300">
              {formatCurrency(equalThird)} / person
            </span>
          </div>
        </div>

        <p className="text-[11px] text-zinc-400 my-3 text-center">
          Approve karte hi yeh turant RNA room ke total hisaab me jud jayega.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onApprove(expense)}
            id="confirm-approve-expense-btn"
            className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/50 active:scale-[0.99]"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Approve Karein</span>
          </button>

          <button
            onClick={() => onReject(expense)}
            id="reject-expense-btn"
            className="py-3 px-4 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-[0.99]"
          >
            <X className="w-4 h-4" />
            <span>Reject Karein</span>
          </button>
        </div>
      </div>
    </div>
  );
}

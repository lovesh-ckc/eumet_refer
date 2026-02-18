import { useState } from "react";
import { X, AlertCircle, ChevronDown, Check } from "lucide-react";

interface OffboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, notes: string) => void;
  patientName: string;
}

const OFFBOARD_REASONS = [
  "Completed treatment",
  "Deceased",
  "Lost to follow-up",
  "Monitoring inappropriate",
  "No longer needs monitoring",
  "Recovered",
  "Other reason"
];

export function OffboardModal({ isOpen, onClose, onConfirm, patientName }: OffboardModalProps) {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">STOP MONITORING PATIENT</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Are you sure?</h2>
            <p className="text-gray-600">Please provide details for not monitoring going forward.</p>
          </div>

          {/* Reason Selector */}
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className={`w-full h-12 px-4 rounded-xl border flex items-center justify-between transition-all ${
                showDropdown ? 'border-gray-900 ring-1 ring-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <span className={reason ? "text-gray-900 font-medium" : "text-gray-400"}>
                {reason || "Provide details"}
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 max-h-60 overflow-y-auto py-1">
                  {OFFBOARD_REASONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setReason(r);
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center justify-between group"
                    >
                      {r}
                      {reason === r && <Check className="w-4 h-4 text-red-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Notes (Conditional if 'Other' or always? User prompt implies just reason dropdown + details input usually means text if needed) 
              The prompt shows "Provide details" as the dropdown placeholder, and then a list. 
              If "Other reason" is selected, we might need a text area. 
              Let's add an optional text area that appears or is always there if they want to add more context.
          */}
          {reason && (
             <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes (optional)..."
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:border-red-300 focus:ring-4 focus:ring-red-50 focus:outline-none transition-all resize-none h-24"
                />
             </div>
          )}

          {/* Warning */}
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 leading-relaxed">
            <span className="font-bold text-gray-900">{patientName}</span> will be notified that their journey with Huma has ended. The account will be deactivated and they will no longer have access to it.
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 pt-2 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 h-12 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onConfirm(reason, notes)}
            disabled={!reason}
            className="flex-1 h-12 rounded-full bg-gray-200 text-white font-medium disabled:cursor-not-allowed data-[active=true]:bg-red-600 data-[active=true]:hover:bg-red-700 transition-colors"
            data-active={!!reason}
          >
            Stop monitoring patient
          </button>
        </div>

      </div>
    </div>
  );
}

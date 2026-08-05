'use client';

import React from 'react';
import { X, ShieldCheck, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-panel max-w-md w-full p-6 rounded-2xl border border-emerald-500/30 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">Firebase Authentication</h2>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to securely isolate your health telemetry and conversation history.
          </p>
        </div>

        {user ? (
          <div className="text-center py-4 space-y-3">
            <p className="text-sm text-emerald-400 font-medium">
              Signed in as {user.email || user.displayName}
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-800 text-slate-200 font-semibold rounded-xl text-sm hover:bg-slate-700 transition-colors"
            >
              Continue to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={async () => {
                await signInWithGoogle();
                onClose();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Google</span>
            </button>

            <div className="text-center">
              <span className="text-[11px] text-slate-500">
                Firebase security rules restrict data read/write to your unique UID.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

"use client";

import { useCallback, useState } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmState {
  isOpen: boolean;
  message: string;
  resolve: ((value: boolean) => void) | null;
}

export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    message: "",
    resolve: null,
  });

  const confirm = useCallback((message: string) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({ isOpen: true, message, resolve });
    });
  }, []);

  const handleConfirm = () => {
    setConfirmState((prev) => {
      if (prev.resolve) prev.resolve(true);
      return { ...prev, isOpen: false, resolve: null };
    });
  };

  const handleCancel = () => {
    setConfirmState((prev) => {
      if (prev.resolve) prev.resolve(false);
      return { ...prev, isOpen: false, resolve: null };
    });
  };

  // Confirm Dialog with proper animations
  const ConfirmDialog = () => {
    if (!confirmState.isOpen) return null;

    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 text-center sm:p-0 overflow-y-auto">
        {/* Backdrop with Fade-In Effect */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm opacity-0 animate-fade-in transition-opacity duration-300" />

        {/* Modal Box with Slide-Up & Opacity Transition */}
        <div
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-2xl 
          transition-all duration-300 scale-95 opacity-0 animate-slide-up sm:my-8 sm:w-full sm:max-w-lg"
        >
          <div className="bg-white px-6 py-5 sm:p-6">
            <div className="flex items-start">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle
                  className="h-6 w-6 text-red-600"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-4 text-left">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  Confirm Action !!
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {confirmState.message}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
            <button
              type="button"
              className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-100 transition-all"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600 transition-all"
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  return { confirm, ConfirmDialog };
};

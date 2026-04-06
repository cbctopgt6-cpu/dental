
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast, ToastType, ConfirmModal } from './components/Notification';

interface NotificationContextType {
  showToast: (message: string, type?: ToastType) => void;
  confirm: (options: ConfirmOptions) => void;
}

interface ConfirmOptions {
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'info';
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [confirmOptions, setConfirmOptions] = useState<ConfirmOptions & { isOpen: boolean } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    setConfirmOptions({ ...options, isOpen: true });
  }, []);

  const handleCloseToast = () => setToast(null);
  const handleCancelConfirm = () => {
    if (confirmOptions) {
      setConfirmOptions(null);
    }
  };
  const handleConfirm = () => {
    if (confirmOptions) {
      confirmOptions.onConfirm();
      setConfirmOptions(null);
    }
  };

  return (
    <NotificationContext.Provider value={{ showToast, confirm }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
      {confirmOptions && (
        <ConfirmModal
          isOpen={confirmOptions.isOpen}
          title={confirmOptions.title}
          message={confirmOptions.message}
          onConfirm={handleConfirm}
          onCancel={handleCancelConfirm}
          confirmText={confirmOptions.confirmText}
          cancelText={confirmOptions.cancelText}
          type={confirmOptions.type}
        />
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

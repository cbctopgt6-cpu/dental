import React from 'react';

export type ToastType = 'success' | 'error' | 'info';

export const Toast: React.FC<{ message: string; type: ToastType; onClose: () => void }> = ({ message, type, onClose }) => (
  <div style={{ position: 'fixed', top: 20, right: 20, padding: 10, background: '#333', color: '#fff' }}>
    <span>{message}</span>
    <button onClick={onClose}>X</button>
  </div>
);

export const ConfirmModal: React.FC<{
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'info';
}> = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Yes', cancelText = 'No', type = 'info' }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)' }}>
      <div style={{ background:'#fff', padding:20, margin:'100px auto', width:300 }}>
        <h3>{title}</h3>
        <p>{message}</p>
        <button onClick={onConfirm}>{confirmText}</button>
        <button onClick={onCancel}>{cancelText}</button>
      </div>
    </div>
  );
};

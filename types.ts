import React from 'react';

export enum Role {
  ADMIN = 'ADMIN',
  RECEPTIONIST = 'RECEPTIONIST', // Sub-admin/Employee
  DOCTOR = 'DOCTOR',
  RADIOLOGIST = 'RADIOLOGIST',
  PATIENT = 'PATIENT'
}

export interface TestItem {
  id: string;
  name: string;
  price: number;
  category?: 'CBCT' | 'OPG' | 'OTHER'; // New field for logic
}

export interface InventoryLog {
  id: string;
  date: string;
  itemType: 'FILM' | 'DVD';
  action: 'RESTOCK' | 'USAGE' | 'WASTAGE';
  quantity: number;
  remainingStock: number;
  reason?: string; // Invoice ID or "Printer Error" etc.
}

export type ExpenseCategory = 'SALARY' | 'RENT' | 'ELECTRICITY' | 'INTERNET' | 'MAINTENANCE' | 'DEPRECIATION' | 'MARKETING' | 'PURCHASE' | 'OTHER';

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  recordedBy: string;
}

export interface User {
  id: string;
  name: string;
  role: Role;
  loginCode?: string; // Simplified login for demo
}

export interface Doctor extends User {
  specialty: string;
  commissionRate: number; // Percentage
  discountOnly: boolean; // If true, they don't take commission, they give discount to patient
  totalReferred: number;
  code?: string; // New: Serial code starting from 2001
  location?: string; // New: Location of the doctor/clinic
  phone?: string;
  email?: string;
}

export interface Radiologist extends User {
  pendingReports: number;
  totalReports: number;
  totalEarnings: number; // New: Accumulates 20% of test price upon report submission
  specialty?: string;
  commissionRate?: number;
  location?: string;
  phone?: string;
  email?: string;
}

export interface Patient {
  id: string; // Manual ID or Auto-generated
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  invoiceDate: string;
  
  // Clinical
  tests: TestItem[]; // Changed from single testType to array
  referringDoctorId: string;
  assignedRadiologistId: string;
  
  // Financial
  totalAmount: number;
  discountPercentage?: number; // New field
  discountAmount: number;
  finalAmount: number;
  paidAmount: number; // Amount given by client
  changeAmount: number; // Refund amount if they paid more
  dueAmount: number; // Remaining balance
  isFullyPaid: boolean;
  
  // Status
  imagesUploaded: boolean;
  imagesUrl?: string;
  volumeUploaded?: boolean; // New: For DICOM/3D Volume
  volumeData?: string[]; // New: Array of base64 images for scrolling
  volumeUploadedTimestamp?: string; // NEW: Timestamp when volume was uploaded
  reportUploaded: boolean;
  reportContent?: string; // The text content or link
  reportFileUrl?: string; // Mock URL for PDF/Word
  
  // Metadata
  clinicalNotes?: string;
  createdBy?: string; // Track which staff created this

  // Inventory Usage (New)
  dvdUsed?: number;
  film10x12Used?: number;
  film14x17Used?: number;
}

export interface Attendance {
  id: string;
  userId: string;
  userName: string;
  date: string; // YYYY-MM-DD
  checkIn?: string; // ISO string
  checkOut?: string; // ISO string
  status: 'PRESENT' | 'LATE' | 'ABSENT' | 'LEAVE';
  note?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: string; // Changed to string to allow custom categories
  startDate: string;
  expiryDate?: string;
  fileUrl?: string;
  uploadedAt: string;
}

export interface MarketingContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  category: 'DOCTOR' | 'CLINIC' | 'GENERAL';
  lastContacted?: string;
  notes?: string;
}

export interface MarketingLocation {
  id: string;
  locationName: string;
  status: 'GOOD' | 'BAD';
  addressPlan: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}
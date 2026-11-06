import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Application } from '../../../core/models/application.model';

export interface CounselingSlot {
  id: string;
  date: string;
  time: string;
  venue: string;
  mode: 'Offline Campus Counseling' | 'Online Virtual Counseling';
  seatsAvailable: string;
}

export interface BookingReceipt {
  receiptNo: string;
  slotTitle: string;
  slotDate: string;
  slotVenue: string;
  slotMode: string;
  amount: number;
  paymentDate: string;
  txnId: string;
  paymentMethod: string;
}

@Component({
  selector: 'app-applicant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class ApplicantDashboardComponent implements OnInit {
  private applicationService = inject(ApplicationService);
  authService = inject(AuthService);
  private toast = inject(ToastService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  application = signal<Application | null>(null);
  isLoading = signal(true);
  hasApplication = signal(false);

  // Document Upload state
  selectedFile: File | null = null;
  selectedDocType: string = 'Class 10 Marksheet';
  isUploading = signal(false);

  // Slot Booking & Payment state
  showPaymentModal = signal(false);
  isProcessingPayment = signal(false);
  paymentSuccess = signal(false);
  selectedSlotId = signal<string>('slot-1');
  selectedPaymentMethod = signal<string>('upi');
  bookingReceipt = signal<BookingReceipt | null>(null);

  // Available counseling slots
  availableSlots: CounselingSlot[] = [
    {
      id: 'slot-1',
      date: 'Saturday, 14 Nov 2026',
      time: '10:00 AM - 12:30 PM',
      venue: 'Auditorium Hall A, IEM Campus V, Salt Lake, Kolkata',
      mode: 'Offline Campus Counseling',
      seatsAvailable: '18 seats left'
    },
    {
      id: 'slot-2',
      date: 'Saturday, 14 Nov 2026',
      time: '02:00 PM - 04:30 PM',
      venue: 'Auditorium Hall A, IEM Campus V, Salt Lake, Kolkata',
      mode: 'Offline Campus Counseling',
      seatsAvailable: '24 seats left'
    },
    {
      id: 'slot-3',
      date: 'Monday, 16 Nov 2026',
      time: '11:00 AM - 01:00 PM',
      venue: 'Official Google Meet / IEM Virtual Counseling Boardroom',
      mode: 'Online Virtual Counseling',
      seatsAvailable: '12 seats left'
    },
    {
      id: 'slot-4',
      date: 'Tuesday, 17 Nov 2026',
      time: '10:00 AM - 12:30 PM',
      venue: 'Management House, IEM Gurukul Campus, Kolkata',
      mode: 'Offline Campus Counseling',
      seatsAvailable: '30 seats left'
    }
  ];

  documentTypes: string[] = [
    'Class 10 Marksheet',
    'Class 12 Marksheet',
    'Entrance Exam Rank Card',
    'ID Proof (Aadhar/Passport)',
    'Passport Size Photograph',
    'School Leaving / Migration Certificate'
  ];

  ngOnInit(): void {
    this.fetchApplication();
  }

  fetchApplication(): void {
    this.isLoading.set(true);
    this.applicationService.getMyApplication().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.data) {
          this.application.set(res.data);
          this.hasApplication.set(true);
          this.checkExistingBooking(res.data.applicationId);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 404) {
          this.hasApplication.set(false);
          this.application.set(null);
        } else {
          this.toast.error('Unable to fetch your application details. Please try again.');
        }
      }
    });
  }

  private checkExistingBooking(appId: string): void {
    if (this.isBrowser) {
      const saved = localStorage.getItem(`iem_booking_${appId}`);
      if (saved) {
        try {
          const receipt = JSON.parse(saved);
          this.bookingReceipt.set(receipt);
        } catch {}
      }
    }
  }

  // --- Payment & Slot Booking Methods ---
  openPaymentModal(): void {
    this.paymentSuccess.set(false);
    this.showPaymentModal.set(true);
  }

  closePaymentModal(): void {
    this.showPaymentModal.set(false);
  }

  selectSlot(slotId: string): void {
    this.selectedSlotId.set(slotId);
  }

  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod.set(method);
  }

  getSelectedSlot(): CounselingSlot {
    return this.availableSlots.find(s => s.id === this.selectedSlotId()) || this.availableSlots[0];
  }

  confirmPaymentAndBookSlot(): void {
    this.isProcessingPayment.set(true);

    const slot = this.getSelectedSlot();
    const appId = this.application()?.applicationId || 'IEM-2026';

    // Simulate payment gateway processing
    setTimeout(() => {
      this.isProcessingPayment.set(false);

      const receipt: BookingReceipt = {
        receiptNo: `IEM-RCP-${Math.floor(100000 + Math.random() * 900000)}`,
        slotTitle: `${slot.date} (${slot.time})`,
        slotDate: slot.date,
        slotVenue: slot.venue,
        slotMode: slot.mode,
        amount: 25000,
        paymentDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        txnId: `TXN_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        paymentMethod: this.selectedPaymentMethod().toUpperCase()
      };

      this.bookingReceipt.set(receipt);
      this.paymentSuccess.set(true);

      if (this.isBrowser) {
        localStorage.setItem(`iem_booking_${appId}`, JSON.stringify(receipt));
      }

      this.toast.success('Payment Received! Counseling Slot & Seat Confirmed.');
    }, 1600);
  }

  printReceipt(): void {
    if (this.isBrowser) {
      window.print();
    }
  }

  // --- Document Upload ---
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        this.toast.error('File size exceeds 5MB limit. Please select a smaller file.');
        input.value = '';
        this.selectedFile = null;
        return;
      }
      this.selectedFile = file;
    }
  }

  uploadDocument(): void {
    if (!this.selectedFile) {
      this.toast.warning('Please select a file to upload.');
      return;
    }

    if (!this.selectedDocType) {
      this.toast.warning('Please select the document category.');
      return;
    }

    this.isUploading.set(true);

    this.applicationService.uploadDocument(this.selectedFile, this.selectedDocType).subscribe({
      next: () => {
        this.isUploading.set(false);
        this.toast.success(`"${this.selectedDocType}" uploaded successfully!`);
        this.selectedFile = null;
        const fileInput = document.getElementById('documentFileInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        this.fetchApplication();
      },
      error: (err) => {
        this.isUploading.set(false);
        const msg = err.error?.message || 'Failed to upload document. Please try again.';
        this.toast.error(msg);
      }
    });
  }

  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'Approved':
        return 'badge-approved';
      case 'Under Review':
        return 'badge-under-review';
      case 'Rejected':
        return 'badge-rejected';
      case 'Submitted':
      default:
        return 'badge-submitted';
    }
  }

  getStatusIcon(status: string | undefined): string {
    switch (status) {
      case 'Approved':
        return 'bi-check-circle-fill';
      case 'Under Review':
        return 'bi-hourglass-split';
      case 'Rejected':
        return 'bi-x-circle-fill';
      case 'Submitted':
      default:
        return 'bi-send-check-fill';
    }
  }
}

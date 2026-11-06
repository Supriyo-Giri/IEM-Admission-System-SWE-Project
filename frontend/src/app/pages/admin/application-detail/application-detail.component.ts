import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';
import { Application, ApplicationStatus } from '../../../core/models/application.model';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './application-detail.component.html',
  styleUrl: './application-detail.component.css'
})
export class ApplicationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private adminService = inject(AdminService);
  private toast = inject(ToastService);

  application = signal<Application | null>(null);
  isLoading = signal(true);
  isUpdating = signal(false);
  applicationId: string = '';

  ngOnInit(): void {
    this.applicationId = this.route.snapshot.paramMap.get('id') || '';
    if (this.applicationId) {
      this.fetchApplicationDetails();
    } else {
      this.isLoading.set(false);
      this.toast.error('Invalid Application ID in URL.');
    }
  }

  fetchApplicationDetails(): void {
    this.isLoading.set(true);
    this.adminService.getApplicationById(this.applicationId).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.application.set(res.data);
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err.error?.message || 'Application not found.';
        this.toast.error(msg);
      }
    });
  }

  updateStatus(status: ApplicationStatus): void {
    this.isUpdating.set(true);
    this.adminService.updateApplicationStatus(this.applicationId, status).subscribe({
      next: (res) => {
        this.isUpdating.set(false);
        this.application.set(res.data);
        this.toast.success(`Application status updated to "${status}"!`);
      },
      error: (err) => {
        this.isUpdating.set(false);
        const msg = err.error?.message || 'Failed to update admission status.';
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

  getApplicantEmail(): string {
    const app = this.application();
    if (app && typeof app.applicant === 'object' && app.applicant) {
      return app.applicant.email;
    }
    return 'N/A';
  }
}


import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';
import { DashboardStats, Application, ApplicationStatus } from '../../../core/models/application.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private toast = inject(ToastService);

  stats = signal<DashboardStats | null>(null);
  recentApplications = signal<Application[]>([]);
  isLoading = signal(true);
  updatingAppId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);

    // Load Stats
    this.adminService.getDashboardStats().subscribe({
      next: (res) => {
        this.stats.set(res.data);
      },
      error: () => {
        this.toast.error('Failed to load dashboard statistics.');
      }
    });

    // Load Recent 5 Applications
    this.adminService.getAllApplications({ limit: 5, page: 1 }).subscribe({
      next: (res) => {
        this.recentApplications.set(res.data.applications);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  updateStatus(app: Application, newStatus: ApplicationStatus): void {
    this.updatingAppId.set(app.applicationId);
    this.adminService.updateApplicationStatus(app.applicationId, newStatus).subscribe({
      next: () => {
        this.updatingAppId.set(null);
        this.toast.success(`Application ${app.applicationId} set to "${newStatus}"`);
        this.loadData();
      },
      error: (err) => {
        this.updatingAppId.set(null);
        const msg = err.error?.message || 'Failed to update status.';
        this.toast.error(msg);
      }
    });
  }

  getStatusClass(status: string): string {
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

  getApplicantEmail(app: Application): string {
    if (typeof app.applicant === 'object' && app.applicant) {
      return app.applicant.email;
    }
    return 'N/A';
  }
}


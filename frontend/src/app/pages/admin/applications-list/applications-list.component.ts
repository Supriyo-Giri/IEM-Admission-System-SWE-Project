import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';
import { Application, ApplicationStatus } from '../../../core/models/application.model';

@Component({
  selector: 'app-applications-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './applications-list.component.html',
  styleUrl: './applications-list.component.css'
})
export class ApplicationsListComponent implements OnInit {
  private adminService = inject(AdminService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  applications = signal<Application[]>([]);
  isLoading = signal(true);
  updatingAppId = signal<string | null>(null);

  // Filters
  selectedStatus: string = 'ALL';
  selectedStream: string = 'ALL';
  searchQuery: string = '';

  // Pagination
  currentPage = signal(1);
  totalPages = signal(1);
  totalApplications = signal(0);
  limit: number = 10;

  statuses: string[] = ['ALL', 'Submitted', 'Under Review', 'Approved', 'Rejected'];
  streams: string[] = ['ALL', 'CSE', 'CSE AI/ML', 'CSE IOTCSBT', 'CSE CyberSecurity'];

  ngOnInit(): void {
    // Read query params if any
    this.route.queryParams.subscribe((params) => {
      if (params['status']) this.selectedStatus = params['status'];
      if (params['stream']) this.selectedStream = params['stream'];
      if (params['search']) this.searchQuery = params['search'];
      if (params['page']) this.currentPage.set(Number(params['page']) || 1);
      this.fetchApplications();
    });
  }

  fetchApplications(): void {
    this.isLoading.set(true);

    this.adminService
      .getAllApplications({
        status: this.selectedStatus !== 'ALL' ? this.selectedStatus : undefined,
        stream: this.selectedStream !== 'ALL' ? this.selectedStream : undefined,
        search: this.searchQuery ? this.searchQuery : undefined,
        page: this.currentPage(),
        limit: this.limit
      })
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.applications.set(res.data.applications);
          this.totalPages.set(res.data.totalPages || 1);
          this.totalApplications.set(res.data.totalApplications || 0);
        },
        error: () => {
          this.isLoading.set(false);
          this.toast.error('Failed to load applications.');
        }
      });
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.updateQueryParams();
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.updateQueryParams();
  }

  clearFilters(): void {
    this.selectedStatus = 'ALL';
    this.selectedStream = 'ALL';
    this.searchQuery = '';
    this.currentPage.set(1);
    this.updateQueryParams();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.updateQueryParams();
    }
  }

  private updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        status: this.selectedStatus !== 'ALL' ? this.selectedStatus : null,
        stream: this.selectedStream !== 'ALL' ? this.selectedStream : null,
        search: this.searchQuery.trim() ? this.searchQuery.trim() : null,
        page: this.currentPage() > 1 ? this.currentPage() : null
      },
      queryParamsHandling: 'merge'
    });
  }

  updateStatus(app: Application, newStatus: ApplicationStatus): void {
    this.updatingAppId.set(app.applicationId);
    this.adminService.updateApplicationStatus(app.applicationId, newStatus).subscribe({
      next: () => {
        this.updatingAppId.set(null);
        this.toast.success(`Application ${app.applicationId} status updated to "${newStatus}"`);
        this.fetchApplications();
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


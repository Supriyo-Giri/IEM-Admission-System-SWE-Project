import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { PreferredStream } from '../../../core/models/application.model';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './apply.component.html',
  styleUrl: './apply.component.css'
})
export class ApplyComponent implements OnInit {
  private fb = inject(FormBuilder);
  private applicationService = inject(ApplicationService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  isSubmitting = signal(false);
  isCheckingExisting = signal(true);
  hasExistingApplication = signal(false);
  existingApplicationId = signal<string | null>(null);

  availableStreams: { value: PreferredStream; label: string; desc: string }[] = [
    {
      value: 'CSE',
      label: 'Computer Science & Engineering (Core)',
      desc: 'Foundational computing, software systems, algorithms, and cloud architectures.'
    },
    {
      value: 'CSE AI/ML',
      label: 'CSE (Artificial Intelligence & Machine Learning)',
      desc: 'Machine learning algorithms, deep learning models, computer vision & generative AI.'
    },
    {
      value: 'CSE IOTCSBT',
      label: 'CSE (IoT, Cyber Security & Block Chain Tech)',
      desc: 'Interconnected smart sensors, decentralized ledger networks & cyber systems.'
    },
    {
      value: 'CSE CyberSecurity',
      label: 'CSE (Cyber Security)',
      desc: 'Network defense, ethical hacking, digital forensics, and threat intelligence.'
    }
  ];

  applyForm: FormGroup = this.fb.group({
    personalDetails: this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      dateOfBirth: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]]
    }),
    academicDetails: this.fb.group({
      tenthMarks: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      twelfthMarks: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      wbjeeRank: [null, [Validators.min(1)]],
      jeeMainsRank: [null, [Validators.min(1)]]
    }),
    preferredStream: ['CSE', [Validators.required]]
  });

  ngOnInit(): void {
    // Check if user already submitted an application
    this.applicationService.getMyApplication().subscribe({
      next: (res) => {
        this.isCheckingExisting.set(false);
        if (res.data) {
          this.hasExistingApplication.set(true);
          this.existingApplicationId.set(res.data.applicationId);
        }
      },
      error: () => {
        // 404 means no application exists yet, which is the expected case to apply!
        this.isCheckingExisting.set(false);
        const user = this.authService.currentUser();
        if (user) {
          this.applyForm.patchValue({
            personalDetails: {
              fullName: `${user.firstName} ${user.lastName}`.trim()
            }
          });
        }
      }
    });
  }

  onSubmit(): void {
    if (this.applyForm.invalid) {
      this.applyForm.markAllAsTouched();
      this.toast.error('Please fix all errors in the application form before submitting.');
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.applyForm.value;
    const payload = {
      personalDetails: {
        fullName: formValue.personalDetails.fullName,
        dateOfBirth: formValue.personalDetails.dateOfBirth,
        phone: formValue.personalDetails.phone,
        address: formValue.personalDetails.address
      },
      academicDetails: {
        tenthMarks: Number(formValue.academicDetails.tenthMarks),
        twelfthMarks: Number(formValue.academicDetails.twelfthMarks),
        wbjeeRank: formValue.academicDetails.wbjeeRank ? Number(formValue.academicDetails.wbjeeRank) : null,
        jeeMainsRank: formValue.academicDetails.jeeMainsRank ? Number(formValue.academicDetails.jeeMainsRank) : null
      },
      preferredStream: formValue.preferredStream
    };

    this.applicationService.submitApplication(payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.toast.success(`Application submitted! Application ID: ${res.data.applicationId}`);
        this.router.navigate(['/applicant/dashboard']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const msg = err.error?.message || 'Failed to submit application. Please check your inputs.';
        this.toast.error(msg);
      }
    });
  }
}


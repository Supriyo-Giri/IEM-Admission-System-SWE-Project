import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ApplyComponent } from './pages/applicant/apply/apply.component';
import { ApplicantDashboardComponent } from './pages/applicant/dashboard/dashboard.component';
import { AdminDashboardComponent } from './pages/admin/dashboard/admin-dashboard.component';
import { ApplicationsListComponent } from './pages/admin/applications-list/applications-list.component';
import { ApplicationDetailComponent } from './pages/admin/application-detail/application-detail.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'apply',
    component: ApplyComponent,
    canActivate: [authGuard]
  },
  {
    path: 'applicant/dashboard',
    component: ApplicantDashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'my-application',
    redirectTo: 'applicant/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/applications',
    component: ApplicationsListComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/applications/:id',
    component: ApplicationDetailComponent,
    canActivate: [adminGuard]
  },
  { path: '**', redirectTo: '' }
];

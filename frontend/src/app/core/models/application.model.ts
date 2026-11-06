import { User } from './user.model';

export type ApplicationStatus = 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
export type PreferredStream = 'CSE' | 'CSE AI/ML' | 'CSE IOTCSBT' | 'CSE CyberSecurity';

export interface ApplicationDocument {
  _id?: string;
  docType: string;
  fileUrl: string;
  public_id?: string;
  uploadedAt?: string;
}

export interface PersonalDetails {
  fullName: string;
  dateOfBirth: string;
  phone: string;
  address: string;
}

export interface AcademicDetails {
  tenthMarks: number;
  twelfthMarks: number;
  wbjeeRank?: number | null;
  jeeMainsRank?: number | null;
}

export interface Application {
  _id?: string;
  applicationId: string;
  applicant: string | User;
  personalDetails: PersonalDetails;
  academicDetails: AcademicDetails;
  preferredStream: PreferredStream;
  documents: ApplicationDocument[];
  admissionStatus: ApplicationStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateApplicationPayload {
  personalDetails: PersonalDetails;
  academicDetails: AcademicDetails;
  preferredStream: PreferredStream;
}

export interface ApplicationsPagination {
  applications: Application[];
  totalPages: number;
  currentPage: number;
  totalApplications: number;
}

export interface StreamStat {
  _id: string;
  count: number;
}

export interface DashboardStats {
  totalApplications: number;
  approved: number;
  rejected: number;
  pending: number;
  streamStats: StreamStat[];
}


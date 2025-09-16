// types/vacation.ts
export type VacationGrantMethod = 
  | 'on_request'       // 신청시 부여
  | 'after_annual'     // 연차 소진시 부여
  | 'on_joining'       // 입사시 부여
  | 'admin_manual'     // 관리자가 직접 부여
  | 'recurring'        // 반복 부여
  | 'by_tenure';       // 근속시 부여

export type VacationUnit = 'day' | 'hour' | 'minute';
export type UsageUnit = 'all_at_once' | 'divisible';
export type SalaryType = 'paid' | 'unpaid' | 'partial';
export type Gender = 'all' | 'male' | 'female';
export type DocumentSubmission = 'before' | 'after' | 'none';
export type RecurringType = 'yearly' | 'monthly';

export interface VacationPolicy {
  id: string;
  name: string;
  description: string;
  grantMethod: VacationGrantMethod;
  grantUnit: VacationUnit;
  grantAmount: number;
  usageUnit: UsageUnit;
  salaryType: SalaryType;
  partialPaidDays?: number;
  partialPaidPercentage?: number;
  requireApproval: boolean;
  approvers?: string[];
  references?: string[];
  availableGender: Gender;
  expirationDate?: string;
  includeHolidays: boolean;
  excludedWorkTypes?: string[];
  excludedOrganizations?: string[];
  documentSubmission: DocumentSubmission;
  documentDescription?: string;
  recurringType?: RecurringType;
  recurringStartDate?: string;
  tenureMonths?: number;
  applyToExisting: boolean;
  isRequired: boolean; // 법정 필수 휴가 여부
  createdAt: string;
  updatedAt: string;
}

export interface VacationConfig extends Omit<VacationPolicy, 'id' | 'createdAt' | 'updatedAt'> {}

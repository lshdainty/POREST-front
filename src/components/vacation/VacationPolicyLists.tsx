'use client';

import React, { useState } from 'react';
import { Button } from '@/components/shadcn/button';
import {
  Card,
  CardContent,
} from '@/components/shadcn/card';
import { Badge } from '@/components/shadcn/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdownMenu';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/shadcn/alertDialog';
import { Input } from '@/components/shadcn/input';
import {
  Plus,
  Search,
  Shield,
  Calendar,
  CheckCircle,
  FileText,
  Clock,
  Users,
  XCircle,
  GripVertical,
  Trash2,
  Edit,
  MoreHorizontal,
} from 'lucide-react';
import type { VacationPolicy, VacationConfig } from '@/types/vacation';
import { VacationPolicyForm } from '@/components/vacation/VacationPolicyForm';

// mock data
const mockVacationPolicies: VacationPolicy[] = [
  {
    id: '1',
    name: '연차',
    description: '법정 연차 휴가입니다.',
    grantMethod: 'on_joining',
    grantUnit: 'day',
    grantAmount: 15,
    usageUnit: 'divisible',
    salaryType: 'paid',
    requireApproval: true,
    approvers: ['manager', 'hr'],
    references: ['team_lead'],
    availableGender: 'all',
    includeHolidays: false,
    documentSubmission: 'none',
    applyToExisting: false,
    isRequired: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    name: '리프레시 휴가',
    description: '재충전을 위한 추가 휴가입니다.',
    grantMethod: 'by_tenure',
    grantUnit: 'day',
    grantAmount: 3,
    usageUnit: 'all_at_once',
    salaryType: 'paid',
    requireApproval: true,
    approvers: ['manager'],
    availableGender: 'all',
    includeHolidays: false,
    documentSubmission: 'none',
    tenureMonths: 12,
    applyToExisting: false,
    isRequired: false,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '3',
    name: '보건 휴가',
    description: '여성 근로자를 위한 보건 휴가입니다.',
    grantMethod: 'recurring',
    grantUnit: 'day',
    grantAmount: 1,
    usageUnit: 'all_at_once',
    salaryType: 'paid',
    requireApproval: false,
    availableGender: 'female',
    includeHolidays: false,
    documentSubmission: 'after',
    documentDescription: '진료 확인서 또는 처방전을 제출해주세요.',
    recurringType: 'monthly',
    applyToExisting: false,
    isRequired: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
];

type ViewMode = 'list' | 'form';

export function VacationPolicyLists() {
  const [policies, setPolicies] = useState<VacationPolicy[]>(mockVacationPolicies);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingPolicy, setEditingPolicy] = useState<VacationPolicy | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; policy: VacationPolicy | null }>({ open: false, policy: null });

  const filteredPolicies = policies.filter(
    policy =>
      policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (policy.description && policy.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const openEditForm = (policy: VacationPolicy | null) => {
    setEditingPolicy(policy);
    setViewMode('form');
  };

  const deletePolicy = (policy: VacationPolicy) => {
    setDeleteDialog({ open: true, policy });
  };

  const confirmDelete = () => {
    if (deleteDialog.policy) {
      setPolicies(policies.filter(p => p.id !== deleteDialog.policy!.id));
      setDeleteDialog({ open: false, policy: null });
    }
  };

  const onFormSubmit = (data: VacationConfig) => {
    if (editingPolicy) {
      setPolicies(policies.map(p => (p.id === editingPolicy.id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p)));
    } else {
      setPolicies([...policies, { ...data, id: Date.now().toString(), isRequired: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
    }
    setViewMode('list');
    setEditingPolicy(null);
  };

  const cancelEdit = () => {
    setViewMode('list');
    setEditingPolicy(null);
  };

  const getGrantMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      'on_request': '신청시 부여',
      'after_annual': '연차 소진시 부여',
      'on_joining': '입사시 부여',
      'admin_manual': '관리자 직접 부여',
      'recurring': '반복 부여',
      'by_tenure': '근속시 부여'
    };
    return labels[method] || method;
  };

  const getSalaryTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'paid': '유급',
      'unpaid': '무급',
      'partial': '일부 유급'
    };
    return labels[type] || type;
  };

  const getGenderLabel = (gender: string) => {
    const labels: Record<string, string> = {
      'all': '전체',
      'male': '남성',
      'female': '여성'
    };
    return labels[gender] || gender;
  };

  const getUsageUnitLabel = (unit: string) => {
    const labels: Record<string, string> = {
      'all_at_once': '한번에 모두 사용',
      'divisible': '나눠서 사용 가능'
    };
    return labels[unit] || unit;
  };

  const getDocumentSubmissionLabel = (submission: string) => {
    const labels: Record<string, string> = {
      'before': '사전 제출',
      'after': '사후 제출',
      'none': '제출 안함'
    };
    return labels[submission] || submission;
  };

  if (viewMode === 'form') {
    return <VacationPolicyForm initialData={editingPolicy} onSubmit={onFormSubmit} onCancel={cancelEdit} />;
  }

  return (
    <div className="flex flex-col gap-7">
      {/* 헤더 영역 */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">휴가 정책 관리</h1>
        <p className="text-muted-foreground">회사의 휴가 정책을 관리할 수 있습니다.</p>
      </div>

      {/* 검색 및 리스트 영역 */}
      <div className="flex flex-col gap-4">
        {/* 검색 영역 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="휴가 정책 검색..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <div className="text-sm text-muted-foreground">총 {filteredPolicies.length}개 정책</div>
          </div>
          <Button onClick={() => openEditForm(null)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            새 휴가 정책 추가
          </Button>
        </div>

        {/* 정책 리스트 */}
        <div className="flex flex-col gap-4">
          {filteredPolicies.map(policy => (
            <Card key={policy.id} className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex items-start pt-1">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    </div>
                    <div className="flex flex-col gap-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{policy.name}</h3>
                        <div className="flex flex-wrap items-center gap-2">
                          {policy.isRequired && (
                            <Badge variant="destructive" className="flex items-center gap-1 text-xs">
                              <Shield className="h-3 w-3" />
                              법정 필수
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {getGrantMethodLabel(policy.grantMethod)}
                          </Badge>
                          <Badge variant={policy.salaryType === 'paid' ? 'default' : policy.salaryType === 'unpaid' ? 'secondary' : 'outline'} className="text-xs">
                            {getSalaryTypeLabel(policy.salaryType)}
                          </Badge>
                          {policy.availableGender !== 'all' && (
                            <Badge variant="outline" className="text-xs">{getGenderLabel(policy.availableGender)}</Badge>
                          )}
                        </div>
                      </div>
                      {policy.description && <p className="text-muted-foreground text-sm">{policy.description}</p>}
                      <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {policy.grantAmount}
                            {policy.grantUnit === 'day'
                              ? '일'
                              : policy.grantUnit === 'hour'
                              ? '시간'
                              : '분'}
                            {' '}
                            ({getUsageUnitLabel(policy.usageUnit)})
                          </span>
                        </div>
                        {policy.requireApproval && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            <span>승인 필요</span>
                          </div>
                        )}
                        {policy.documentSubmission !== 'none' && (
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>증명자료 {getDocumentSubmissionLabel(policy.documentSubmission)}</span>
                          </div>
                        )}
                        {policy.includeHolidays && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>휴일 포함</span>
                          </div>
                        )}
                        {((policy.excludedWorkTypes && policy.excludedWorkTypes.length > 0) || (policy.excludedOrganizations && policy.excludedOrganizations.length > 0)) && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>제외 대상 있음</span>
                          </div>
                        )}
                        {policy.expirationDate && (
                          <div className="flex items-center gap-1">
                            <XCircle className="h-4 w-4" />
                            <span>만료일 {policy.expirationDate}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-3">
                        {policy.salaryType === 'partial' && (
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm">
                              <span className="font-medium">일부 유급:</span> {policy.partialPaidDays}일 ({policy.partialPaidPercentage}% 지급), 나머지 무급
                            </p>
                          </div>
                        )}
                        {policy.grantMethod === 'by_tenure' && policy.tenureMonths && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-700">
                              <span className="font-medium">근속 조건:</span> 입사 후 {policy.tenureMonths}개월
                            </p>
                          </div>
                        )}
                        {policy.grantMethod === 'recurring' && (
                          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                            <p className="text-sm text-purple-700">
                              <span className="font-medium">반복 부여:</span> {policy.recurringType === 'yearly' ? '매년' : '매월'}
                              {policy.recurringStartDate && ` (시작일: ${policy.recurringStartDate})`}
                            </p>
                          </div>
                        )}
                        {policy.documentDescription && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-700">
                              <span className="font-medium">증명자료:</span> {policy.documentDescription}
                            </p>
                          </div>
                        )}
                        {((policy.excludedWorkTypes && policy.excludedWorkTypes.length > 0) || (policy.excludedOrganizations && policy.excludedOrganizations.length > 0)) && (
                          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex flex-col gap-1">
                              <span className="font-medium text-orange-700">제외 대상:</span>
                              {policy.excludedWorkTypes && policy.excludedWorkTypes.length > 0 && (
                                <span className="text-sm text-orange-700">근로유형: {policy.excludedWorkTypes.join(', ')}</span>
                              )}
                              {policy.excludedOrganizations && policy.excludedOrganizations.length > 0 && (
                                <span className="text-sm text-orange-700">조직: {policy.excludedOrganizations.join(', ')}</span>
                              )}
                            </div>
                          </div>
                        )}
                        {((policy.approvers && policy.approvers.length > 0) || (policy.references && policy.references.length > 0)) && (
                          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="flex flex-col gap-1 text-sm text-gray-700">
                              {policy.approvers && policy.approvers.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">승인자:</span>
                                  <span>{policy.approvers.join(', ')}</span>
                                </div>
                              )}
                              {policy.references && policy.references.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">참조자:</span>
                                  <span>{policy.references.join(', ')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditForm(policy)}>
                        <Edit className="h-4 w-4 mr-2" />
                        수정
                      </DropdownMenuItem>
                      {!policy.isRequired && (
                        <DropdownMenuItem onClick={() => deletePolicy(policy)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          삭제
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredPolicies.length === 0 && (
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center gap-4 text-center">
                  <p className="text-muted-foreground">
                    {searchQuery ? '검색 결과가 없습니다.' : '등록된 휴가 정책이 없습니다.'}
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => openEditForm(null)} variant="outline">
                      첫 번째 휴가 정책 만들기
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <AlertDialog open={deleteDialog.open} onOpenChange={open => setDeleteDialog({ open, policy: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>휴가 정책 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              '{deleteDialog.policy?.name}' 휴가 정책을 삭제하시겠습니까?
              <br />
              기존에 부여된 휴가나 사용 내역은 삭제되지 않지만, 더 이상 새로운 휴가가 부여되지 않습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

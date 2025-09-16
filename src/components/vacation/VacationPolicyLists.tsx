'use client';

import React, { useState } from 'react';
import { Button } from '@/components/shadcn/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/shadcn/alertDialog';
import { Input } from '@/components/shadcn/input';
import { 
  Plus, 
  MoreHorizontal, 
  Search, 
  Edit, 
  Trash2, 
  Users, 
  Calendar,
  Clock,
  Shield,
  Eye,
  GripVertical,
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { VacationPolicyForm } from '@/components/vacation/VacationPolicyForm';
import type { VacationPolicy, VacationConfig } from '@/types/vacation';
import { cn } from '@/lib/utils';

// 모든 가짜 데이터 - 실제로는 API에서 가져올 것
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
  {
    id: '4',
    name: '건강검진 휴가',
    description: '건강검진을 위한 휴가입니다.',
    grantMethod: 'on_request',
    grantUnit: 'day',
    grantAmount: 1,
    usageUnit: 'all_at_once',
    salaryType: 'paid',
    requireApproval: true,
    approvers: ['manager'],
    references: ['hr'],
    availableGender: 'all',
    includeHolidays: false,
    documentSubmission: 'before',
    documentDescription: '건강검진 예약 확인서를 제출해주세요.',
    applyToExisting: false,
    isRequired: false,
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01',
  },
  {
    id: '5',
    name: '난임치료 휴가',
    description: '난임치료를 위한 법정 휴가입니다.',
    grantMethod: 'on_request',
    grantUnit: 'day',
    grantAmount: 6,
    usageUnit: 'divisible',
    salaryType: 'partial',
    partialPaidDays: 2,
    partialPaidPercentage: 100,
    requireApproval: true,
    approvers: ['manager', 'hr'],
    availableGender: 'all',
    includeHolidays: false,
    documentSubmission: 'before',
    documentDescription: '의료진 진단서 또는 치료 계획서를 제출해주세요.',
    applyToExisting: false,
    isRequired: true,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
  {
    id: '6',
    name: '군소집 훈련',
    description: '예비군 및 민방위 훈련을 위한 휴가입니다.',
    grantMethod: 'on_request',
    grantUnit: 'day',
    grantAmount: 8,
    usageUnit: 'divisible',
    salaryType: 'paid',
    requireApproval: true,
    approvers: ['manager'],
    availableGender: 'male',
    includeHolidays: false,
    documentSubmission: 'before',
    documentDescription: '훈련 소집 통지서를 제출해주세요.',
    excludedWorkTypes: ['계약직', '인턴'],
    applyToExisting: false,
    isRequired: true,
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25',
  },
  {
    id: '7',
    name: '대체휴가',
    description: '휴일 근무에 대한 대체 휴가입니다.',
    grantMethod: 'admin_manual',
    grantUnit: 'day',
    grantAmount: 1,
    usageUnit: 'divisible',
    salaryType: 'paid',
    requireApproval: false,
    availableGender: 'all',
    includeHolidays: false,
    documentSubmission: 'none',
    expirationDate: '2024-12-31',
    applyToExisting: false,
    isRequired: false,
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10',
  },
];

type ViewMode = 'list' | 'form';

export function VacationPolicyLists() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [policies, setPolicies] = useState<VacationPolicy[]>(mockVacationPolicies);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPolicy, setEditingPolicy] = useState<VacationPolicy | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    policy: VacationPolicy | null;
  }>({ open: false, policy: null });

  const filteredPolicies = policies.filter(policy =>
    policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNew = () => {
    setEditingPolicy(null);
    setViewMode('form');
  };

  const handleEdit = (policy: VacationPolicy) => {
    setEditingPolicy(policy);
    setViewMode('form');
  };

  const handleDelete = (policy: VacationPolicy) => {
    setDeleteDialog({ open: true, policy });
  };

  const confirmDelete = () => {
    if (deleteDialog.policy) {
      setPolicies(prev => prev.filter(p => p.id !== deleteDialog.policy!.id));
      setDeleteDialog({ open: false, policy: null });
    }
  };

  const handleFormSubmit = (data: VacationConfig) => {
    if (editingPolicy) {
      // 수정
      setPolicies(prev => prev.map(p => 
        p.id === editingPolicy.id 
          ? { ...p, ...data, updatedAt: new Date().toISOString() }
          : p
      ));
    } else {
      // 새로 생성
      const newPolicy: VacationPolicy = {
        ...data,
        id: Date.now().toString(),
        isRequired: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPolicies(prev => [...prev, newPolicy]);
    }
    setViewMode('list');
  };

  const handleCancel = () => {
    setViewMode('list');
    setEditingPolicy(null);
  };

  const getGrantMethodLabel = (method: string) => {
    const labels = {
      'on_request': '신청시 부여',
      'after_annual': '연차 소진시 부여',
      'on_joining': '입사시 부여',
      'admin_manual': '관리자 직접 부여',
      'recurring': '반복 부여',
      'by_tenure': '근속시 부여',
    };
    return labels[method as keyof typeof labels] || method;
  };

  const getSalaryTypeLabel = (type: string) => {
    const labels = {
      'paid': '유급',
      'unpaid': '무급',
      'partial': '일부 유급',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getGenderLabel = (gender: string) => {
    const labels = {
      'all': '전체',
      'male': '남성',
      'female': '여성',
    };
    return labels[gender as keyof typeof labels] || gender;
  };

  const getUsageUnitLabel = (unit: string) => {
    const labels = {
      'all_at_once': '한번에 모두 사용',
      'divisible': '나눠서 사용 가능',
    };
    return labels[unit as keyof typeof labels] || unit;
  };

  const getDocumentSubmissionLabel = (submission: string) => {
    const labels = {
      'before': '사전 제출',
      'after': '사후 제출',
      'none': '제출 안함',
    };
    return labels[submission as keyof typeof labels] || submission;
  };

  if (viewMode === 'form') {
    return (
      <VacationPolicyForm
        initialData={editingPolicy}
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">맞춤 휴가 관리</h1>
          <p className="text-muted-foreground mt-2">
            회사의 휴가 정책을 관리하고 구성원들의 휴가 사용을 설정할 수 있어요.
          </p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2">
          <Plus className="h-4 w-4" />
          새 휴가 정책 추가
        </Button>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="휴가 정책 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              총 {filteredPolicies.length}개 정책
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 휴가 정책 목록 */}
      <div className="space-y-4">
        {filteredPolicies.map((policy, index) => (
          <Card key={policy.id} className="transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* 드래그 핸들 */}
                  <div className="mt-1 cursor-move">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </div>

                  {/* 메인 정보 */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{policy.name}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        {policy.isRequired && (
                          <Badge variant="destructive" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            법정 필수
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {getGrantMethodLabel(policy.grantMethod)}
                        </Badge>
                        <Badge 
                          variant={policy.salaryType === 'paid' ? 'default' : policy.salaryType === 'unpaid' ? 'secondary' : 'outline'} 
                          className="text-xs"
                        >
                          {getSalaryTypeLabel(policy.salaryType)}
                        </Badge>
                        {policy.availableGender !== 'all' && (
                          <Badge variant="outline" className="text-xs">
                            {getGenderLabel(policy.availableGender)}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {policy.description && (
                      <p className="text-sm text-muted-foreground">
                        {policy.description}
                      </p>
                    )}

                    {/* 상세 정보 */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {policy.grantAmount}
                          {policy.grantUnit === 'day' ? '일' : policy.grantUnit === 'hour' ? '시간' : '분'}
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
                      
                      {((policy.excludedWorkTypes && policy.excludedWorkTypes.length > 0) || 
                        (policy.excludedOrganizations && policy.excludedOrganizations.length > 0)) && (
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

                    {/* 부분 유급 정보 */}
                    {policy.salaryType === 'partial' && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm">
                          <span className="font-medium">일부 유급:</span> {policy.partialPaidDays}일 
                          ({policy.partialPaidPercentage}% 지급), 나머지 무급
                        </p>
                      </div>
                    )}

                    {/* 근속 부여 정보 */}
                    {policy.grantMethod === 'by_tenure' && policy.tenureMonths && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700">
                          <span className="font-medium">근속 조건:</span> 입사 후 {policy.tenureMonths}개월
                        </p>
                      </div>
                    )}

                    {/* 반복 부여 정보 */}
                    {policy.grantMethod === 'recurring' && (
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <p className="text-sm text-purple-700">
                          <span className="font-medium">반복 부여:</span> {policy.recurringType === 'yearly' ? '매년' : '매월'}
                          {policy.recurringStartDate && ` (시작일: ${policy.recurringStartDate})`}
                        </p>
                      </div>
                    )}

                    {/* 증명자료 설명 */}
                    {policy.documentDescription && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <span className="font-medium">증명자료:</span> {policy.documentDescription}
                        </p>
                      </div>
                    )}

                    {/* 제외 대상 정보 */}
                    {((policy.excludedWorkTypes && policy.excludedWorkTypes.length > 0) || 
                      (policy.excludedOrganizations && policy.excludedOrganizations.length > 0)) && (
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm text-orange-700">
                          <span className="font-medium">제외 대상:</span>
                          {policy.excludedWorkTypes && policy.excludedWorkTypes.length > 0 && (
                            <span className="ml-2">근로유형 {policy.excludedWorkTypes.join(', ')}</span>
                          )}
                          {policy.excludedOrganizations && policy.excludedOrganizations.length > 0 && (
                            <span className="ml-2">조직 {policy.excludedOrganizations.join(', ')}</span>
                          )}
                        </p>
                      </div>
                    )}

                    {/* 승인자/참조자 정보 */}
                    {((policy.approvers && policy.approvers.length > 0) || 
                      (policy.references && policy.references.length > 0)) && (
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="text-sm text-gray-700 space-y-1">
                          {policy.approvers && policy.approvers.length > 0 && (
                            <p>
                              <span className="font-medium">승인자:</span> {policy.approvers.join(', ')}
                            </p>
                          )}
                          {policy.references && policy.references.length > 0 && (
                            <p>
                              <span className="font-medium">참조자:</span> {policy.references.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 액션 메뉴 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(policy)}>
                      <Edit className="h-4 w-4 mr-2" />
                      수정
                    </DropdownMenuItem>
                    {!policy.isRequired && (
                      <DropdownMenuItem 
                        onClick={() => handleDelete(policy)}
                        className="text-destructive"
                      >
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
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery ? '검색 결과가 없습니다.' : '등록된 휴가 정책이 없습니다.'}
              </p>
              {!searchQuery && (
                <Button onClick={handleCreateNew} variant="outline" className="mt-4">
                  첫 번째 휴가 정책 만들기
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, policy: null })}>
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

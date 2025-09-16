'use client';

import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcn/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';
import { Input } from '@/components/shadcn/input';
import { Textarea } from '@/components/shadcn/textarea';
import { Button } from '@/components/shadcn/button';
import { Switch } from '@/components/shadcn/switch';
import { Separator } from '@/components/shadcn/separator';
import { Badge } from '@/components/shadcn/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/shadcn/collapsible';
import { 
  ChevronDown, 
  ChevronUp, 
  Info, 
  Plus, 
  X, 
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Shield,
  FileText,
  AlertCircle
} from 'lucide-react';
import type { VacationPolicy, VacationConfig, VacationGrantMethod } from '@/types/vacation';

// 폼 스키마 정의
const formSchema = z.object({
  name: z.string().min(1, '휴가 이름을 입력해주세요'),
  description: z.string().optional(),
  grantMethod: z.enum(['on_request', 'after_annual', 'on_joining', 'admin_manual', 'recurring', 'by_tenure']),
  grantUnit: z.enum(['day', 'hour', 'minute']),
  grantAmount: z.number().min(1, '부여 수량을 입력해주세요'),
  usageUnit: z.enum(['all_at_once', 'divisible']),
  salaryType: z.enum(['paid', 'unpaid', 'partial']),
  partialPaidDays: z.number().optional(),
  partialPaidPercentage: z.number().optional(),
  requireApproval: z.boolean(),
  approvers: z.array(z.string()).optional(),
  references: z.array(z.string()).optional(),
  availableGender: z.enum(['all', 'male', 'female']),
  expirationDate: z.string().optional(),
  includeHolidays: z.boolean(),
  excludedWorkTypes: z.array(z.string()).optional(),
  excludedOrganizations: z.array(z.string()).optional(),
  documentSubmission: z.enum(['before', 'after', 'none']),
  documentDescription: z.string().optional(),
  recurringType: z.enum(['yearly', 'monthly']).optional(),
  recurringStartDate: z.string().optional(),
  tenureMonths: z.number().optional(),
  applyToExisting: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

const grantMethodOptions = [
  { 
    value: 'on_request', 
    label: '신청시 부여', 
    description: '구성원이 신청할 때마다 정해진 휴가 수량을 부여해요',
    icon: <Calendar className="h-4 w-4" />
  },
  { 
    value: 'after_annual', 
    label: '연차 소진시 부여', 
    description: '구성원이 보유한 법정 연차를 모두 사용한 시점부터 부여해요',
    icon: <Clock className="h-4 w-4" />
  },
  { 
    value: 'on_joining', 
    label: '입사시 부여', 
    description: '구성원이 입사하는 날 부여되는 자동 부여 방식이에요',
    icon: <Users className="h-4 w-4" />
  },
  { 
    value: 'admin_manual', 
    label: '관리자가 직접 부여', 
    description: '관리자가 직접 부여해야 노출돼요',
    icon: <Shield className="h-4 w-4" />
  },
  { 
    value: 'recurring', 
    label: '반복 부여', 
    description: '매년 또는 매월 첫 부여 시점을 설정할 수 있어요',
    icon: <Calendar className="h-4 w-4" />
  },
  { 
    value: 'by_tenure', 
    label: '근속시 부여', 
    description: '입사일 기준 근속시 자동 부여되는 휴가를 설정할 수 있어요',
    icon: <Clock className="h-4 w-4" />
  },
] as const;

interface VacationPolicyFormProps {
  initialData?: VacationPolicy | null;
  onSubmit: (data: VacationConfig) => void;
  onCancel: () => void;
}

export function VacationPolicyForm({ initialData, onSubmit, onCancel }: VacationPolicyFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [excludedWorkTypes, setExcludedWorkTypes] = useState<string[]>([]);
  const [excludedOrganizations, setExcludedOrganizations] = useState<string[]>([]);
  const [approvers, setApprovers] = useState<string[]>([]);
  const [references, setReferences] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      grantMethod: 'on_request',
      grantUnit: 'day',
      grantAmount: 1,
      usageUnit: 'all_at_once',
      salaryType: 'paid',
      requireApproval: false,
      availableGender: 'all',
      includeHolidays: false,
      excludedWorkTypes: [],
      excludedOrganizations: [],
      approvers: [],
      references: [],
      documentSubmission: 'none',
      applyToExisting: false,
    },
  });

  const watchGrantMethod = form.watch('grantMethod');
  const watchSalaryType = form.watch('salaryType');
  const watchDocumentSubmission = form.watch('documentSubmission');
  const watchRequireApproval = form.watch('requireApproval');

  useEffect(() => {
    if (initialData) {
      // 폼에 기존 데이터 설정
      Object.keys(initialData).forEach((key) => {
        if (key in form.getValues()) {
          form.setValue(key as any, initialData[key as keyof VacationPolicy] as any);
        }
      });
      
      if (initialData.excludedWorkTypes) {
        setExcludedWorkTypes(initialData.excludedWorkTypes);
      }
      if (initialData.excludedOrganizations) {
        setExcludedOrganizations(initialData.excludedOrganizations);
      }
      if (initialData.approvers) {
        setApprovers(initialData.approvers);
      }
      if (initialData.references) {
        setReferences(initialData.references);
      }
    }
  }, [initialData, form]);

  const handleSubmit = (data: FormData) => {
    const submitData: VacationConfig = {
      ...data,
      excludedWorkTypes: excludedWorkTypes,
      excludedOrganizations: excludedOrganizations,
      approvers: approvers,
      references: references,
    };
    onSubmit(submitData);
  };

  const addExcludedWorkType = (type: string) => {
    if (type && !excludedWorkTypes.includes(type)) {
      const newTypes = [...excludedWorkTypes, type];
      setExcludedWorkTypes(newTypes);
      form.setValue('excludedWorkTypes', newTypes);
    }
  };

  const removeExcludedWorkType = (type: string) => {
    const newTypes = excludedWorkTypes.filter(t => t !== type);
    setExcludedWorkTypes(newTypes);
    form.setValue('excludedWorkTypes', newTypes);
  };

  const addExcludedOrganization = (org: string) => {
    if (org && !excludedOrganizations.includes(org)) {
      const newOrgs = [...excludedOrganizations, org];
      setExcludedOrganizations(newOrgs);
      form.setValue('excludedOrganizations', newOrgs);
    }
  };

  const removeExcludedOrganization = (org: string) => {
    const newOrgs = excludedOrganizations.filter(o => o !== org);
    setExcludedOrganizations(newOrgs);
    form.setValue('excludedOrganizations', newOrgs);
  };

  const addApprover = (approver: string) => {
    if (approver && !approvers.includes(approver)) {
      const newApprovers = [...approvers, approver];
      setApprovers(newApprovers);
      form.setValue('approvers', newApprovers);
    }
  };

  const removeApprover = (approver: string) => {
    const newApprovers = approvers.filter(a => a !== approver);
    setApprovers(newApprovers);
    form.setValue('approvers', newApprovers);
  };

  const addReference = (reference: string) => {
    if (reference && !references.includes(reference)) {
      const newReferences = [...references, reference];
      setReferences(newReferences);
      form.setValue('references', newReferences);
    }
  };

  const removeReference = (reference: string) => {
    const newReferences = references.filter(r => r !== reference);
    setReferences(newReferences);
    form.setValue('references', newReferences);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* 뒤로가기 버튼 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          목록으로 돌아가기
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {initialData ? '맞춤 휴가 수정' : '맞춤 휴가 설정'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {initialData 
            ? `${initialData.name} 휴가 정책을 수정합니다.`
            : '새로운 휴가 정책을 생성합니다.'
          }
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* 기본 설정 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                기본 설정
              </CardTitle>
              <CardDescription>
                휴가의 기본 정보와 부여 방식을 설정해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 휴가 설명 */}
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>휴가 이름 *</FormLabel>
                      <FormControl>
                        <Input placeholder="예: 리프레시 휴가" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>휴가 설명</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="구성원이 휴가 사용 시 확인할 수 있는 설명을 입력해주세요" 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        구성원이 휴가 사용 시 확인할 수 있어요.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* 부여 방법 */}
              <FormField
                control={form.control}
                name="grantMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>부여 방법 *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="부여 방법을 선택해주세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {grantMethodOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-start gap-3">
                              {option.icon}
                              <div>
                                <div className="font-medium">{option.label}</div>
                                <div className="text-sm text-muted-foreground max-w-xs">
                                  {option.description}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 반복 부여 설정 (반복 부여일 때만 표시) */}
              {watchGrantMethod === 'recurring' && (
                <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/30">
                  <FormField
                    control={form.control}
                    name="recurringType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>반복 주기</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="주기 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="yearly">매년</SelectItem>
                            <SelectItem value="monthly">매월</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          매년 부여 시 12월 31일에 소멸되고 1월 1일에 다시 부여돼요.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="recurringStartDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>첫 부여 시점</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          첫 번째 휴가가 부여될 날짜를 설정해주세요.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* 근속시 부여 설정 */}
              {watchGrantMethod === 'by_tenure' && (
                <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                  <FormField
                    control={form.control}
                    name="tenureMonths"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>근속 개월 수</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="12"
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          입사일 및 그룹 입사일 기준으로 몇 개월 후에 부여할지 설정해주세요.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <Separator />

              {/* 부여 시간 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">부여 시간</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="grantUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>부여 단위 *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="day">일</SelectItem>
                            <SelectItem value="hour">시간</SelectItem>
                            <SelectItem value="minute">분</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          관리자가 직접 지급하는 휴가 외의 휴가는 부여 단위를 선택할 수 있어요.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="grantAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>부여 수량 *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            placeholder="1"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          부여할 휴가 수량을 설정해주세요.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* 사용 단위 */}
              <FormField
                control={form.control}
                name="usageUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>사용 단위 *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all_at_once">한 번에 모두 사용</SelectItem>
                        <SelectItem value="divisible">나눠서 사용 가능</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      구성원이 휴가를 사용할 때 전체를 한 번에 사용할지, 나눠서 사용할 수 있게 할지 설정해주세요.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <Separator />

              {/* 급여 지급 유무 */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="salaryType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>급여 지급 유무 *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="paid">유급</SelectItem>
                          <SelectItem value="unpaid">무급</SelectItem>
                          <SelectItem value="partial">일부 유급</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        휴가의 무급, 유급, 일부 유급 일수 및 비율을 설정할 수 있어요.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {watchSalaryType === 'partial' && (
                  <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                    <FormField
                      control={form.control}
                      name="partialPaidDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>일부 유급 일수</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              placeholder="2"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            유급으로 지급할 일수를 설정해주세요.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="partialPaidPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>지급 비율 (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              max="100"
                              placeholder="100"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            유급 일수에 대한 지급 비율을 설정해주세요.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              <Separator />

              {/* 승인/참조 사용 */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="requireApproval"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">승인/참조 사용</FormLabel>
                        <FormDescription>
                          구성원이 휴가를 등록하거나 취소할 때 승인이 필요한지 설정해주세요.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* 승인자 설정 */}
                {watchRequireApproval && (
                  <div className="space-y-4 p-4 border rounded-lg bg-blue-50 border-blue-200">
                    <div className="space-y-2">
                      <FormLabel className="text-sm font-medium">승인자</FormLabel>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="승인자 입력 후 Enter"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addApprover(e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            addApprover(input.value);
                            input.value = '';
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {approvers.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {approvers.map((approver, index) => (
                            <Badge key={index} variant="default" className="gap-1">
                              {approver}
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => removeApprover(approver)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <FormLabel className="text-sm font-medium">참조자</FormLabel>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="참조자 입력 후 Enter"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addReference(e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            addReference(input.value);
                            input.value = '';
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {references.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {references.map((reference, index) => (
                            <Badge key={index} variant="secondary" className="gap-1">
                              {reference}
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => removeReference(reference)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 추가 설정 */}
          <Card>
            <CardHeader>
              <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0">
                    <div className="text-left">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        추가 설정
                      </CardTitle>
                      <CardDescription>
                        성별 제한, 증명자료 제출, 제외 대상 등을 설정할 수 있어요.
                      </CardDescription>
                    </div>
                    {showAdvanced ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="space-y-6 pt-6">
                    {/* 사용 가능 성별 */}
                    <FormField
                      control={form.control}
                      name="availableGender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>사용 가능 성별</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">전체</SelectItem>
                              <SelectItem value="male">남성</SelectItem>
                              <SelectItem value="female">여성</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            구성원 프로필의 주민등록번호를 기준으로 판단해요. 
                            Flex에서 제공하는 보건 휴가, 군소집 훈련은 각각 여성과 남성에게만 부여돼요.
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <Separator />

                    {/* 사용 만료 기한 */}
                    {(watchGrantMethod === 'after_annual' || watchGrantMethod === 'by_tenure') && (
                      <>
                        <FormField
                          control={form.control}
                          name="expirationDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>사용 만료 기한</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormDescription>
                                [연차 소진시 부여], [근속시 부여] 방식에서만 설정 가능해요. 
                                [관리자가 직접 부여] 휴가는 관리자가 부여 시 사용 만료 기한을 설정할 수 있어요.
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                        <Separator />
                      </>
                    )}

                    {/* 휴일 포함 여부 */}
                    <FormField
                      control={form.control}
                      name="includeHolidays"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">휴일에 등록된 휴가 차감</FormLabel>
                            <FormDescription>
                              휴가 기간에 휴일(공휴일 및 주휴일)이 포함된 경우, 휴가 사용일에 포함할 것인지 설정해주세요.
                              해당 설정을 활성화하면 휴일을 포함하여 휴가 등록시 휴가 수량에서 차감돼요.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Separator />

                    {/* 제외 대상 설정 */}
                    <div className="space-y-4">
                      <div>
                        <FormLabel className="text-base font-medium">제외 대상 설정</FormLabel>
                        <FormDescription>
                          구성원의 근로 유형, 조직에 따라 특정 맞춤휴가 부여에서 제외할 수 있어요. 
                          단, 특정 구성원을 선택하는 것은 어려워요.
                        </FormDescription>
                      </div>

                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                          <div className="text-sm text-orange-700 space-y-2">
                            <p className="font-medium">제외 대상 설정 시 주의사항:</p>
                            <ul className="list-disc list-inside space-y-1">
                              <li>설정 즉시 조건에 해당하는 구성원에게는 해당 휴가가 노출되거나 부여되지 않아요.</li>
                              <li>근로 유형은 구성원 프로필 내 [근로 계약 정보]에 설정된 근로 유형을 따라가요.</li>
                              <li>겸조직 구성원인 경우 하나의 조직이라도 제외 대상에 포함되면 제외 대상에 포함돼요.</li>
                              <li>법정 필수 휴가에는 제외 대상을 설정할 수 없어요.</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* 근로 유형 제외 */}
                      <div className="space-y-2">
                        <FormLabel className="text-sm font-medium">제외할 근로 유형</FormLabel>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="근로 유형 입력 후 Enter (예: 계약직, 인턴)"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addExcludedWorkType(e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon"
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              addExcludedWorkType(input.value);
                              input.value = '';
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {excludedWorkTypes.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {excludedWorkTypes.map((type, index) => (
                              <Badge key={index} variant="destructive" className="gap-1">
                                {type}
                                <X 
                                  className="h-3 w-3 cursor-pointer" 
                                  onClick={() => removeExcludedWorkType(type)}
                                />
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 조직 제외 */}
                      <div className="space-y-2">
                        <FormLabel className="text-sm font-medium">제외할 조직</FormLabel>
                        <FormDescription className="text-xs">
                          제외 대상을 조직으로 설정할 경우, 조직을 개별로 선택해주세요. 
                          경영관리본부 및 하위 조직을 제외하려면 경영관리본부와 그 하위 조직을 개별 선택해주세요.
                        </FormDescription>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="조직명 입력 후 Enter (예: 개발팀, 마케팅팀)"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addExcludedOrganization(e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon"
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              addExcludedOrganization(input.value);
                              input.value = '';
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {excludedOrganizations.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {excludedOrganizations.map((org, index) => (
                              <Badge key={index} variant="destructive" className="gap-1">
                                {org}
                                <X 
                                  className="h-3 w-3 cursor-pointer" 
                                  onClick={() => removeExcludedOrganization(org)}
                                />
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* 증명자료 제출 */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="documentSubmission"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>증명자료 제출</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="none">제출 안함</SelectItem>
                                <SelectItem value="before">사전 제출 (휴가 신청 시 필수)</SelectItem>
                                <SelectItem value="after">사후 제출 (휴가 사용 후 제출)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              휴가 신청 단계에서 사전에 증명자료를 필수 등록으로 지정하거나, 사후 등록할 수 있도록 설정할 수 있어요.
                              증명자료는 최대 10개까지 업로드 가능해요.
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      {watchDocumentSubmission !== 'none' && (
                        <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                          <FormField
                            control={form.control}
                            name="documentDescription"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>증명자료 설명</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="구성원이 제출해야 하는 증명자료에 대한 설명을 작성해주세요 (예: 진료 확인서 또는 처방전을 제출해주세요)"
                                    className="min-h-[80px]"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  구성원이 어떤 증명자료를 제출해야 하는지 안내할 수 있어요. 
                                  이 설명은 구성원이 휴가 신청 시 확인할 수 있어요.
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      {watchDocumentSubmission === 'after' && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <Info className="h-5 w-5 text-amber-500 mt-0.5" />
                            <div className="text-sm text-amber-700 space-y-1">
                              <p className="font-medium">사후 제출 알림:</p>
                              <ul className="list-disc list-inside space-y-1">
                                <li>사후 제출로 설정한 경우 구성원이 증명자료 제출을 놓치지 않도록 [할 일] - [해야할 일]로 제출 요청 알림이 발송돼요.</li>
                                <li>구성원이 증명자료를 제출한 경우 승인자에게 알림이 발송돼요.</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </CardHeader>
          </Card>

          {/* 소급 적용 */}
          <Card>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="applyToExisting"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="text-base font-medium">
                        기존 부여된 휴가에도 반영하기
                      </FormLabel>
                      <FormDescription>
                        맞춤휴가 설정을 중간에 변경할 경우 기존 부여된 휴가에도 새로운 설정을 적용할지 선택해주세요.
                        휴가 사용 단위, 급여 지급 유무, 증명자료 제출 방식, 휴가 사전 등록 가능 등의 변경 시 활용할 수 있어요.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch('applyToExisting') && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div className="text-sm text-red-700">
                      <p className="font-medium mb-1">소급 적용 주의사항:</p>
                      <p>
                        구성원이 보유하고 있는 휴가의 사용 단위 및 정책이 현재 설정되어있는 휴가 설정과 다르다면 
                        이 옵션을 활성화하여 설정을 소급 적용/반영해주세요.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 제출 버튼 */}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              취소
            </Button>
            <Button type="submit">
              {initialData ? '휴가 정책 수정' : '휴가 정책 생성'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

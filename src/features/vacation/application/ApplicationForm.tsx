import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Textarea } from '@/components/shadcn/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog';
import { Badge } from '@/components/shadcn/badge';
import { Separator } from '@/components/shadcn/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar';
import { ScrollArea } from '@/components/shadcn/scrollArea';
import { Calendar, Clock, Users, AlertCircle, CheckCircle2, X } from 'lucide-react';
import dayjs from 'dayjs';

interface OvertimeFormData {
  title: string;
  overtimeDate: string;
  startTime: string;
  endTime: string;
  overtimeHours: number;
  reason: string;
  approver: string;
}

const approvers = [
  { id: 'kim', name: '김팀장', department: 'IT팀', avatar: '/api/placeholder/32/32' },
  { id: 'lee', name: '이부장', department: 'IT부', avatar: '/api/placeholder/32/32' },
  { id: 'park', name: '박차장', department: 'IT부', avatar: '/api/placeholder/32/32' }
];

interface ApplicationFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export default function ApplicationFormDialog({ open, onClose, onSubmitSuccess }: ApplicationFormDialogProps) {
  const [formData, setFormData] = useState<OvertimeFormData>({
    title: '',
    overtimeDate: '',
    startTime: '',
    endTime: '',
    overtimeHours: 0,
    reason: '',
    approver: ''
  });

  const [step, setStep] = useState(1);

  const calculateHours = () => {
    if (formData.startTime && formData.endTime) {
      const start = dayjs(`2025-01-01 ${formData.startTime}`);
      const end = dayjs(`2025-01-01 ${formData.endTime}`);
      const hours = end.diff(start, 'hour', true);
      
      setFormData(prev => ({ 
        ...prev, 
        overtimeHours: hours > 0 ? hours : 0 
      }));
    }
  };

  const handleSubmit = () => {
    // 제출 로직
    console.log('Form submitted:', formData);
    
    // 폼 초기화
    setFormData({
      title: '',
      overtimeDate: '',
      startTime: '',
      endTime: '',
      overtimeHours: 0,
      reason: '',
      approver: ''
    });
    setStep(1);
    
    // 성공 콜백 호출
    onSubmitSuccess();
  };

  const handleClose = () => {
    // 폼 초기화
    setFormData({
      title: '',
      overtimeDate: '',
      startTime: '',
      endTime: '',
      overtimeHours: 0,
      reason: '',
      approver: ''
    });
    setStep(1);
    onClose();
  };

  const getCompensationDays = (hours: number) => {
    return Math.round((hours / 8) * 10) / 10; // 8시간 = 1일 보상
  };

  const isFormValid = () => {
    return formData.title && 
           formData.overtimeDate && 
           formData.startTime && 
           formData.endTime && 
           formData.reason && 
           formData.approver &&
           formData.overtimeHours > 0;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-6xl max-h-[90vh] p-0 grid grid-rows-[auto_1fr_auto]'>
        <DialogHeader className='p-6 pb-0'>
          <div className='flex items-center justify-between'>
            <div>
              <DialogTitle className='text-2xl font-bold'>보상휴가 신청</DialogTitle>
              <DialogDescription className='mt-2'>
                {dayjs().format('YYYY년 M월 D일 (ddd) 오후 HH:mm')} 작성
              </DialogDescription>
            </div>
            
          </div>

          {/* 진행 단계 */}
          <div className='flex items-center gap-4 mt-6'>
            <div className='flex items-center gap-2'>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className='text-sm font-medium'>기본 정보</span>
            </div>
            
            <div className='flex-1 h-px bg-gray-300' />
            
            <div className='flex items-center gap-2'>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className='text-sm font-medium'>결재선 지정</span>
            </div>
            
            <div className='flex-1 h-px bg-gray-300' />
            
            <div className='flex items-center gap-2'>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
              <span className='text-sm font-medium'>최종 확인</span>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea>
          <div className='p-6 pt-4'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* 메인 폼 */}
              <div className='lg:col-span-2'>
                <Card>
                  <CardHeader>
                    <div className='flex items-center gap-2'>
                      <Calendar className='w-5 h-5 text-blue-600' />
                      <CardTitle>보상휴가 신청 정보</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='space-y-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='title'>제목 *</Label>
                        <Input
                          id='title'
                          placeholder='예: 프로젝트 마감 초과근무'
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='overtimeDate'>초과근무일 *</Label>
                          <Input
                            id='overtimeDate'
                            type='date'
                            value={formData.overtimeDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, overtimeDate: e.target.value }))}
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='startTime'>시작 시간 *</Label>
                          <Input
                            id='startTime'
                            type='time'
                            value={formData.startTime}
                            onChange={(e) => {
                              setFormData(prev => ({ ...prev, startTime: e.target.value }));
                              setTimeout(calculateHours, 100);
                            }}
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='endTime'>종료 시간 *</Label>
                          <Input
                            id='endTime'
                            type='time'
                            value={formData.endTime}
                            onChange={(e) => {
                              setFormData(prev => ({ ...prev, endTime: e.target.value }));
                              setTimeout(calculateHours, 100);
                            }}
                          />
                        </div>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label>초과근무 시간</Label>
                          <div className='h-9 px-3 border rounded-md flex items-center bg-gray-50'>
                            <Clock className='w-4 h-4 text-gray-400 mr-2' />
                            <span className='font-semibold'>
                              {formData.overtimeHours > 0 ? `${formData.overtimeHours}시간` : '-'}
                            </span>
                          </div>
                        </div>
                        <div className='space-y-2'>
                          <Label>예상 보상일수</Label>
                          <div className='h-9 px-3 border rounded-md flex items-center bg-gray-50'>
                            <span className='text-lg font-bold text-blue-600'>
                              {getCompensationDays(formData.overtimeHours)}일
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='reason'>초과근무 사유 *</Label>
                        <Textarea
                          id='reason'
                          rows={4}
                          placeholder='초과근무를 하게 된 사유를 상세히 기입해 주세요.'
                          value={formData.reason}
                          onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                        />
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='approver'>결재자 선택 *</Label>
                        <Select value={formData.approver} onValueChange={(value) => 
                          setFormData(prev => ({ ...prev, approver: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue placeholder='결재자를 선택해주세요' />
                          </SelectTrigger>
                          <SelectContent>
                            {approvers.map((approver) => (
                              <SelectItem key={approver.id} value={approver.id}>
                                <div className='flex items-center gap-2'>
                                  <Avatar className='w-6 h-6'>
                                    <AvatarImage src={approver.avatar} />
                                    <AvatarFallback>{approver.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className='text-left'>
                                    <div className='font-medium'>{approver.name}</div>
                                    <div className='text-xs text-gray-500'>{approver.department}</div>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 사이드바 */}
              <div className='lg:col-span-1 space-y-4'>
                {/* 승인 현황 */}
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg flex items-center gap-2'>
                      <Users className='w-5 h-5' />
                      승인 · 참조
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <div>
                        <h4 className='text-sm font-medium text-gray-700 mb-2'>참조</h4>
                        <div className='space-y-2'>
                          <div className='flex items-center gap-2 p-2 rounded-md bg-gray-50'>
                            <Avatar className='w-8 h-8'>
                              <AvatarFallback>송</AvatarFallback>
                            </Avatar>
                            <div className='flex-1'>
                              <div className='text-sm font-medium'>송윤호</div>
                              <div className='text-xs text-gray-500'>Brand & Comm Team</div>
                            </div>
                            <Badge variant='secondary' className='bg-green-100 text-green-800'>
                              승인
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className='text-sm font-medium text-gray-700 mb-2'>1단계 진행 중</h4>
                        <div className='space-y-2'>
                          <div className='flex items-center gap-2 p-2 rounded-md bg-blue-50'>
                            <Avatar className='w-8 h-8'>
                              <AvatarFallback>이</AvatarFallback>
                            </Avatar>
                            <div className='flex-1'>
                              <div className='text-sm font-medium'>이민서</div>
                              <div className='text-xs text-gray-500'>HR Manager</div>
                            </div>
                            <Badge variant='secondary' className='bg-blue-100 text-blue-800'>
                              대기중
                            </Badge>
                          </div>

                          <div className='flex items-center gap-2 p-2 rounded-md bg-gray-50'>
                            <Avatar className='w-8 h-8'>
                              <AvatarFallback>김</AvatarFallback>
                            </Avatar>
                            <div className='flex-1'>
                              <div className='text-sm font-medium'>김이준</div>
                              <div className='text-xs text-gray-500'>HR Manager</div>
                            </div>
                            <Badge variant='secondary'>
                              대기중
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 진행 현황 */}
                <Card>
                  <CardContent className='p-4'>
                    <div className='space-y-3'>
                      <div className='flex items-center gap-2 text-sm'>
                        <CheckCircle2 className='w-4 h-4 text-green-600' />
                        <div className='flex-1'>
                          <span className='text-gray-600'>작성자가 신청서를 작성중입니다.</span>
                          <div className='text-xs text-gray-400'>방금 전</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 신청 요약 */}
                {(formData.title || formData.overtimeHours > 0) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className='text-lg'>신청 요약</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-3'>
                      {formData.title && (
                        <div>
                          <p className='text-xs text-gray-500'>제목</p>
                          <p className='text-sm font-medium'>{formData.title}</p>
                        </div>
                      )}
                      {formData.overtimeHours > 0 && (
                        <div>
                          <p className='text-xs text-gray-500'>초과근무 시간</p>
                          <p className='text-sm font-medium'>{formData.overtimeHours}시간</p>
                        </div>
                      )}
                      {formData.overtimeHours > 0 && (
                        <div>
                          <p className='text-xs text-gray-500'>예상 보상일수</p>
                          <p className='text-sm font-bold text-blue-600'>
                            {getCompensationDays(formData.overtimeHours)}일
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* 하단 버튼 */}
        <div className='p-6 pt-0 border-t bg-gray-50 rounded-b-lg'>
          <div className='flex items-center gap-2 text-sm text-gray-600 mb-4'>
            <AlertCircle className='w-4 h-4' />
            승인 완료되면 변경 내역이 바로 반영됩니다.
          </div>
          
          <div className='flex gap-3'>
            <Button variant='outline' onClick={handleClose} className='flex-1'>
              취소
            </Button>
            <Button 
              onClick={handleSubmit} 
              className='flex-1'
              disabled={!isFormValid()}
            >
              결재 요청
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

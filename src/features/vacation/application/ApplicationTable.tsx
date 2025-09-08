import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Button } from '@/components/shadcn/button';
import { Badge } from '@/components/shadcn/badge';
import { Progress } from '@/components/shadcn/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/table';
import { 
  Plus, 
  Eye, 
  Calendar, 
  Clock, 
  User, 
  TrendingUp, 
  CheckCircle,
  XCircle,
  Timer,
  CalendarDays,
  FileText,
  Filter
} from 'lucide-react';
import dayjs from 'dayjs';

interface OvertimeRequest {
  id: string;
  title: string;
  requestDate: string;
  overtimeDate: string;
  overtimeHours: number;
  compensationDays: number;
  status: 'pending' | 'approved' | 'rejected' | 'inProgress';
  approver: string;
  reason: string;
  department: string;
  urgency: 'low' | 'medium' | 'high';
}

const mockData: OvertimeRequest[] = [
  {
    id: '1',
    title: '프로젝트 마감 초과근무',
    requestDate: '2025-09-01',
    overtimeDate: '2025-08-30',
    overtimeHours: 8,
    compensationDays: 1,
    status: 'approved',
    approver: '김팀장',
    reason: '프로젝트 데드라인으로 인한 초과근무',
    department: 'IT개발팀',
    urgency: 'high'
  },
  {
    id: '2',
    title: '시스템 점검 야간작업',
    requestDate: '2025-09-05',
    overtimeDate: '2025-09-04',
    overtimeHours: 6,
    compensationDays: 0.75,
    status: 'inProgress',
    approver: '이부장',
    reason: '시스템 점검 및 업데이트 작업',
    department: 'IT운영팀',
    urgency: 'medium'
  },
  {
    id: '3',
    title: '긴급 버그 수정',
    requestDate: '2025-09-07',
    overtimeDate: '2025-09-06',
    overtimeHours: 4,
    compensationDays: 0.5,
    status: 'pending',
    approver: '박차장',
    reason: '서비스 장애 긴급 대응',
    department: 'IT개발팀',
    urgency: 'high'
  },
  {
    id: '4',
    title: '월말 정산 작업',
    requestDate: '2025-08-30',
    overtimeDate: '2025-08-29',
    overtimeHours: 5,
    compensationDays: 0.625,
    status: 'rejected',
    approver: '최부장',
    reason: '월말 정산 및 보고서 작성',
    department: '재무팀',
    urgency: 'low'
  },
  {
    id: '5',
    title: '고객사 프레젠테이션 준비',
    requestDate: '2025-08-28',
    overtimeDate: '2025-08-27',
    overtimeHours: 3,
    compensationDays: 0.375,
    status: 'approved',
    approver: '송팀장',
    reason: '중요 고객사 프레젠테이션 자료 준비',
    department: '영업팀',
    urgency: 'medium'
  },
  {
    id: '6',
    title: '데이터베이스 마이그레이션',
    requestDate: '2025-08-25',
    overtimeDate: '2025-08-24',
    overtimeHours: 10,
    compensationDays: 1.25,
    status: 'approved',
    approver: '이부장',
    reason: '데이터베이스 마이그레이션 및 검증',
    department: 'IT운영팀',
    urgency: 'high'
  },
  {
    id: '7',
    title: '신제품 런칭 이벤트 준비',
    requestDate: '2025-08-20',
    overtimeDate: '2025-08-19',
    overtimeHours: 6,
    compensationDays: 0.75,
    status: 'approved',
    approver: '박마케팅팀장',
    reason: '신제품 런칭 이벤트 준비 및 셋업',
    department: '마케팅팀',
    urgency: 'medium'
  },
  {
    id: '8',
    title: '보안 점검 및 패치',
    requestDate: '2025-08-18',
    overtimeDate: '2025-08-17',
    overtimeHours: 4,
    compensationDays: 0.5,
    status: 'inProgress',
    approver: '최보안팀장',
    reason: '보안 취약점 패치 및 시스템 점검',
    department: 'IT보안팀',
    urgency: 'high'
  }
];

const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: { 
      label: '검토중', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      icon: Timer
    },
    inProgress: { 
      label: '진행중', 
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: Clock
    },
    approved: { 
      label: '승인완료', 
      color: 'bg-green-100 text-green-800 border-green-300',
      icon: CheckCircle
    },
    rejected: { 
      label: '반려', 
      color: 'bg-red-100 text-red-800 border-red-300',
      icon: XCircle
    }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig];
  const IconComponent = config.icon;
  
  return (
    <Badge className={`${config.color} border flex items-center gap-1`}>
      <IconComponent className='w-3 h-3' />
      {config.label}
    </Badge>
  );
};

const getUrgencyBadge = (urgency: string) => {
  const urgencyConfig = {
    low: { label: '낮음', color: 'bg-gray-100 text-gray-800' },
    medium: { label: '보통', color: 'bg-blue-100 text-blue-800' },
    high: { label: '긴급', color: 'bg-red-100 text-red-800' }
  };
  
  const config = urgencyConfig[urgency as keyof typeof urgencyConfig];
  return <Badge className={config.color}>{config.label}</Badge>;
};

interface OvertimeListPageProps {
  onCreateNew: () => void;
}

export default function ApplicationTable({ onCreateNew }: OvertimeListPageProps) {
  const [requests] = useState<OvertimeRequest[]>(mockData);

  // 통계 계산
  const totalRequests = requests.length;
  const approvedRequests = requests.filter(r => r.status === 'approved').length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const inProgressRequests = requests.filter(r => r.status === 'inProgress').length;
  const rejectedRequests = requests.filter(r => r.status === 'rejected').length;
  const totalCompensationDays = requests
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + r.compensationDays, 0);
  const totalOvertimeHours = requests.reduce((sum, r) => sum + r.overtimeHours, 0);
  const approvalRate = totalRequests > 0 ? (approvedRequests / totalRequests) * 100 : 0;

  // 이번 달 vs 지난 달 비교 (예시 데이터)
  const thisMonthRequests = 5;
  const lastMonthRequests = 3;
  const requestGrowth = ((thisMonthRequests - lastMonthRequests) / lastMonthRequests) * 100;

  return (
    <div className='h-full w-full'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold mb-2'>초과근무 보상휴가 관리</h1>
          <p className='text-gray-600'>초과근무에 대한 보상휴가를 신청하고 현황을 관리하세요</p>
        </div>
        <div className='flex gap-3 mt-4 lg:mt-0'>
          <Button variant='outline' className='flex items-center gap-2'>
            <Filter className='w-4 h-4' />
            필터
          </Button>
          <Button onClick={onCreateNew} className='flex items-center gap-2'>
            <Plus className='w-4 h-4' />
            새 신청서 작성
          </Button>
        </div>
      </div>

      {/* 주요 지표 카드들 - 전체 화면 너비 활용 */}
      <div className='grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8'>
        <Card className='relative overflow-hidden'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center'>
                <FileText className='w-6 h-6 text-blue-600' />
              </div>
              <div className='flex items-center gap-1 text-xs'>
                <TrendingUp className='w-3 h-3 text-green-600' />
                <span className='text-green-600 font-medium'>+{requestGrowth.toFixed(1)}%</span>
              </div>
            </div>
            <div>
              <p className='text-sm text-gray-600 mb-1'>총 신청</p>
              <p className='text-2xl font-bold text-blue-600'>{totalRequests}</p>
              <p className='text-xs text-gray-500 mt-1'>이번 달 {thisMonthRequests}건</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center'>
                <Timer className='w-6 h-6 text-yellow-600' />
              </div>
              <Badge variant='secondary' className='bg-yellow-100 text-yellow-800'>
                대기
              </Badge>
            </div>
            <div>
              <p className='text-sm text-gray-600 mb-1'>대기</p>
              <p className='text-2xl font-bold text-yellow-600'>{pendingRequests}</p>
              <p className='text-xs text-gray-500 mt-1'>평균 처리시간 1.5일</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center'>
                <Clock className='w-6 h-6 text-blue-600' />
              </div>
              <Badge variant='secondary' className='bg-blue-100 text-blue-800'>
                진행
              </Badge>
            </div>
            <div>
              <p className='text-sm text-gray-600 mb-1'>진행</p>
              <p className='text-2xl font-bold text-blue-600'>{inProgressRequests}</p>
              <p className='text-xs text-gray-500 mt-1'>처리중인 요청</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center'>
                <CheckCircle className='w-6 h-6 text-green-600' />
              </div>
              <div className='text-right'>
                <p className='text-xs text-gray-500'>승인율</p>
                <p className='text-sm font-semibold text-green-600'>{approvalRate.toFixed(0)}%</p>
              </div>
            </div>
            <div>
              <p className='text-sm text-gray-600 mb-1'>승인</p>
              <p className='text-2xl font-bold text-green-600'>{approvedRequests}</p>
              <div className='mt-2'>
                <Progress value={approvalRate} className='h-2' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center'>
                <XCircle className='w-6 h-6 text-red-600' />
              </div>
              <Badge variant='secondary' className='bg-red-100 text-red-800'>
                반려
              </Badge>
            </div>
            <div>
              <p className='text-sm text-gray-600 mb-1'>반려</p>
              <p className='text-2xl font-bold text-red-600'>{rejectedRequests}</p>
              <p className='text-xs text-gray-500 mt-1'>재신청 필요</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center'>
                <CalendarDays className='w-6 h-6 text-purple-600' />
              </div>
              <div className='text-right'>
                <p className='text-xs text-gray-500'>총 시간</p>
                <p className='text-sm font-semibold text-purple-600'>{totalOvertimeHours}h</p>
              </div>
            </div>
            <div>
              <p className='text-sm text-gray-600 mb-1'>획득 보상일수</p>
              <p className='text-2xl font-bold text-purple-600'>{totalCompensationDays.toFixed(1)}일</p>
              <p className='text-xs text-gray-500 mt-1'>사용가능한 보상휴가</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 신청 내역 테이블 - 전체 너비 활용 */}
      <Card className='flex-1'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>신청 내역</CardTitle>
            <div className='flex gap-2'>
              <Badge variant='outline' className='bg-blue-50 text-blue-700'>
                전체 {totalRequests}건
              </Badge>
              <Badge variant='outline' className='bg-yellow-50 text-yellow-700'>
                검토중 {pendingRequests}건
              </Badge>
              <Badge variant='outline' className='bg-green-50 text-green-700'>
                승인 {approvedRequests}건
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='min-w-[200px]'>제목</TableHead>
                  <TableHead>부서</TableHead>
                  <TableHead>신청일</TableHead>
                  <TableHead>초과근무일</TableHead>
                  <TableHead>시간</TableHead>
                  <TableHead>보상일수</TableHead>
                  <TableHead>긴급도</TableHead>
                  <TableHead>결재자</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id} className='hover:bg-gray-50'>
                    <TableCell>
                      <div className='max-w-[250px]'>
                        <p className='font-medium'>{request.title}</p>
                        <p className='text-xs text-gray-500 mt-1 line-clamp-2'>
                          {request.reason}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline' className='text-xs'>
                        {request.department}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {dayjs(request.requestDate).format('MM/DD')}
                    </TableCell>
                    <TableCell>
                      {dayjs(request.overtimeDate).format('MM/DD')}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1'>
                        <Clock className='w-3 h-3 text-gray-400' />
                        {request.overtimeHours}h
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1'>
                        <Calendar className='w-3 h-3 text-purple-500' />
                        {request.compensationDays}일
                      </div>
                    </TableCell>
                    <TableCell>
                      {getUrgencyBadge(request.urgency)}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Avatar className='w-6 h-6'>
                          <AvatarFallback className='text-xs'>
                            {request.approver.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className='text-sm'>{request.approver}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(request.status)}
                    </TableCell>
                    <TableCell>
                      <Button variant='outline' size='sm' className='flex items-center gap-1'>
                        <Eye className='w-3 h-3' />
                        상세보기
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

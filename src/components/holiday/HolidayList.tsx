import React from 'react';
import dayjs from 'dayjs';
import { Calendar, EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent } from '@/components/shadcn/card';
import { Badge } from '@/components/shadcn/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdownMenu';
import { type GetHolidaysResp } from '@/api/holiday';
import HolidayDeleteDialog from '@/components/holiday/HolidayDeleteDialog';

const holidayTypeColors = {
  PUBLIC: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-800',
  ETC: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600',
  SUBSTITUTE: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900 dark:text-teal-200 dark:border-teal-800',
};

const holidayTypeLabels = {
  PUBLIC: '공휴일',
  ETC: '기타',
  SUBSTITUTE: '대체',
};

const getHolidayEmoji = (holidayName: string) => {
  const emojiMap: { [key: string]: string } = {
    '추석': '🌕',
    '국군의 날': '🌲',
    '개천절': '🇰🇷',
    '한글날': '📚',
    '신정': '🎊',
    '설날': '🧧',
    '어린이날': '👶',
    '부처님오신날': '🏮',
    '현충일': '🕯️',
    '광복절': '🇰🇷',
    '크리스마스': '🎄'
  };
  
  return emojiMap[holidayName] || '🎉';
};

const formatYYYYMMDDToDisplay = (yyyymmdd: string) => {
  if (!yyyymmdd || yyyymmdd.length !== 8) return '';
  const formattedDate = `${yyyymmdd.substring(0, 4)}-${yyyymmdd.substring(4, 6)}-${yyyymmdd.substring(6, 8)}`;
  return dayjs(formattedDate).format('YYYY-MM-DD');
};

interface HolidayListProps {
  holidays?: GetHolidaysResp[];
  isLoading: boolean;
  onEdit: (holiday: GetHolidaysResp) => void;
  onDelete: (holiday_seq: number) => void;
  onAddClick: () => void;
}

export default function HolidayList({ 
  holidays, 
  isLoading, 
  onEdit, 
  onDelete, 
  onAddClick 
}: HolidayListProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    if (dateString.length === 8 && /^\d{8}$/.test(dateString)) {
      const formattedDate = formatYYYYMMDDToDisplay(dateString);
      const date = new Date(formattedDate);
      return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
  };

  const formatLunarDate = (lunarDate: string) => {
    if (!lunarDate) return '';
    let formattedDate;
    if (lunarDate.length === 8 && /^\d{8}$/.test(lunarDate)) {
      formattedDate = formatYYYYMMDDToDisplay(lunarDate);
    } else {
      formattedDate = lunarDate;
    }
    const date = new Date(formattedDate);
    return `음력 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <Calendar className='h-12 w-12 mx-auto text-muted-foreground mb-4 animate-pulse' />
          <p className='text-muted-foreground'>공휴일 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='grid gap-4'>
      {holidays?.map((holiday) => (
        <Card key={holiday.holiday_seq} className='hover:shadow-md transition-shadow'>
          <CardContent className='px-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <div className='text-3xl'>{getHolidayEmoji(holiday.holiday_name)}</div>
                <div>
                  <h3 className='text-xl font-semibold text-card-foreground'>
                    {holiday.holiday_name}
                  </h3>
                  <div className='flex items-center gap-2 mt-2'>
                    <p className='text-card-foreground/70'>
                      {formatDate(holiday.holiday_date)}
                    </p>
                    {holiday.lunar_yn === 'Y' && holiday.lunar_date && (
                      <>
                        <span className='text-card-foreground/50'>•</span>
                        <p className='text-sm text-card-foreground/60'>
                          {formatLunarDate(holiday.lunar_date)}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <Badge className={holidayTypeColors[holiday.holiday_type as keyof typeof holidayTypeColors]}>
                  {holidayTypeLabels[holiday.holiday_type as keyof typeof holidayTypeLabels]}
                </Badge>
                {holiday.lunar_yn === 'Y' && (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800">
                    음력
                  </Badge>
                )}
                {holiday.is_recurring === 'Y' && (
                  <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:border-indigo-800">
                    매년
                  </Badge>
                )}

                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-8 w-8 p-0 data-[state=open]:bg-muted hover:bg-muted'
                    >
                      <EllipsisVertical className='w-4 h-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-32'>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        onEdit(holiday);
                      }}
                    >
                      <Pencil className='h-4 w-4' />
                      <span>수정</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <HolidayDeleteDialog
                      holiday={holiday}
                      onDelete={onDelete}
                      trigger={
                        <DropdownMenuItem 
                          onSelect={(e) => e.preventDefault()}
                          className='text-destructive focus:text-destructive hover:!bg-destructive/20'
                        >
                          <Trash2 className='h-4 w-4' />
                          <span>삭제</span>
                        </DropdownMenuItem>
                      }
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {(!holidays || holidays.length === 0) && (
        <Card>
          <CardContent className='p-12 text-center'>
            <Calendar className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
            <h3 className='text-lg font-medium text-card-foreground mb-2'>
              등록된 공휴일이 없습니다
            </h3>
            <p className='text-muted-foreground mb-4'>
              새로운 공휴일을 추가해보세요
            </p>
            <Button onClick={onAddClick}>
              <Calendar className='h-4 w-4 mr-2' />
              첫 번째 공휴일 추가
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

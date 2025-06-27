import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { useCalendarSlotStore } from '@/store/CalendarSlotStore';
import { getAvailableVacation, postUseVacation, VacationQueryKey } from '@/api/vacation';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { CalendarIcon } from 'lucide-react'
import { useCalendarType } from '@/hooks/useCalendarType';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/shadcn/dialog';
import { Button } from '@/components/shadcn/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';
import { Calendar } from '@/components/shadcn/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/shadcn/popover';
import { Input } from '@/components/shadcn/input';
import { Circle } from '@mui/icons-material';

export const RegistEventDialog: React.FC = () => {
  const { start, end, open } = useCalendarSlotStore();
  const { setOpen } = useCalendarSlotStore(s => s.actions);
  const calendarTypes = useCalendarType();
  const [startOpen, setStartOpen] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Date | undefined>(start);
  const [startMonth, setStartMonth] = React.useState<Date | undefined>(startDate);
  const [endOpen, setEndOpen] = React.useState(false);
  const [endDate, setEndDate] = React.useState<Date | undefined>(end)
  const [endMonth, setEndMonth] = React.useState<Date | undefined>(endDate);
  const [timeSelectOpen, setTimeSelectOpen] = React.useState(false);
  const [vacationSelectOpen, setVacationSelectOpen] = React.useState(false);
  const [selectCalendarType, setSelectCalendarType] = React.useState('');
  const [selectVacationId, setSelectVacationId] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [startHour, setStartHour] = React.useState('9');
  const [startMinute, setStartMinute] = React.useState('0');

  const {data: available, isLoading: availableLoading} = useQuery({
    queryKey: [VacationQueryKey.GET_AVAILABLE_VACATION, 1, start],
    queryFn: () => getAvailableVacation(
      1,
      dayjs(start).format('YYYY-MM-DDTHH:mm:ss')
    ),
    select: (data: any) => data.data
  });

  const vacationMutation = useMutation({
    mutationFn: ({vacation_id, vacation_data} : {vacation_id: number, vacation_data: object}) => postUseVacation(
      vacation_id,
      vacation_data
    ),
    onSuccess: (data) => {
      // POST 성공 후 데이터를 alert로 출력
      console.log(`POST 성공! 생성된 데이터: ${JSON.stringify(data, null, 2)}`);
      
      // 캐시 무효화 후 다시 조회
      // queryClient.invalidateQueries({ queryKey: [VacationQueryKey.GET_AVAILABLE_VACATION] });
    },
    onError: (error) => {
      console.log(`POST 실패: ${error.message}`);
    }
  });

  const onSubmit = () => {
    const calendar = calendarTypes.find(c => c.id === selectCalendarType);
    let data = Object();
    data['user_no'] = 1;

    if (calendar?.isDate) {
      data['start_date'] = dayjs(startDate)
      .set('hour', 0)
      .set('minute', 0)
      .set('second', 0)
      .format('YYYY-MM-DDTHH:mm:ss');
      data['end_date'] = dayjs(endDate)
      .set('hour', 23)
      .set('minute',59)
      .set('second', 59)
      .format('YYYY-MM-DDTHH:mm:ss');
    } else {
      let plusHour = 0;
      switch(calendar?.id) {
        case 'MORNINGOFF':
        case 'AFTERNOONOFF':
        case 'HEALTHCHECKHALF':
        case 'DEFENSEHALF':
          plusHour = 4;
          break;
        case 'ONETIMEOFF':
          plusHour = 1;
          break;
        case 'TWOTIMEOFF':
          plusHour = 2;
          break;
        case 'THREETIMEOFF':
          plusHour = 3;
          break;
        case 'FIVETIMEOFF':
          plusHour = 5;
          break;
        case 'SIXTIMEOFF':
          plusHour = 6;
          break;
        case 'SEVENTIMEOFF':
          plusHour = 7;
          break;
        default:
          break;
      }

      data['start_date'] = dayjs(startDate)
      .set('hour', Number(startHour))
      .set('minute', Number(startMinute))
      .set('second', 0)
      .format('YYYY-MM-DDTHH:mm:ss');
      data['end_date'] = dayjs(endDate)
      .set('hour', Number(startHour) + plusHour)
      .set('minute', Number(startMinute))
      .set('second', 0)
      .format('YYYY-MM-DDTHH:mm:ss');
    }

    if (calendar?.type === 'vacation') {
      data['vacation_time_type'] = calendar?.id;
      data['vacation_desc'] = desc;

      console.log(data);

      vacationMutation.mutate({
        vacation_id: selectVacationId,
        vacation_data: data
      });
    } else {
      data['schedule_type'] = calendar?.id;
      data['schedule_desc'] = desc;
    }
  }

  useEffect(() => {
    if (available && !availableLoading) {
        console.log('test log : ', available);
    }
  }, [available]);

  useEffect(() => {
    setStartDate(start);
    setEndDate(end);
  }, [start, end]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>일정 등록</DialogTitle>
          <DialogDescription>일정 정보를 입력해주세요.</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-2'>
          <div className='w-full flex flex-row gap-2'>
            <div className='flex flex-1 gap-2'>
              <Select
                onValueChange={(value) => {
                  const calendar = calendarTypes.find(c => c.id === value);
                  (calendar?.isDate) ? setTimeSelectOpen(false) : setTimeSelectOpen(true);
                  (calendar?.type === 'vacation') ? setVacationSelectOpen(true) : setVacationSelectOpen(false);
                  setSelectCalendarType(value);
                }}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='일정 타입' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>휴가</SelectLabel>
                    {
                      calendarTypes.map(calendarType => {
                        if (calendarType.type === 'vacation') return <SelectItem key={calendarType.id} value={calendarType.id}><Circle sx={{fontSize: 16, color: calendarType.colorCode}} />{calendarType.name}</SelectItem>
                      })
                    }
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>스케줄</SelectLabel>
                    {
                      calendarTypes.map(calendarType => {
                        if (calendarType.type === 'schedule') {
                          return (
                            <SelectItem key={calendarType.id} value={calendarType.id}>
                              <Circle sx={{fontSize: 16, color: calendarType.colorCode}} />
                              {calendarType.name}
                            </SelectItem>
                          )
                        }
                      })
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-1 gap-2'>
              {
                vacationSelectOpen ? (
                  <Select
                    onValueChange={(value) => {setSelectVacationId(value);}}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='사용 휴가' />
                    </SelectTrigger>
                    <SelectContent>
                      {
                        !availableLoading && available.map(v => {
                          return (
                            <SelectItem key={v.vacation_id} value={v.vacation_id}>
                              {`${v.vacation_type_name} (${v.remain_time})`}
                            </SelectItem>
                          )
                        })
                      }
                    </SelectContent>
                  </Select>
                ) : null
              }
            </div>
          </div>
          <Input placeholder='일정 사유' onChange={(e) => setDesc(e.target.value)} />
          <div className='flex flex-row gap-2'>
            <div className='relative flex gap-2'>
              <Input
                id='startDate'
                value={dayjs(startDate).format('YYYY-MM-DD')}
                placeholder='startDate'
                className='bg-background pr-10'
                onChange={(e) => {
                  const date = new Date(e.target.value)
                  setStartDate(date)
                  setStartMonth(date)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setStartOpen(true)
                  }
                }}
              />
              <Popover open={startOpen} onOpenChange={setStartOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id='date-picker'
                    variant='ghost'
                    className='absolute top-1/2 right-2 size-6 -translate-y-1/2'
                  >
                    <CalendarIcon className='size-3.5' />
                    <span className='sr-only'>Select date</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className='w-auto overflow-hidden p-0'
                  align='end'
                  alignOffset={-8}
                  sideOffset={10}
                >
                  <Calendar
                    mode='single'
                    selected={startDate}
                    captionLayout='dropdown'
                    month={startMonth}
                    onMonthChange={setStartMonth}
                    onSelect={(date) => {
                      setStartDate(date)
                      setStartOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className='flex items-center'>~</div>
            <div className='relative flex gap-2'>
              <Input
                id='endDate'
                value={dayjs(endDate).format('YYYY-MM-DD')}
                placeholder='endDate'
                className='bg-background pr-10'
                onChange={(e) => {
                  const date = new Date(e.target.value)
                  setEndDate(date)
                  setEndMonth(date)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setEndOpen(true)
                  }
                }}
              />
              <Popover open={endOpen} onOpenChange={setEndOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id='date-picker'
                    variant='ghost'
                    className='absolute top-1/2 right-2 size-6 -translate-y-1/2'
                  >
                    <CalendarIcon className='size-3.5' />
                    <span className='sr-only'>Select date</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className='w-auto overflow-hidden p-0'
                  align='end'
                  alignOffset={-8}
                  sideOffset={10}
                >
                  <Calendar
                    mode='single'
                    selected={endDate}
                    captionLayout='dropdown'
                    month={endMonth}
                    onMonthChange={setEndMonth}
                    onSelect={(date) => {
                      setEndDate(date)
                      setEndOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          { timeSelectOpen ? (
              <div className='flex flex-row gap-2'>
                <Select defaultValue={startHour} onValueChange={(value) => setStartHour(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder='시' />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      Array.from({ length: 11 }, (_, i) => (
                        <SelectItem key={i+8} value={(i+8).toString()}>{`${i+8} 시`}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
                <Select defaultValue={startMinute} onValueChange={(value) => setStartMinute(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder='분' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key={0} value={'0'}>{`0 분`}</SelectItem>
                    <SelectItem key={30} value={'30'}>{`30 분`}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : null
          }
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>취소</Button>
          </DialogClose>
          <Button type='submit' onClick={onSubmit}>등록</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
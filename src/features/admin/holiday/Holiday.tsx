import { useState } from 'react';
import dayjs from 'dayjs';
import { Calendar } from 'lucide-react';
import {
  useGetHolidaysByStartEndDate,
  usePostHoliday,
  usePutHoliday,
  useDeleteHoliday,
  type GetHolidaysResp,
  type PostHolidayReq,
  type PutHolidayReq,
} from '@/api/holiday';
import HolidayEditDialog from '@/components/holiday/HolidayEditDialog';
import HolidayList from '@/components/holiday/HolidayList';
import { Button } from '@/components/shadcn/button';

const formatDateToYYYYMMDD = (dateString: string) => {
  if (!dateString) return '';
  return dayjs(dateString).format('YYYYMMDD');
};

export default function Holiday() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<GetHolidaysResp | null>(null);

  const currentYear = new Date().getFullYear();
  const startDate = `${currentYear}0101`;
  const endDate = `${currentYear}1231`;

  const { data: holidays, isLoading: holidaysLoding, refetch } = useGetHolidaysByStartEndDate({
    start_date: startDate,
    end_date: endDate,
    country_code: 'KR'
  });
  const postMutation = usePostHoliday();
  const putMutation = usePutHoliday();
  const deleteMutation = useDeleteHoliday();

  const handleSave = (data: PostHolidayReq) => {
    const payload = {
      ...data,
      holiday_date: formatDateToYYYYMMDD(data.holiday_date),
      lunar_date: data.lunar_date ? formatDateToYYYYMMDD(data.lunar_date) : ''
    };

    if (editingHoliday) {
      const putData: PutHolidayReq = {
        ...payload,
        holiday_seq: editingHoliday.holiday_seq,
      };
      putMutation.mutate(putData, {
        onSuccess: () => {
          refetch();
          setIsDialogOpen(false);
        }
      });
    } else {
      postMutation.mutate(payload, {
        onSuccess: () => {
          refetch();
          setIsDialogOpen(false);
        }
      });
    }
  };

  const handleEdit = (holiday: GetHolidaysResp) => {
    const formattedHoliday = {
      ...holiday,
      holiday_date: holiday.holiday_date.length === 8
        ? dayjs(
            `${holiday.holiday_date.substring(0, 4)}-${holiday.holiday_date.substring(4, 6)}-${holiday.holiday_date.substring(6, 8)}`
          ).format('YYYY-MM-DD')
        : holiday.holiday_date,
      lunar_date:
        holiday.lunar_date && holiday.lunar_date.length === 8
          ? dayjs(
              `${holiday.lunar_date.substring(0, 4)}-${holiday.lunar_date.substring(4, 6)}-${holiday.lunar_date.substring(6, 8)}`
            ).format('YYYY-MM-DD')
          : holiday.lunar_date,
    };
    setEditingHoliday(formattedHoliday);
    setIsDialogOpen(true);
  };

  const handleDelete = (holiday_seq: number) => {
    deleteMutation.mutate(String(holiday_seq), {
      onSuccess: () => {
        refetch();
      }
    });
  };

  const handleAddClick = () => {
    setEditingHoliday(null);
    setIsDialogOpen(true);
  };

  return (
    <div className='flex w-full h-full p-6'>
      <div className='w-full max-w-4xl mx-auto'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <div>
              <h1 className='text-3xl font-bold text-card-foreground'>공휴일 관리</h1>
              <p className='text-muted-foreground mt-1'>공휴일을 관리하고 추가/수정/삭제할 수 있습니다</p>
            </div>
          </div>
          <HolidayEditDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            editingHoliday={editingHoliday}
            onSave={handleSave}
            trigger={
              <Button className='flex items-center gap-2' onClick={handleAddClick}>
                추가
              </Button>
            }
          />
        </div>
        <HolidayList
          holidays={holidays}
          isLoading={holidaysLoding}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddClick={handleAddClick}
        />
      </div>
    </div>
  );
}
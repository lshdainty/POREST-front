import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dayjs from 'dayjs';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shadcn/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/shadcn/form';
import { InputDatePicker } from '@/components/shadcn/inputDatePicker';
import { type GetHolidaysResp, type PostHolidayReq } from '@/api/holiday';

const formSchema = z.object({
  holiday_name: z.string().min(1, { message: '공휴일 이름을 입력해주세요.' }),
  holiday_date: z.string().min(1, { message: '날짜를 선택해주세요.' }),
  holiday_type: z.string().min(1, { message: '공휴일 구분을 선택해주세요.' }),
  lunar_yn: z.string().min(1, { message: '음력 여부를 선택해주세요.' }),
  is_recurring: z.string().min(1, { message: '매년 반복 여부를 선택해주세요.' }),
  lunar_date: z.string().optional(),
  country_code: z.string().min(1, { message: '국가 코드를 입력해주세요.' }),
});

type HolidayFormValues = z.infer<typeof formSchema>;

interface HolidayEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingHoliday: GetHolidaysResp | null;
  onSave: (data: PostHolidayReq) => void;
  trigger?: React.ReactNode;
}

export default function HolidayEditDialog({
  isOpen,
  onOpenChange,
  editingHoliday,
  onSave,
  trigger,
}: HolidayEditDialogProps) {
  const form = useForm<HolidayFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      holiday_name: '',
      holiday_date: '',
      holiday_type: '',
      lunar_yn: 'N',
      is_recurring: 'Y',
      lunar_date: '',
      country_code: 'KR',
    },
  });

  useEffect(() => {
    if (editingHoliday) {
      form.reset(editingHoliday);
    } else {
      form.reset({
        holiday_name: '',
        holiday_date: '',
        holiday_type: '',
        lunar_yn: 'N',
        is_recurring: 'Y',
        lunar_date: '',
        country_code: 'KR',
      });
    }
  }, [editingHoliday, form]);

  const onSubmit = (values: HolidayFormValues) => {
    onSave(values);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button className='flex items-center gap-2'>
            추가
          </Button>
        </DialogTrigger>
      )}
      
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>
            {editingHoliday ? '공휴일 수정' : '새 공휴일 추가'}
          </DialogTitle>
          <DialogDescription>
            공휴일 정보를 입력해주세요.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name="holiday_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>공휴일 이름</FormLabel>
                  <FormControl>
                    <Input placeholder='예: 추석' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name="holiday_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>날짜</FormLabel>
                    <FormControl>
                      <InputDatePicker
                        value={field.value ? dayjs(field.value).format('YYYY-MM-DD') : ''}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="holiday_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>공휴일 구분</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='구분 선택' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='PUBLIC'>공휴일</SelectItem>
                        <SelectItem value='ETC'>기타</SelectItem>
                        <SelectItem value='SUBSTITUTE'>대체</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name="lunar_yn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>음력 여부</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='음력 여부' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Y'>음력</SelectItem>
                        <SelectItem value='N'>양력</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_recurring"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>매년 반복</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='반복 여부' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Y'>예</SelectItem>
                        <SelectItem value='N'>아니오</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {form.watch('lunar_yn') === 'Y' && (
              <FormField
                control={form.control}
                name="lunar_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>음력 날짜</FormLabel>
                    <FormControl>
                      <InputDatePicker
                        value={field.value ? dayjs(field.value).format('YYYY-MM-DD') : ''}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="country_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>국가 코드</FormLabel>
                  <FormControl>
                    <Input placeholder='예: KR' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end gap-2 pt-4'>
              <Button 
                type='button' 
                variant='outline' 
                onClick={handleCancel}
              >
                취소
              </Button>
              <Button type='submit'>
                {editingHoliday ? '수정' : '추가'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import { GetUsersResp } from '@/api/user';
import { Button } from '@/components/shadcn/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/shadcn/dialog';
import { Input } from '@/components/shadcn/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import { Separator } from '@/components/shadcn/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar';
import { User as UserIcon, Mail, Cake, Briefcase, Clock, Shield, Building2, UserRoundCog, UserRound } from 'lucide-react';
import { InputDatePicker } from '@/components/shadcn/inputDatePicker';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/shadcn/form';

const formSchema = z.object({
  user_name: z.string().min(1, { message: '이름을 입력해주세요.' }),
  user_id: z.string().min(1, { message: '아이디를 입력해주세요.' }),
  user_email: z.string().email({ message: '유효한 이메일을 입력해주세요.' }),
  user_birth: z.string().min(1, { message: '생년월일을 입력해주세요.' }),
  user_company_type: z.string().min(1, { message: '회사를 선택해주세요.' }),
  user_department_type: z.string().min(1, { message: '부서를 선택해주세요.' }),
  user_work_time: z.string().min(1, { message: '유연근무시간을 선택해주세요.' }),
  user_role_type: z.string().min(1, { message: '권한을 선택해주세요.' }),
});

interface UserEditDialogProps {
  user: GetUsersResp;
  trigger: React.ReactNode;
  onSave: (updatedUser: GetUsersResp) => void;
}

export default function UserEditDialog({ user, trigger, onSave }: UserEditDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<GetUsersResp>({
    resolver: zodResolver(formSchema),
    defaultValues: user,
  });

  const onSubmit = (values: GetUsersResp) => {
    onSave(values);
    setOpen(false);
  };

  const companyOptions = [
    { "company_type": "SKAX", "company_name": "SK AX" },
    { "company_type": "DTOL", "company_name": "디투엘" },
    { "company_type": "INSIGHTON", "company_name": "인사이트온" },
    { "company_type": "BIGXDATA", "company_name": "BigxData" },
    { "company_type": "CNTHOTH", "company_name": "씨앤토트플러스" },
    { "company_type": "AGS", "company_name": "AGS" }
  ];
  const departmentOptions = [
    { "department_type": "SKC", "department_name": "SKC" },
    { "department_type": "GMES", "department_name": "G-MES" },
    { "department_type": "GSCM", "department_name": "G-SCM" },
    { "department_type": "CMP", "department_name": "CMP MES" },
    { "department_type": "OLIVE", "department_name": "OLIVE" },
    { "department_type": "MYDATA", "department_name": "myDATA" },
    { "department_type": "TABLEAU", "department_name": "Tableau" },
    { "department_type": "AOI", "department_name": "AOI" }
  ];
  const workTimeOptions = [
    { value: '8 ~ 5', className: 'text-rose-500 dark:text-rose-400' },
    { value: '9 ~ 6', className: 'text-sky-500 dark:text-sky-400' },
    { value: '10 ~ 7', className: 'text-emerald-500 dark:text-emerald-400' }
  ];
  const roleOptions = [
    { value: 'ADMIN', className: 'text-rose-500 dark:text-rose-400' },
    { value: 'USER', className: 'text-sky-500 dark:text-sky-400' }
  ];

  const selectedWorkTime = workTimeOptions.find(option => option.value === form.watch('user_work_time'));
  const selectedRole = roleOptions.find(option => option.value === form.watch('user_role_type'));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>사용자 정보 수정</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className='flex flex-col items-center text-center p-6'>
              <Avatar className='w-24 h-24 mb-4'>
                <AvatarImage src='https://github.com/shadcn.png' alt={form.watch('user_name')} />
                <AvatarFallback>{form.watch('user_name').charAt(0)}</AvatarFallback>
              </Avatar>
              <FormField
                control={form.control}
                name="user_name"
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormControl>
                      <Input className='text-2xl font-bold text-center w-full' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator className='my-6' />
              <div className='w-full text-left space-y-5 text-sm'>
                <FormField
                  control={form.control}
                  name="user_id"
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex items-center'>
                        <FormLabel className='font-semibold w-24 shrink-0'><UserIcon className='mr-3 h-4 w-4 text-muted-foreground inline-block' />아이디</FormLabel>
                        <div className='flex-grow'>
                          <FormControl>
                            <Input {...field} disabled={user.user_id !== ''} className='w-full' />
                          </FormControl>
                        </div>
                      </div>
                      <FormMessage className='ml-28' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="user_email"
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex items-center'>
                        <FormLabel className='font-semibold w-24 shrink-0'><Mail className='mr-3 h-4 w-4 text-muted-foreground inline-block' />이메일</FormLabel>
                        <div className='flex-grow'>
                          <FormControl>
                            <Input {...field} className='w-full' />
                          </FormControl>
                        </div>
                      </div>
                      <FormMessage className='ml-28' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="user_birth"
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex items-center'>
                        <FormLabel className='font-semibold w-24 shrink-0'><Cake className='mr-3 h-4 w-4 text-muted-foreground inline-block' />생년월일</FormLabel>
                        <div className='flex-grow'>
                          <FormControl>
                            <div className='w-full'>
                              <InputDatePicker
                                value={dayjs(field.value).format('YYYY-MM-DD')}
                                onValueChange={(value) => field.onChange(dayjs(value).format('YYYYMMDD'))}
                              />
                            </div>
                          </FormControl>
                        </div>
                      </div>
                      <FormMessage className='ml-28' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="user_company_type"
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex items-center'>
                        <FormLabel className='font-semibold w-24 shrink-0'><Building2 className='mr-3 h-4 w-4 text-muted-foreground inline-block' />회사</FormLabel>
                        <div className='flex-grow'>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='회사 선택' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {companyOptions.map(option => <SelectItem key={option.company_type} value={option.company_type}>{option.company_name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <FormMessage className='ml-28' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="user_department_type"
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex items-center'>
                        <FormLabel className='font-semibold w-24 shrink-0'><Briefcase className='mr-3 h-4 w-4 text-muted-foreground inline-block' />부서</FormLabel>
                        <div className='flex-grow'>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='부서 선택' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {departmentOptions.map(option => <SelectItem key={option.department_type} value={option.department_type}>{option.department_name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <FormMessage className='ml-28' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="user_work_time"
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex items-center'>
                        <FormLabel className='font-semibold w-24 shrink-0'><Clock className='mr-3 h-4 w-4 text-muted-foreground inline-block' />유연근무시간</FormLabel>
                        <div className='flex-grow'>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className={cn('w-full', selectedWorkTime?.className)}>
                                <SelectValue placeholder='근무 시간 선택' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {workTimeOptions.map(option => <SelectItem key={option.value} value={option.value} className={option.className}>{option.value}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <FormMessage className='ml-28' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="user_role_type"
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex items-center'>
                        <FormLabel className='font-semibold w-24 shrink-0'><Shield className='mr-3 h-4 w-4 text-muted-foreground inline-block' />권한</FormLabel>
                        <div className='flex-grow'>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className='w-full'>
                                <div className={cn('flex items-center gap-2', selectedRole?.className)}>
                                  {field.value === 'ADMIN' ? <UserRoundCog size={14}/> : <UserRound size={14}/>}
                                  {field.value}
                                </div>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roleOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className={cn('flex items-center gap-2', option.className)}>
                                    {option.value === 'ADMIN' ? <UserRoundCog size={14}/> : <UserRound size={14}/>}
                                    {option.value}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <FormMessage className='ml-28' />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type='button' variant='secondary'>
                  취소
                </Button>
              </DialogClose>
              <Button type='submit'>
                저장
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import { GetUsersResp } from '@/api/user';
import { Input } from '@/components/shadcn/input';
import { Button } from '@/components/shadcn/button';
import { Separator } from '@/components/shadcn/separator';
import { InputDatePicker } from '@/components/shadcn/inputDatePicker';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/shadcn/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/shadcn/dialog';
import { User as UserIcon, Mail, Cake, Briefcase, Clock, Shield, Building2, UserRoundCog, UserRound, Moon } from 'lucide-react';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { companyOptions, departmentOptions } from '@/lib/constants';

const formSchema = z.object({
  user_name: z.string().min(1, { message: '이름을 입력해주세요.' }),
  user_id: z.string().min(1, { message: '아이디를 입력해주세요.' }),
  user_email: z.string().email({ message: '유효한 이메일을 입력해주세요.' }),
  user_birth: z.string().min(1, { message: '생년월일을 입력해주세요.' }),
  user_company_type: z.string().min(1, { message: '회사를 선택해주세요.' }),
  user_department_type: z.string().min(1, { message: '부서를 선택해주세요.' }),
  lunar_yn: z.string().min(1, { message: '음력여부를 선택해주세요.' }),
  user_work_time: z.string().min(1, { message: '유연근무시간을 선택해주세요.' }),
  user_role_type: z.string().min(1, { message: '권한을 선택해주세요.' }),
});

type UserFormValues = z.infer<typeof formSchema>;

interface UserEditDialogProps {
  user: GetUsersResp;
  trigger: React.ReactNode;
  onSave: (updatedUser: GetUsersResp) => void;
}

export default function UserEditDialog({ user, trigger, onSave }: UserEditDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...user,
      user_company_type: user.user_company_type || companyOptions[0].company_type,
      user_department_type: user.user_department_type || departmentOptions[0].department_type,
      lunar_yn: user.lunar_yn || 'N',
    },
  });

  const onSubmit = (values: UserFormValues) => {
    onSave({ ...user, ...values });
    setOpen(false);
  };

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
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>사용자 정보 수정</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex gap-6 p-6">
              <div className="w-1/3 flex flex-col items-center justify-center gap-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src="https://github.com/shadcn.png" alt={form.watch('user_name')} />
                  <AvatarFallback>{form.watch('user_name').charAt(0)}</AvatarFallback>
                </Avatar>
                <Button type="button" variant="outline" asChild>
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    이미지 업로드
                    <Input id="avatar-upload" type="file" className="hidden" />
                  </label>
                </Button>
              </div>

              <Separator orientation="vertical" className="h-auto" />

              <div className="w-2/3 space-y-4">
                <FormField
                  control={form.control}
                  name="user_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이름</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="user_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><UserIcon className='h-4 w-4 text-muted-foreground inline-block' /> 아이디</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={user.user_id !== ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="user_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><Mail className='h-4 w-4 text-muted-foreground inline-block' /> 이메일</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="user_birth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><Cake className='h-4 w-4 text-muted-foreground inline-block' /> 생년월일</FormLabel>
                        <FormControl>
                          <InputDatePicker
                            value={dayjs(field.value).format('YYYY-MM-DD')}
                            onValueChange={(value) => field.onChange(dayjs(value).format('YYYYMMDD'))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lunar_yn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><Moon className='h-4 w-4 text-muted-foreground inline-block' /> 음력여부</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="음력여부 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Y">Y</SelectItem>
                            <SelectItem value="N">N</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="user_company_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><Building2 className='h-4 w-4 text-muted-foreground inline-block' /> 회사</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="회사 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {companyOptions.map(option => <SelectItem key={option.company_type} value={option.company_type}>{option.company_name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="user_department_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><Briefcase className='h-4 w-4 text-muted-foreground inline-block' /> 부서</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="부서 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departmentOptions.map(option => <SelectItem key={option.department_type} value={option.department_type}>{option.department_name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="user_work_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><Clock className='h-4 w-4 text-muted-foreground inline-block' /> 유연근무시간</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={cn('w-full', selectedWorkTime?.className)}>
                              <SelectValue placeholder="근무 시간 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {workTimeOptions.map(option => <SelectItem key={option.value} value={option.value} className={option.className}>{option.value}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="user_role_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel><Shield className='h-4 w-4 text-muted-foreground inline-block' /> 권한</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  취소
                </Button>
              </DialogClose>
              <Button type="submit">
                저장
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

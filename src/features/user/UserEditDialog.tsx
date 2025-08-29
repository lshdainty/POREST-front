
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

interface UserEditDialogProps {
  user: GetUsersResp;
  trigger: React.ReactNode;
  onSave: (updatedUser: GetUsersResp) => void;
}

export default function UserEditDialog({ user, trigger, onSave }: UserEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [editedUser, setEditedUser] = useState<GetUsersResp>(user);

  const handleInputChange = (field: keyof GetUsersResp, value: string) => {
    setEditedUser(prev => ({ ...prev!, [field]: value }));
  };

  const handleDateChange = (value: string | undefined) => {
    if (!value) return;
    const formattedDate = dayjs(value).format('YYYYMMDD');
    handleInputChange('user_birth', formattedDate);
  };

  const handleSave = () => {
    if (editedUser) {
      onSave(editedUser);
      setOpen(false);
    }
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

  const selectedWorkTime = workTimeOptions.find(option => option.value === editedUser.user_work_time);
  const selectedRole = roleOptions.find(option => option.value === editedUser.user_role_type);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>사용자 정보 수정</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col items-center text-center p-6'>
          <Avatar className='w-24 h-24 mb-4'>
            <AvatarImage src='https://github.com/shadcn.png' alt={editedUser.user_name} />
            <AvatarFallback>{editedUser.user_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <Input
            className='text-2xl font-bold text-center w-full'
            value={editedUser.user_name}
            onChange={(e) => handleInputChange('user_name', e.target.value)}
          />
          <Separator className='my-6' />
          <div className='w-full text-left space-y-5 text-sm'>
            <div className='flex items-center'>
              <UserIcon className='mr-3 h-4 w-4 text-muted-foreground' />
              <span className='font-semibold w-24'>아이디</span>
              <div className='flex-grow'>
                <Input
                  value={editedUser.user_id}
                  onChange={user.user_id === '' ? (e) => handleInputChange('user_id', e.target.value) : undefined}
                  disabled={user.user_id !== ''}
                  className='w-full'
                />
              </div>
            </div>
            <div className='flex items-center'>
              <Mail className='mr-3 h-4 w-4 text-muted-foreground' />
              <span className='font-semibold w-24'>이메일</span>
              <div className='flex-grow'>
                <Input value={editedUser.user_email} onChange={(e) => handleInputChange('user_email', e.target.value)} className='w-full' />
              </div>
            </div>
            <div className='flex items-center'>
              <Cake className='mr-3 h-4 w-4 text-muted-foreground' />
              <span className='font-semibold w-24'>생년월일</span>
              <div className='flex-grow'>
                <InputDatePicker
                  value={dayjs(editedUser.user_birth).format('YYYY-MM-DD')}
                  onValueChange={handleDateChange}
                />
              </div>
            </div>
            <div className='flex items-center'>
              <Building2 className='mr-3 h-4 w-4 text-muted-foreground' />
              <span className='font-semibold w-24'>회사</span>
              <div className='flex-grow'>
                <Select value={editedUser.user_company_type} onValueChange={(value) => handleInputChange('user_company_type', value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='회사 선택' />
                  </SelectTrigger>
                  <SelectContent>
                    {companyOptions.map(option => <SelectItem key={option.company_type} value={option.company_type}>{option.company_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='flex items-center'>
              <Briefcase className='mr-3 h-4 w-4 text-muted-foreground' />
              <span className='font-semibold w-24'>부서</span>
              <div className='flex-grow'>
                <Select value={editedUser.user_department_type} onValueChange={(value) => handleInputChange('user_department_type', value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='부서 선택' />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentOptions.map(option => <SelectItem key={option.department_type} value={option.department_type}>{option.department_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='flex items-center'>
              <Clock className='mr-3 h-4 w-4 text-muted-foreground' />
              <span className='font-semibold w-24'>유연근무시간</span>
              <div className='flex-grow'>
                <Select value={editedUser.user_work_time} onValueChange={(value) => handleInputChange('user_work_time', value)}>
                  <SelectTrigger className={cn('w-full', selectedWorkTime?.className)}>
                    <SelectValue placeholder='근무 시간 선택' />
                  </SelectTrigger>
                  <SelectContent>
                    {workTimeOptions.map(option => <SelectItem key={option.value} value={option.value} className={option.className}>{option.value}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='flex items-center'>
              <Shield className='mr-3 h-4 w-4 text-muted-foreground' />
              <span className='font-semibold w-24'>권한</span>
              <div className='flex-grow'>
                <Select value={editedUser.user_role_type} onValueChange={(value) => handleInputChange('user_role_type', value)}>
                  <SelectTrigger className='w-full'>
                    <div className={cn('flex items-center gap-2', selectedRole?.className)}>
                      {editedUser.user_role_type === 'ADMIN' ? <UserRoundCog size={14}/> : <UserRound size={14}/>}
                      {editedUser.user_role_type}
                    </div>
                  </SelectTrigger>
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
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              취소
            </Button>
          </DialogClose>
          <Button type='button' onClick={handleSave}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

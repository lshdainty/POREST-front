import { useState, useRef, useEffect } from 'react';
import { GetUsersResp, usePostUploadProfile, type PutUserReq } from '@/api/user';
import { Input } from '@/components/shadcn/input';
import { Button } from '@/components/shadcn/button';
import { Separator } from '@/components/shadcn/separator';
import { InputDatePicker } from '@/components/shadcn/inputDatePicker';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/shadcn/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/shadcn/dialog';
import { Alert, AlertDescription } from '@/components/shadcn/alert';
import { Skeleton } from '@/components/shadcn/skeleton';
import { 
  User as UserIcon, 
  Mail, 
  Cake, 
  Briefcase, 
  Clock, 
  Shield, 
  Building2, 
  UserRoundCog, 
  UserRound, 
  Moon,
  Upload,
  Trash2,
  Loader2,
  AlertCircle,
  Camera
} from 'lucide-react';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { companyOptions, departmentOptions } from '@/lib/constants';
import config from '@/lib/config';

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
  onSave: (updatedUser: PutUserReq) => void;
  title: string;
}

// 이미지 압축 유틸리티 함수
const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const compressedFile = new File([blob!], file.name, {
          type: file.type,
          lastModified: Date.now(),
        });
        resolve(compressedFile);
      }, file.type, quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export default function UserEditDialog({ user, trigger, onSave, title }: UserEditDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: uploadProfile, isPending: isUploading } = usePostUploadProfile();
  
  // 이미지 업로드 관련 상태 관리
  const [profileImage, setProfileImage] = useState<string>(user.profile_url || '');
  const [profileUUID, setProfileUUID] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_name: '',
      user_id: '',
      user_email: '',
      user_birth: dayjs().format('YYYY-MM-DD'),
      user_company_type: companyOptions[0].company_type,
      user_department_type: departmentOptions[0].department_type,
      lunar_yn: 'N',
      user_work_time: '9 ~ 6',
      user_role_type: 'USER',
    },
  });

  useEffect(() => {
    if (open) {
      if (title === '사용자 추가') {
        form.reset();
        setProfileImage('');
      } else { // 수정 또는 복사
        form.reset({
          ...user,
          user_company_type: user.user_company_type || companyOptions[0].company_type,
          user_department_type: user.user_department_type || departmentOptions[0].department_type,
          lunar_yn: user.lunar_yn || 'N',
        });
        setProfileImage(user.profile_url || '');
      }
      setProfileUUID('');
      setUploadError('');
      setUploadSuccess(false);
    }
  }, [open, user, title, form]);

  // 이미지 파일 선택 핸들러
  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  // 파일 변경 핸들러 - 이미지 업로드 및 압축 처리
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      setUploadError('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    setUploadError('');
    setUploadSuccess(false);

    try {
      // 이미지 압축 처리
      const compressedFile = await compressImage(file);
      
      const data = await uploadProfile(compressedFile);

      console.log(data);

      // 성공 시 이미지 URL 업데이트
      setProfileImage(`${config.baseUrl}${data.profile_url}`);
      setProfileUUID(data.profile_uuid)
      setUploadSuccess(true);
      
      // 성공 메시지를 3초 후 자동 숨김
      setTimeout(() => setUploadSuccess(false), 3000);
      
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 프로필 이미지 삭제 핸들러
  const handleImageDelete = async () => {
    if (!profileImage) return;

    setProfileImage('');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const onSubmit = (values: UserFormValues) => {
    // 업데이트된 사용자 정보에 프로필 이미지 URL 포함
    onSave({ 
      ...user, 
      ...values, 
      profile_url: profileImage,
      profile_uuid: profileUUID
    });
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
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex gap-6 p-6">
              <div className="w-1/3 flex flex-col items-center justify-center gap-4">
                {/* 프로필 이미지 섹션 - 호버 효과와 로딩 표시 개선 */}
                <div className="relative group">
                  {isUploading ? (
                    // 로딩 중일 때 스켈레톤과 로딩 스피너 함께 표시
                    <div className="relative">
                      <Skeleton className="w-40 h-40 rounded-full" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">처리 중...</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Avatar className="w-40 h-40">
                      <AvatarImage 
                        src={profileImage} 
                        alt={form.watch('user_name')} 
                      />
                      <AvatarFallback>{form.watch('user_name').charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  
                  {/* 이미지 호버 시 업로드/수정/삭제 버튼 표시 */}
                  {!isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full">
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white/20"
                          onClick={handleImageSelect}
                          title={profileImage ? "이미지 변경" : "이미지 업로드"}
                        >
                          {profileImage ? (
                            <Camera className="h-4 w-4" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                        </Button>
                        {profileImage && (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                            onClick={handleImageDelete}
                            title="이미지 삭제"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 숨겨진 파일 입력 요소 */}
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* 업로드 상태 메시지 표시 */}
                {uploadError && (
                  <Alert className="w-full" variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{uploadError}</AlertDescription>
                  </Alert>
                )}

                {uploadSuccess && (
                  <Alert className="w-full">
                    <AlertDescription>이미지가 성공적으로 처리되었습니다.</AlertDescription>
                  </Alert>
                )}
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
              <Button type="submit" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    처리 중...
                  </>
                ) : (
                  '저장'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
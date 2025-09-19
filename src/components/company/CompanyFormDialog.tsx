import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/shadcn/dialog';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Textarea } from '@/components/shadcn/textarea';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/shadcn/form';

const companyFormSchema = z.object({
  company_name: z.string().min(1, { message: '회사명을 입력해주세요.' }),
  business_number: z.string().optional(),
  ceo_name: z.string().optional(),
  establishment_date: z.string().optional(),
  business_type: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: '올바른 이메일 형식을 입력해주세요.',
    }),
  website: z.string().optional(),
  employee_count: z.string().optional(),
  capital: z.string().optional(),
  description: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

const CompanyFormDialog = ({ isOpen, onOpenChange, onSave, initialData = {} }) => {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    // 정적 기본값 설정
    defaultValues: {
      company_name: '',
      business_number: '',
      ceo_name: '',
      establishment_date: '',
      business_type: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      employee_count: '',
      capital: '',
      description: '',
    },
    mode: 'onChange',
  });

  // useEffect를 통한 form 값 설정 (의존성 배열 최적화)
  useEffect(() => {
    if (isOpen && initialData) {
      form.reset({
        company_name: initialData.company_name || '',
        business_number: initialData.business_number || '',
        ceo_name: initialData.ceo_name || '',
        establishment_date: initialData.establishment_date || '',
        business_type: initialData.business_type || '',
        address: initialData.address || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        website: initialData.website || '',
        employee_count: initialData.employee_count?.toString() || '',
        capital: initialData.capital || '',
        description: initialData.description || '',
      });
    }
  }, [isOpen, form]); // initialData를 의존성에서 제거

  const onSubmit = (values: CompanyFormValues) => {
    onSave(values);
    // Dialog 닫기 및 폼 초기화를 부모 컴포넌트에서 처리하도록 변경
  };

  // Dialog 닫힐 때 폼 초기화
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>회사 정보 입력</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>회사명 *</FormLabel>
                    <FormControl>
                      <Input placeholder="회사명을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="business_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>사업자등록번호</FormLabel>
                    <FormControl>
                      <Input placeholder="000-00-00000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="ceo_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>대표자명</FormLabel>
                    <FormControl>
                      <Input placeholder="대표자명을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="establishment_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>설립일</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="business_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>업종</FormLabel>
                    <FormControl>
                      <Input placeholder="예: 소프트웨어 개발" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="employee_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>직원수</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="직원 수를 입력하세요" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>주소</FormLabel>
                  <FormControl>
                    <Input placeholder="회사 주소를 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>전화번호</FormLabel>
                    <FormControl>
                      <Input placeholder="02-1234-5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="company@example.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>웹사이트</FormLabel>
                    <FormControl>
                      <Input placeholder="www.company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="capital"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>자본금</FormLabel>
                  <FormControl>
                    <Input placeholder="예: 10억원" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>회사소개</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="회사에 대한 간단한 소개를 입력하세요"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => handleOpenChange(false)}
              >
                취소
              </Button>
              <Button 
                type="submit"
                disabled={!form.formState.isValid || form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? '저장 중...' : '저장'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyFormDialog;

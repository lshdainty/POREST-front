import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/shadcn/input';
import { Button } from '@/components/shadcn/button';
import { Textarea } from '@/components/shadcn/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/shadcn/form';

const companyFormSchema = z.object({
  company_name: z.string().min(1, { message: '회사명을 입력해주세요.' }),
  description: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

interface CompanyFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (formData: CompanyFormValues) => void;
  initialData?: Partial<CompanyFormValues>;
}

const CompanyFormDialog: React.FC<CompanyFormDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onSave, 
  initialData = {} 
}) => {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      company_name: '',
      description: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (isOpen && initialData) {
      form.reset({
        company_name: initialData.company_name || '',
        description: initialData.description || '',
      });
    }
  }, [isOpen, form]);

  const onSubmit = (values: CompanyFormValues): void => {
    onSave(values);
  };

  const handleOpenChange = (open: boolean): void => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>회사 정보 입력</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>회사소개</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="회사에 대한 간단한 소개를 입력하세요"
                      rows={4}
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
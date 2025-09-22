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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/shadcn/form';
import { Department } from '@/types/company';

const departmentFormSchema = z.object({
  department_name: z.string().min(1, { message: '영문 부서명을 입력해주세요.' }),
  department_name_kr: z.string().min(1, { message: '한글 부서명을 입력해주세요.' }),
  department_type: z.string().min(1, { message: '부서유형을 선택해주세요.' }),
  department_desc: z.string().optional(),
});

type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

interface DepartmentFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (formData: Department) => void;
  initialData?: Department | null;
  isEditing?: boolean;
  isAddingChild?: boolean;
}

const OrganizationFormDialog: React.FC<DepartmentFormDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onSave, 
  initialData = null,
  isEditing = false,
  isAddingChild = false 
}) => {
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      department_name: '',
      department_name_kr: '',
      department_type: '',
      department_desc: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditing && initialData) {
        form.reset({
          department_name: initialData.department_name || '',
          department_name_kr: initialData.department_name_kr || '',
          department_type: initialData.department_type || '',
          department_desc: initialData.department_desc || '',
        });
      } else {
        form.reset({
          department_name: '',
          department_name_kr: '',
          department_type: '',
          department_desc: '',
        });
      }
    }
  }, [isOpen, isEditing, initialData, form]);

  const onSubmit = (values: DepartmentFormValues): void => {
    const departmentData: Department = {
      department_id: initialData?.department_id || Date.now(),
      department_name: values.department_name,
      department_name_kr: values.department_name_kr,
      parent_department_id: initialData?.parent_department_id || 0,
      department_level: initialData?.department_level || 0,
      department_type: values.department_type,
      department_desc: values.department_desc || '',
      children_department: initialData?.children_department || [],
    };
    onSave(departmentData);
  };

  const getDialogTitle = () => {
    if (isAddingChild) return '하위 부서 추가';
    if (isEditing) return '부서 수정';
    return '부서 추가';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="department_name_kr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>한글 부서명 *</FormLabel>
                    <FormControl>
                      <Input placeholder="예: 인사팀" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="department_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>영문 부서명 *</FormLabel>
                    <FormControl>
                      <Input placeholder="예: HR Team" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="department_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>부서유형 *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="본사">본사</SelectItem>
                      <SelectItem value="본부">본부</SelectItem>
                      <SelectItem value="부서">부서</SelectItem>
                      <SelectItem value="팀">팀</SelectItem>
                      <SelectItem value="파트">파트</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="department_desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>부서설명</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="부서에 대한 설명을 입력하세요"
                      rows={2}
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
                onClick={() => onOpenChange(false)}
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

export default OrganizationFormDialog;

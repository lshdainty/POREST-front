import React, { useState, useMemo } from 'react';
import CompanyCreateCard from '@/components/company/CompanyCreateCard';
import DepartmentTreePanel from '@/components/company/DepartmentTreePanel';
import DepartmentChartPanel from '@/components/company/DepartmentChartPanel';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/shadcn/resizable";
import { Building2 } from 'lucide-react';
import { useGetCompanyWithDepartments, usePostCompany } from '@/api/company';
import { Skeleton } from '@/components/shadcn/skeleton';

// API 응답을 Department[] 타입으로 변환하는 함수
const transformToDepartments = (data: any[]): Department[] => {
  return data.map(d => ({
    department_id: d.department_id,
    department_name: d.department_name,
    department_name_kr: d.department_name_kr,
    parent_department_id: d.parent_id,
    department_level: d.tree_level,
    department_type: d.department_type || '팀', // API에 없으므로 기본값 설정
    department_desc: d.department_desc,
    children_department: d.children ? transformToDepartments(d.children) : [],
  }));
};

export default function Company() {
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  
  // 임시로 company_id '1' 사용
  const { data: companyData, isLoading, isError } = useGetCompanyWithDepartments({ company_id: 'SKC' });
  const { mutate: createCompany } = usePostCompany();

  const company: Company | null = useMemo(() => {
    if (!companyData) return null;
    return {
      company_id: companyData.company_id,
      company_name: companyData.company_name,
      company_desc: companyData.company_desc,
    };
  }, [companyData]);

  const departments: Department[] = useMemo(() => {
    if (companyData?.departments) {
      return transformToDepartments(companyData.departments);
    }
    return [];
  }, [companyData]);

  const handleCompanyCreate = (companyFormData: Omit<Company, 'company_id'>) => {
    console.log('회사 생성:', companyFormData);
    // createCompany(companyFormData); // TODO: API 연동
  };

  const handleDeptUpdate = (formData: Department, editingDept: any) => {
    console.log('부서 업데이트:', formData, editingDept);
    // TODO: 부서 업데이트 API 연동
  };

  const handleDeptDelete = (deptId: number) => {
    console.log('부서 삭제:', deptId);
    // TODO: 부서 삭제 API 연동
  };

  const handleAddDeptFromChart = () => {
    console.log('차트에서 부서 추가');
    // TODO: 부서 추가 로직 구현
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6 h-full">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-48" />
        </div>
        <ResizablePanelGroup direction="horizontal" className="flex-grow rounded-lg border">
          <ResizablePanel defaultSize={30} minSize={25}>
            <div className="p-4 space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={70}>
          <div className="p-4 space-y-2">
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-96 w-full" />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
  }

  // 회사 정보가 없거나 에러 발생 시 회사 생성 화면 표시
  if (isError || !company) {
    return (
      <div className='flex-1 flex items-center justify-center'>
        <CompanyCreateCard onCompanyCreate={handleCompanyCreate} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6 h-full">
      <div className="flex items-center gap-2">
        <Building2 />
        <h1 className="text-3xl font-bold">{company.company_name}</h1>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-grow rounded-lg border">
        <ResizablePanel defaultSize={30} minSize={25}>
          <DepartmentTreePanel
            departments={departments}
            selectedDept={selectedDept}
            onDeptSelect={setSelectedDept}
            onDeptUpdate={handleDeptUpdate}
            onDeptDelete={handleDeptDelete}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={70}>
          <DepartmentChartPanel
            departments={departments}
            onAddClick={handleAddDeptFromChart}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

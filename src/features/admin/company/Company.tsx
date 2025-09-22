import React, { useState, useEffect } from 'react';
import { Building2, Phone, Mail, Globe } from 'lucide-react';
import CompanyCreateCard from '@/components/company/CompanyCreateCard';
import OrganizationTreePanel from '@/components/company/OrganizationTreePanel';
import OrganizationChartPanel from '@/components/company/OrganizationChartPanel';
import { Company } from '@/types/company';
import { Department } from '@/types/company';

export default function CompanyPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  // 샘플 데이터 (테스트용)
  useEffect(() => {
    const sampleData = {
      company: {
        company_id: "1",
        company_name: "테크코리아",
        company_desc: "혁신적인 소프트웨어 솔루션을 제공하는 기술 기업"
      },
      departments: [
        {
          department_id: 1,
          department_name: "Tech Korea",
          department_name_kr: "테크코리아",
          parent_department_id: 0,
          department_level: 0,
          department_type: "본사",
          department_desc: "본사",
          children_department: [
            {
              department_id: 2,
              department_name: "Management Support Division",
              department_name_kr: "경영지원본부",
              parent_department_id: 1,
              department_level: 1,
              department_type: "본부",
              department_desc: "경영지원업무",
              children_department: [
                {
                  department_id: 3,
                  department_name: "HR Team",
                  department_name_kr: "인사팀",
                  parent_department_id: 2,
                  department_level: 2,
                  department_type: "팀",
                  department_desc: "인사관리",
                  children_department: []
                }
              ]
            }
          ]
        }
      ]
    };
    
    // 개발 시에는 주석 해제하여 샘플 데이터 사용
    // setCompany(sampleData.company);
    // setDepartments(sampleData.departments);
  }, []);

  const handleCompanyCreate = (companyData: Omit<Company, 'company_id'>) => {
    const newCompany: Company = {
      company_id: Date.now().toString(),
      ...companyData
    };
    console.log('회사 생성:', newCompany);
    setCompany(newCompany);
  };

  const handleDeptUpdate = (formData: Department, editingDept: any) => {
    console.log('부서 업데이트:', formData, editingDept);
    
    if (editingDept && editingDept.isAddingChild) {
      // 하위 노드 추가 로직
      const parentId = editingDept.department_id;
      console.log('하위 노드 추가:', formData, '부모 ID:', parentId);
      
      const addChildToParent = (depts: Department[]): Department[] => {
        return depts.map(dept => {
          if (dept.department_id === parentId) {
            return {
              ...dept,
              children_department: [
                ...dept.children_department,
                formData
              ]
            };
          }
          
          if (dept.children_department && dept.children_department.length > 0) {
            return {
              ...dept,
              children_department: addChildToParent(dept.children_department)
            };
          }
          
          return dept;
        });
      };
      
      setDepartments(addChildToParent(departments));
      
    } else if (editingDept && editingDept.isDragDrop) {
      // 드래그앤드롭 로직
      const sourceId = formData.department_id;
      const targetId = editingDept.department_id;
      console.log('드래그앤드롭:', sourceId, '→', targetId);
      
    } else if (editingDept && editingDept.department_id) {
      // 기존 노드 수정 로직
      console.log('노드 수정:', formData, editingDept);
      
      const updateDept = (depts: Department[]): Department[] => {
        return depts.map(dept => {
          if (dept.department_id === editingDept.department_id) {
            return { ...dept, ...formData };
          }
          if (dept.children_department) {
            return { ...dept, children_department: updateDept(dept.children_department) };
          }
          return dept;
        });
      };
      setDepartments(updateDept(departments));
      
    } else {
      // 최상위 새로 추가 로직
      console.log('최상위 노드 추가:', formData);
      
      const newDept: Department = {
        department_id: Date.now(),
        department_level: 0,
        parent_department_id: 0,
        children_department: [],
        ...formData
      };
      setDepartments([...departments, newDept]);
    }
  };

  const handleDeptDelete = (deptId: number) => {
    console.log('부서 삭제:', deptId);
    
    const deleteFromTree = (depts: Department[]): Department[] => {
      return depts.filter(dept => {
        if (dept.department_id === deptId) return false;
        if (dept.children_department) {
          dept.children_department = deleteFromTree(dept.children_department);
        }
        return true;
      });
    };
    setDepartments(deleteFromTree(departments));
  };

  const handleAddDeptFromChart = () => {
    console.log('차트에서 부서 추가');
  };

  // 회사 정보가 없으면 회사 생성 화면 표시
  if (!company) {
    return (
      <div className='flex-1 flex items-center justify-center'>
        <CompanyCreateCard onCompanyCreate={handleCompanyCreate} />
      </div>
    );
  }

  return (
    <div className='p-4 sm:p-6 md:p-8'>
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Building2 className="text-blue-600" size={24} />
            <div>
              <h1 className="text-xl font-bold">{company.company_name}</h1>
              <p className="text-sm text-gray-600">{company.company_desc}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <OrganizationTreePanel
          departments={departments}
          selectedDept={selectedDept}
          onDeptSelect={setSelectedDept}
          onDeptUpdate={handleDeptUpdate}
          onDeptDelete={handleDeptDelete}
        />
        
        <OrganizationChartPanel
          departments={departments}
          onAddClick={handleAddDeptFromChart}
        />
      </div>
    </div>
  );
}

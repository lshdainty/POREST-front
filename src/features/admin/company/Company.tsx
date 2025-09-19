import React, { useState, useEffect } from 'react';
import { Building2, Phone, Mail, Globe } from 'lucide-react';
import CompanyCreatePage from '@/components/company/CompanyCreatePage';
import OrganizationTreePanel from '@/components/company/OrganizationTreePanel';
import OrganizationChartPanel from '@/components/company/OrganizationChartPanel';

export default function Company() {
  const [company, setCompany] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);

  // 샘플 데이터 (테스트용)
  useEffect(() => {
    const sampleData = {
      company: {
        company_name: "테크코리아",
        business_number: "123-45-67890",
        ceo_name: "김대표",
        establishment_date: "2020-01-01",
        business_type: "소프트웨어 개발",
        address: "서울시 강남구 테헤란로 123",
        phone: "02-1234-5678",
        email: "info@techkorea.com",
        website: "www.techkorea.com",
        employee_count: "150",
        capital: "10억원",
        description: "혁신적인 소프트웨어 솔루션을 제공하는 기술 기업"
      },
      organizations: [
        {
          org_id: "1",
          org_name: "테크코리아",
          org_name_en: "Tech Korea",
          org_code: "TK",
          parent_org_id: null,
          org_level: 0,
          org_type: "본사",
          manager_name: "김대표",
          is_hidden: false,
          is_active: true,
          description: "본사",
          children: [
            {
              org_id: "2",
              org_name: "경영지원본부",
              org_name_en: "Management Support Division",
              org_code: "MS",
              parent_org_id: "1",
              org_level: 1,
              org_type: "본부",
              manager_name: "이본부장",
              is_hidden: false,
              is_active: true,
              description: "경영지원업무",
              children: [
                {
                  org_id: "3",
                  org_name: "인사팀",
                  org_name_en: "HR Team",
                  org_code: "HR",
                  parent_org_id: "2",
                  org_level: 2,
                  org_type: "팀",
                  manager_name: "박팀장",
                  is_hidden: false,
                  is_active: true,
                  description: "인사관리",
                  children: []
                }
              ]
            }
          ]
        }
      ]
    };
    
    // 개발 시에는 주석 해제하여 샘플 데이터 사용
    // setCompany(sampleData.company);
    // setOrganizations(sampleData.organizations);
  }, []);

  const handleCompanyCreate = (companyData) => {
    console.log('회사 생성:', companyData);
    setCompany(companyData);
  };

  const handleOrgUpdate = (formData, editingOrg) => {
    console.log('조직 업데이트:', formData, editingOrg);
    
    if (editingOrg) {
      // 수정 로직
      const updateOrg = (orgs) => {
        return orgs.map(org => {
          if (org.org_id === editingOrg.org_id) {
            return { ...org, ...formData };
          }
          if (org.children) {
            return { ...org, children: updateOrg(org.children) };
          }
          return org;
        });
      };
      setOrganizations(updateOrg(organizations));
    } else {
      // 새로 추가 로직
      const newOrg = {
        org_id: Date.now().toString(),
        org_level: 0,
        is_hidden: false,
        is_active: true,
        children: [],
        ...formData
      };
      setOrganizations([...organizations, newOrg]);
    }
  };

  const handleOrgDelete = (orgId) => {
    console.log('조직 삭제:', orgId);
    
    const deleteFromTree = (orgs) => {
      return orgs.filter(org => {
        if (org.org_id === orgId) return false;
        if (org.children) {
          org.children = deleteFromTree(org.children);
        }
        return true;
      });
    };
    setOrganizations(deleteFromTree(organizations));
  };

  const handleToggleVisibility = (orgId) => {
    console.log('조직 숨김/표시 토글:', orgId);
    
    const toggleInTree = (orgs) => {
      return orgs.map(org => {
        if (org.org_id === orgId) {
          return { ...org, is_hidden: !org.is_hidden };
        }
        if (org.children) {
          return { ...org, children: toggleInTree(org.children) };
        }
        return org;
      });
    };
    setOrganizations(toggleInTree(organizations));
  };

  const handleAddOrgFromChart = () => {
    console.log('차트에서 조직 추가');
  };

  // 회사 정보가 없으면 회사 생성 화면 표시
  if (!company) {
    return (
      <div className='flex-1 flex items-center justify-center'>
        <CompanyCreatePage onCompanyCreate={handleCompanyCreate} />
      </div>
    );
  }

  return (
    <div className='p-4 sm:p-6 md:p-8 h-screen bg-gray-50 flex flex-col'>
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 p-4 sm:p-6 md:p-8 pb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Building2 className="text-blue-600" size={24} />
            <div>
              <h1 className="text-xl font-bold">{company.company_name}</h1>
              <p className="text-sm text-gray-600">{company.business_type}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {company.phone && (
              <div className="flex items-center space-x-1">
                <Phone size={16} />
                <span>{company.phone}</span>
              </div>
            )}
            {company.email && (
              <div className="flex items-center space-x-1">
                <Mail size={16} />
                <span>{company.email}</span>
              </div>
            )}
            {company.website && (
              <div className="flex items-center space-x-1">
                <Globe size={16} />
                <span>{company.website}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <OrganizationTreePanel
          organizations={organizations}
          selectedOrg={selectedOrg}
          onOrgSelect={setSelectedOrg}
          onOrgUpdate={handleOrgUpdate}
          onOrgDelete={handleOrgDelete}
          onToggleVisibility={handleToggleVisibility}
        />
        
        <OrganizationChartPanel
          organizations={organizations}
          onAddClick={handleAddOrgFromChart}
        />
      </div>
    </div>
  );
}

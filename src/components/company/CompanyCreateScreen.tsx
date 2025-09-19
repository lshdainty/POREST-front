import React, { useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Button } from '@/components/shadcn/button';
import CompanyFormDialog from './CompanyFormDialog';

const CompanyCreateScreen = ({ onCompanyCreate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSaveCompany = (formData) => {
    console.log('회사 정보 저장:', formData);
    onCompanyCreate(formData);
    setIsDialogOpen(false);
  };

  const handleDialogOpenChange = (open) => {
    setIsDialogOpen(open);
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <Building2 className="text-blue-600" />
          <span>조직도 관리 시스템</span>
        </CardTitle>
        <CardDescription>
          회사 정보를 입력하여 시작하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          className="w-full" 
          size="lg"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="mr-2" />
          회사 추가하기
        </Button>
        
        <CompanyFormDialog
          isOpen={isDialogOpen}
          onOpenChange={handleDialogOpenChange}
          onSave={handleSaveCompany}
          initialData={{}}
        />
      </CardContent>
    </Card>
  );
};

export default CompanyCreateScreen;

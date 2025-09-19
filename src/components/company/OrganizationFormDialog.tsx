import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/shadcn/dialog';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Textarea } from '@/components/shadcn/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';

const OrganizationFormDialog = ({ 
  isOpen, 
  onOpenChange, 
  onSave, 
  initialData = {}, 
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    org_name: '',
    org_name_en: '',
    org_code: '',
    parent_org_id: '',
    org_type: '',
    manager_name: '',
    description: '',
    is_hidden: false,
    is_active: true,
    ...initialData
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? '조직 수정' : '조직 추가'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="org_name">조직명 *</Label>
              <Input
                id="org_name"
                value={formData.org_name}
                onChange={(e) => handleInputChange('org_name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="org_name_en">영문조직명</Label>
              <Input
                id="org_name_en"
                value={formData.org_name_en}
                onChange={(e) => handleInputChange('org_name_en', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="org_code">조직코드</Label>
              <Input
                id="org_code"
                value={formData.org_code}
                onChange={(e) => handleInputChange('org_code', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="org_type">조직유형</Label>
              <Select 
                value={formData.org_type} 
                onValueChange={(value) => handleInputChange('org_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="본사">본사</SelectItem>
                  <SelectItem value="본부">본부</SelectItem>
                  <SelectItem value="부서">부서</SelectItem>
                  <SelectItem value="팀">팀</SelectItem>
                  <SelectItem value="파트">파트</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="manager_name">조직장명</Label>
            <Input
              id="manager_name"
              value={formData.manager_name}
              onChange={(e) => handleInputChange('manager_name', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="description">조직설명</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={2}
            />
          </div>
          
          <Button type="submit" className="w-full">저장</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrganizationFormDialog;

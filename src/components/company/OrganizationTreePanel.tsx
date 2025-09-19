import React, { useState } from 'react';
import { Building2, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { Badge } from '@/components/shadcn/badge';
import OrganizationFormDialog from '@/components/company/OrganizationFormDialog';

const OrganizationTreePanel = ({ 
  organizations, 
  selectedOrg,
  onOrgSelect,
  onOrgUpdate,
  onOrgDelete,
  onToggleVisibility 
}) => {
  const [isOrgDialogOpen, setIsOrgDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);

  const handleSaveOrg = (formData) => {
    onOrgUpdate(formData, editingOrg);
    setIsOrgDialogOpen(false);
    setEditingOrg(null);
  };

  const handleEditClick = (org, e) => {
    e.stopPropagation();
    setEditingOrg(org);
    setIsOrgDialogOpen(true);
  };

  const handleAddClick = () => {
    setEditingOrg(null);
    setIsOrgDialogOpen(true);
  };

  const renderTreeNode = (org, level = 0) => {
    return (
      <div key={org.org_id}>
        <div
          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
            selectedOrg?.org_id === org.org_id 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
          style={{ marginLeft: `${level * 16}px` }}
          onClick={() => onOrgSelect(org)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 size={16} />
              <span className="font-medium">{org.org_name}</span>
              <Badge variant="outline">{org.org_type}</Badge>
              {org.is_hidden && <EyeOff size={14} className="text-gray-400" />}
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleEditClick(org, e)}
              >
                <Edit size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility(org.org_id);
                }}
              >
                {org.is_hidden ? <Eye size={14} /> : <EyeOff size={14} />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onOrgDelete(org.org_id);
                }}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
          <div className="mt-1 text-sm text-gray-600">
            {org.manager_name && <span>조직장: {org.manager_name}</span>}
          </div>
        </div>
        
        {/* 하위 조직 렌더링 */}
        {org.children && org.children.length > 0 && (
          <div className="mt-2 space-y-2">
            {org.children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-1/3 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">조직 관리</h2>
        <Button size="sm" onClick={handleAddClick}>
          <Plus size={16} className="mr-2" />
          조직 추가
        </Button>
      </div>

      <div className="space-y-2">
        {organizations.length > 0 ? (
          organizations.map(org => renderTreeNode(org))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Building2 size={48} className="mx-auto mb-2" />
            <p>조직이 없습니다</p>
            <Button onClick={handleAddClick} className="mt-2">
              <Plus size={16} className="mr-2" />
              첫 조직 추가하기
            </Button>
          </div>
        )}
      </div>

      <OrganizationFormDialog
        isOpen={isOrgDialogOpen}
        onOpenChange={setIsOrgDialogOpen}
        onSave={handleSaveOrg}
        initialData={editingOrg}
        isEditing={!!editingOrg}
      />
    </div>
  );
};

export default OrganizationTreePanel;

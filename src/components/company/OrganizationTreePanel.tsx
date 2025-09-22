import React, { useState } from 'react';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import OrganizationFormDialog from '@/components/company/OrganizationFormDialog';
import { TreeView, TreeDataItem } from '@/components/shadcn/treeView';
import { Department } from '@/types/company';

interface OrganizationTreePanelProps {
  departments: Department[];
  selectedDept: Department | null;
  onDeptSelect: (dept: Department) => void;
  onDeptUpdate: (formData: Department, editingDept: any) => void;
  onDeptDelete: (deptId: number) => void;
}

const OrganizationTreePanel: React.FC<OrganizationTreePanelProps> = ({
  departments,
  selectedDept,
  onDeptSelect,
  onDeptUpdate,
  onDeptDelete,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [addingChildToId, setAddingChildToId] = useState<number | null>(null);

  const handleAddChild = (parentId: number) => {
    setAddingChildToId(parentId);
    setEditingDept(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (dept: Department) => {
    setEditingDept(dept);
    setAddingChildToId(null);
    setIsDialogOpen(true);
  };

  const handleSave = (formData: Department) => {
    if (addingChildToId) {
      const newDept: Department = {
        department_id: Date.now(),
        department_name: formData.department_name,
        department_name_kr: formData.department_name_kr,
        parent_department_id: addingChildToId,
        department_level: 0,
        department_type: formData.department_type,
        department_desc: formData.department_desc,
        children_department: []
      };
      
      onDeptUpdate(newDept, { 
        department_id: addingChildToId, 
        isAddingChild: true 
      });
    } else if (editingDept) {
      onDeptUpdate(formData, editingDept);
    } else {
      const newDept: Department = {
        department_id: Date.now(),
        ...formData,
        parent_department_id: 0,
        department_level: 0,
        children_department: []
      };
      onDeptUpdate(newDept, null);
    }
    
    setIsDialogOpen(false);
    setEditingDept(null);
    setAddingChildToId(null);
  };

  const handleSelectChange = (item?: TreeDataItem) => {
    if (!item) return;
    const dept = findDeptById(departments, Number(item.id));
    if (dept) onDeptSelect(dept);
  };

  const mapDeptToTreeItem = (dept: Department): TreeDataItem => ({
    id: dept.department_id.toString(),
    name: dept.department_name_kr,
    icon: Building2,
    actions: (
      <div className="flex space-x-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={e => {
            e.stopPropagation();
            handleAddChild(dept.department_id);
          }}
          title="하위 부서 추가"
        >
          <Plus size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={e => {
            e.stopPropagation();
            handleEdit(dept);
          }}
          title="수정"
        >
          <Edit size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={e => {
            e.stopPropagation();
            onDeptDelete(dept.department_id);
          }}
          title="삭제"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    ),
    children: dept.children_department?.map(mapDeptToTreeItem),
    draggable: true,
    droppable: true,
  });

  const findDeptById = (depts: Department[], id: number): Department | null => {
    for (const dept of depts) {
      if (dept.department_id === id) return dept;
      if (dept.children_department) {
        const found = findDeptById(dept.children_department, id);
        if (found) return found;
      }
    }
    return null;
  };

  const treeData = departments.map(mapDeptToTreeItem);

  return (
    <div className="w-1/3 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">부서 관리</h2>
        <Button size="sm" onClick={() => {
          setEditingDept(null);
          setAddingChildToId(null);
          setIsDialogOpen(true);
        }}>
          <Plus size={16} className="mr-2" />
          부서 추가
        </Button>
      </div>

      {departments.length > 0 ? (
        <TreeView
          data={treeData}
          initialSelectedItemId={selectedDept?.department_id.toString()}
          onSelectChange={handleSelectChange}
          expandAll={false}
          className="bg-transparent"
        />
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Building2 size={48} className="mx-auto mb-2" />
          <p>부서가 없습니다</p>
          <Button onClick={() => {
            setEditingDept(null);
            setAddingChildToId(null);
            setIsDialogOpen(true);
          }} className="mt-2">
            <Plus size={16} className="mr-2" />
            첫 부서 추가하기
          </Button>
        </div>
      )}

      <OrganizationFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
        initialData={editingDept}
        isEditing={!!editingDept}
        isAddingChild={!!addingChildToId}
      />
    </div>
  );
};

export default OrganizationTreePanel;

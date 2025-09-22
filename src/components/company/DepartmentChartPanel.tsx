import { Tree, TreeNode } from 'react-organizational-chart';
import { Building2, Plus, Users } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { Department } from '@/types/company';

interface DepartmentChartPanelProps {
  departments: Department[];
  onAddClick: () => void;
}

export default function DepartmentChartPanel({ 
  departments, 
  onAddClick 
}: DepartmentChartPanelProps) {
  const StyledNode = ({ children, isRoot = false }) => (
    <div className={`
      p-3 
      bg-white 
      border-2 
      rounded-lg 
      shadow-sm 
      min-w-[120px] 
      text-center
      transition-all 
      duration-200
      hover:shadow-md 
      hover:-translate-y-1
      ${isRoot ? 'border-blue-500 bg-blue-50' : 'border-blue-200'}
    `}>
      {children}
    </div>
  );

  const renderNode = (node: Department) => (
    <TreeNode 
      key={node.department_id}
      label={
        <StyledNode>
          <div className="font-medium text-sm text-gray-900">{node.department_name_kr}</div>
          <div className="text-xs text-gray-600 mt-1">{node.department_type}</div>
        </StyledNode>
      }
    >
      {node.children_department?.map(renderNode)}
    </TreeNode>
  );

  const renderChart = (dept: Department) => {
    if (!dept) return null;

    return (
      <div className="flex justify-center items-center min-h-[400px] p-4">
        <Tree
          lineWidth="2px"
          lineColor="#3b82f6"
          lineBorderRadius="8px"
          nodePadding="8px"
          label={
            <StyledNode isRoot={true}>
              <div className="font-bold text-base text-gray-900">{dept.department_name_kr}</div>
              <div className="text-sm text-gray-600 mt-1">{dept.department_type}</div>
            </StyledNode>
          }
        >
          {dept.children_department?.map(renderNode)}
        </Tree>
      </div>
    );
  };

  const getTotalDeptCount = (depts: Department[]): number => {
    let count = 0;
    const countDepts = (deptList: Department[]) => {
      deptList.forEach(dept => {
        count++;
        if (dept.children_department && dept.children_department.length > 0) {
          countDepts(dept.children_department);
        }
      });
    };
    countDepts(depts);
    return count;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">조직도</h2>
        <div className="flex items-center space-x-2 h-8">
          <Users size={16} className="text-gray-600" />
          <span className="text-sm text-gray-600">
            전체 부서: {getTotalDeptCount(departments)}개
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="flex justify-center items-center h-full">
          {departments.length > 0 ? (
            <div className="org-chart-container">
              {renderChart(departments[0])}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">부서가 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { Building2, Plus, Users } from 'lucide-react';
import { Button } from '@/components/shadcn/button';

const OrganizationChartPanel = ({ organizations, onAddClick }) => {
  const StyledNode = ({ children, isRoot = false, isHidden = false }) => (
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
      ${isHidden ? 'opacity-50 border-gray-300' : ''}
    `}>
      {children}
    </div>
  );

  const renderNode = (node) => (
    <TreeNode 
      key={node.org_id}
      label={
        <StyledNode isHidden={node.is_hidden}>
          <div className="font-medium text-sm text-gray-900">{node.org_name}</div>
          <div className="text-xs text-gray-600 mt-1">{node.org_type}</div>
          {node.manager_name && (
            <div className="text-xs text-blue-600 mt-1">{node.manager_name}</div>
          )}
        </StyledNode>
      }
    >
      {node.children?.map(renderNode)}
    </TreeNode>
  );

  const renderOrgChart = (org) => {
    if (!org) return null;

    return (
      <div className="flex justify-center items-center min-h-[400px] p-4">
        <Tree
          lineWidth="2px"
          lineColor="#3b82f6"
          lineBorderRadius="8px"
          nodePadding="8px"
          label={
            <StyledNode isRoot={true}>
              <div className="font-bold text-base text-gray-900">{org.org_name}</div>
              <div className="text-sm text-gray-600 mt-1">{org.org_type}</div>
              {org.manager_name && (
                <div className="text-sm text-blue-600 mt-1">{org.manager_name}</div>
              )}
            </StyledNode>
          }
        >
          {org.children?.map(renderNode)}
        </Tree>
      </div>
    );
  };

  const getTotalOrgCount = (orgs) => {
    let count = 0;
    const countOrgs = (orgList) => {
      orgList.forEach(org => {
        count++;
        if (org.children && org.children.length > 0) {
          countOrgs(org.children);
        }
      });
    };
    countOrgs(orgs);
    return count;
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">조직도</h2>
        <div className="flex items-center space-x-2">
          <Users size={16} className="text-gray-600" />
          <span className="text-sm text-gray-600">
            전체 조직: {getTotalOrgCount(organizations)}개
          </span>
        </div>
      </div>

      <div className="flex justify-center">
        {organizations.length > 0 ? (
          <div className="org-chart-container">
            {renderOrgChart(organizations[0])}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">조직이 없습니다</p>
            <Button onClick={onAddClick}>
              <Plus size={16} className="mr-2" />
              첫 조직 추가하기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationChartPanel;

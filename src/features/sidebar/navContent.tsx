import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { TreeView, TreeDataItem } from '@/components/shadcn/treeView';
import {
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/shadcn/sidebar';
import { cn } from "@/lib/utils";

interface NavContentProps {
  treeData: TreeDataItem[];
  routeMapping: Record<string, string>;
  pathToIdMapping: Record<string, string>;
}

function addClickHandlers(
  items: TreeDataItem[], 
  navigate: (path: string) => void, 
  routeMapping: Record<string, string>
): TreeDataItem[] {
  return items.map(item => ({
    ...item,
    onClick: item.children ? undefined : () => {
      const route = routeMapping[item.id];
      if (route) {
        navigate(route);
      }
    },
    children: item.children ? addClickHandlers(item.children, navigate, routeMapping) : undefined,
  }));
}

export function NavContent({ treeData, routeMapping, pathToIdMapping }: NavContentProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItemId, setSelectedItemId] = useState<string>('');

  // 현재 경로에 따라 선택된 아이템 설정
  useEffect(() => {
    const currentId = pathToIdMapping[location.pathname];
    if (currentId) {
      setSelectedItemId(currentId);
    }
  }, [location.pathname, pathToIdMapping]);

  // 클릭 핸들러가 추가된 트리 데이터
  const enhancedTreeData = addClickHandlers(treeData, navigate, routeMapping);

  const handleSelectChange = (item: TreeDataItem | undefined) => {
    if (item && !item.children) {
      const route = routeMapping[item.id];
      if (route) {
        navigate(route);
      }
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <TreeView
        data={enhancedTreeData}
        initialSelectedItemId={selectedItemId}
        onSelectChange={handleSelectChange}
        expandAll={false}
        className={cn('p-0 w-full')}
      />
    </SidebarGroup>
  );
}

import { useState } from "react";
import { Button } from "@/components/shadcn/button";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/shadcn/command";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/shadcn/resizable";
import { Switch } from "@/components/shadcn/switch";
import { Table, Header, HeaderRow, Body, Row, HeaderCell, Cell } from '@table-library/react-table-library/table';
import { useTheme } from '@table-library/react-table-library/theme';
import { useTree, TreeExpandClickTypes, ITreeState } from '@table-library/react-table-library/tree';
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
}

interface PagePermissions {
  admin: boolean;
  read: boolean;
  write: boolean;
  delete: boolean;
}

interface UserPermissions {
  [pageUrl: string]: PagePermissions;
}

interface AllPermissions {
  [userId: string]: UserPermissions;
}

interface TreeNode {
    id: string;
    title: string;
    url: string;
    nodes?: TreeNode[];
}

const navDatas = [
    {
        title: 'Home',
        url: '/',
        items: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Calendar', url: '/calendar' }
        ],
    },
    {
        title: 'Work',
        url: '/work',
        items: [
            { title: 'Report', url: '/work/report' },
        ],
    },
    {
        title: 'Culture',
        url: '/culture',
        items: [
            { title: 'Dues', url: '/culture/dues' },
            { title: 'Rule', url: '/culture/rule' },
        ],
    },
    {
        title: 'Admin',
        url: '/admin',
        items: [
            { title: 'User', url: '/admin/user' },
            { title: 'Company', url: '/admin/company' },
            { title: 'Vacation', url: '/admin/vacation' },
            { title: 'Authority', url: '/admin/authority' },
            { title: 'Holiday', url: '/admin/holiday' },
        ],
    },
];

const transformToTreeData = (navs: typeof navDatas): TreeNode[] => {
    return navs.map(nav => ({
        id: nav.url,
        title: nav.title,
        url: nav.url,
        nodes: nav.items ? nav.items.map(item => ({ id: item.url, title: item.title, url: item.url, nodes: [] })) : [],
    }));
}

const treeData = transformToTreeData(navDatas);

const mockUsers: User[] = [
  { id: "user-1", name: "유저 A (Admin)", email: "admin@example.com" },
  { id: "user-2", name: "유저 B (Normal)", email: "user.b@example.com" },
  { id: "user-3", name: "유저 C (Read-only)", email: "user.c@example.com" },
];

const getAllPageUrls = (nodes: TreeNode[]) => {
    const urls: {title: string, url: string}[] = [];
    nodes.forEach(node => {
        urls.push({title: node.title, url: node.url});
        if (node.nodes) {
            urls.push(...getAllPageUrls(node.nodes));
        }
    });
    return urls;
}

const allPages = getAllPageUrls(treeData);

const initialPermissions: AllPermissions = {};
mockUsers.forEach(user => {
  initialPermissions[user.id] = {};
  allPages.forEach(page => {
    const isAdmin = user.name.includes("Admin");
    const isNormal = user.name.includes("Normal");

    let permissions: PagePermissions = { admin: false, read: false, write: false, delete: false };

    if (isAdmin) {
      permissions = { admin: true, read: true, write: true, delete: true };
    } else if (isNormal) {
      if (!page.url.startsWith('/admin')) {
        permissions = { admin: false, read: true, write: true, delete: false };
      }
    } else { // Read-only user
        permissions = { admin: false, read: true, write: false, delete: false };
    }
    initialPermissions[user.id][page.url] = permissions;
  });
});

export default function Authority() {
  const [permissions, setPermissions] = useState<AllPermissions>(initialPermissions);
  const [selectedUser, setSelectedUser] = useState<User | null>(mockUsers[0]);
  const [treeState, setTreeState] = useState<ITreeState>({ ids: treeData.map(n => n.id) });

  const handleTreeChange = (action: any, state: ITreeState) => {
    setTreeState(state);
  };

  const tree = useTree({ nodes: treeData }, {
      state: treeState,
      onChange: handleTreeChange,
  }, {
      treeExpandClickType: TreeExpandClickTypes.RowClick,
  });

  const handlePermissionChange = (userId: string, pageUrl: string, key: keyof PagePermissions, value: boolean) => {
    setPermissions(prev => {
      const newPermissions = { ...prev };
      const userPermissions = { ...newPermissions[userId] };
      const pagePermissions = { ...userPermissions[pageUrl] };

      pagePermissions[key] = value;

      if (key === 'admin') {
        pagePermissions.read = value;
        pagePermissions.write = value;
        pagePermissions.delete = value;
      }
      else if (!value) {
        pagePermissions.admin = false;
      }

      userPermissions[pageUrl] = pagePermissions;
      newPermissions[userId] = userPermissions;
      return newPermissions;
    });
  };

  const handleSave = () => {
    console.log("Saving permissions:", JSON.stringify(permissions, null, 2));
  };

  const theme = useTheme({
      Table: `
        --data-table-library_grid-template-columns: minmax(250px, 1fr) repeat(4, 100px) !important;
      `
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">권한 관리</h1>
            <Button onClick={handleSave}>저장</Button>
        </div>
        <ResizablePanelGroup direction="horizontal" className="flex-grow rounded-lg border">
            <ResizablePanel defaultSize={25}>
                <Command className="h-full">
                    <CommandInput placeholder="사용자 검색..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Users">
                            {mockUsers.map((user) => (
                                <CommandItem key={user.id} onSelect={() => setSelectedUser(user)}>
                                    {user.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={75}>
                <div className="flex flex-col h-full p-4">
                    {selectedUser ? (
                        <>
                            <h2 className="text-2xl font-bold mb-4">{selectedUser.name}님의 권한</h2>
                            <Table className="w-full !h-auto border overflow-hidden rounded-lg" data={{nodes: treeData}} theme={theme} tree={tree}>
                                {(tableList: TreeNode[]) => (
                                    <>
                                        <Header>
                                            <HeaderRow className='!bg-muted !text-foreground [&_th]:!p-2 [&_th]:!text-sm [&_th]:!h-10 [&_th]:!font-medium'>
                                                <HeaderCell>페이지</HeaderCell>
                                                <HeaderCell><div className="flex justify-center">Admin</div></HeaderCell>
                                                <HeaderCell><div className="flex justify-center">Read</div></HeaderCell>
                                                <HeaderCell><div className="flex justify-center">Write</div></HeaderCell>
                                                <HeaderCell><div className="flex justify-center">Delete</div></HeaderCell>
                                            </HeaderRow>
                                        </Header>
                                        <Body>
                                            {tableList.map((item, i) => {
                                                const perms = permissions[selectedUser.id]?.[item.url];
                                                if (!perms) return null;
                                                return (
                                                    <Row 
                                                        key={item.id} 
                                                        item={item}
                                                        className={cn(
                                                            'hover:!bg-muted/50 !bg-background !text-foreground [&_td]:!p-2 [&_td]:!text-sm',
                                                            i !== tableList.length - 1 ? '[&_td]:!border-b' : '[&_td]:!border-b-0'
                                                        )}
                                                    >
                                                        <Cell style={{ paddingLeft: `${item.treeXLevel * 20}px` }}>
                                                            <div className="flex items-center">
                                                                {item.nodes && item.nodes.length > 0 && (
                                                                    tree.state.ids.includes(item.id) ? <ChevronDown className="w-4 h-4 mr-2"/> : <ChevronRight className="w-4 h-4 mr-2"/>
                                                                )}
                                                                {item.title}
                                                            </div>
                                                        </Cell>
                                                        {(["admin", "read", "write", "delete"] as const).map(permKey => (
                                                            <Cell key={permKey}>
                                                                <div className="flex items-center justify-center w-full h-full">
                                                                    <Switch
                                                                        checked={perms[permKey]}
                                                                        onCheckedChange={(value) => handlePermissionChange(selectedUser.id, item.url, permKey, value)}
                                                                        disabled={permKey !== 'admin' && perms.admin}
                                                                    />
                                                                </div>
                                                            </Cell>
                                                        ))}
                                                    </Row>
                                                )
                                            })}
                                        </Body>
                                    </>
                                )}
                            </Table>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p>왼쪽 목록에서 사용자를 선택해주세요.</p>
                        </div>
                    )}
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>
  );
}
import { useEffect, useState, useMemo } from 'react';
import { useGetUsers, usePostUser, usePutUser, useDeleteUser } from '@/api/user';
import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell
} from '@table-library/react-table-library/table';
import { useTheme } from "@table-library/react-table-library/theme";
import { Button } from '@/components/shadcn/button';
import { Badge } from "@/components/shadcn/badge"
import { Avatar, AvatarFallback } from '@/components/shadcn/avatar';
import { Input } from '@/components/shadcn/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/shadcn/dropdownMenu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/shadcn/card";
import UserSkeleton from '@/features/user/UserSkeleton';
import { UserRoundCog, UserRound, EllipsisVertical, Users, UserCheck, UserX } from 'lucide-react';
import { Empty } from 'antd';
import { cn } from '@/lib/utils';

interface UserData {
  user_id: string;
  user_name: string;
  user_email: string;
  user_birth: string;
  user_employ: string;
  lunar_yn: string;
  user_work_time: string;
  user_role: 'ADMIN' | 'USER';
}

type EditableUserData = UserData & { isNew?: boolean; tempId?: string };

interface ModifiedData {
  created: EditableUserData[];
  updated: UserData[];
  deleted: string[];
}

export default function User() {
  const {data: users, isLoading: usersLoading} = useGetUsers();
  const { mutate: postUser } = usePostUser();
  const { mutate: putUser } = usePutUser();
  const { mutate: deleteUser } = useDeleteUser();
  const [tableData, setTableData] = useState<EditableUserData[]>([]);
  const [modifiedData, setModifiedData] = useState<ModifiedData>({
    created: [],
    updated: [],
    deleted: [],
  });
  const [editingRow, setEditingRow] = useState<string | null>(null);

  const employOptions = ['SK AX', 'DTOL', '인사이트온', '씨앤토트플러스', 'BigxData'];
  const lunarOptions = ['Y', 'N'];
  const workTimeOptions = [
    { value: '8 ~ 5', className: 'text-rose-500 dark:text-rose-400' },
    { value: '9 ~ 6', className: 'text-sky-500 dark:text-sky-400' },
    { value: '10 ~ 7', className: 'text-emerald-500 dark:text-emerald-400' }
  ];
  const roleOptions = [
    { value: 'ADMIN', className: 'text-rose-500 dark:text-rose-400' },
    { value: 'USER', className: 'text-sky-500 dark:text-sky-400' }
  ];

  useEffect(() => {
    if (users) {
      const formattedUsers = users.map((user: any) => ({
        ...user,
      }));
      setTableData(formattedUsers);
    }
  }, [users]);

  const theme = useTheme([{
    Table: `--data-table-library_grid-template-columns: minmax(120px, 11%) minmax(100px, 11%) minmax(200px, 18%) minmax(150px, 14%) minmax(120px, 11%) minmax(90px, 10%) minmax(100px, 11%) minmax(100px, 11%) minmax(60px, 4%) !important;`,
  }]);

  const handleDelete = (id: string) => {
    if (!tableData) return;
    const rowToDelete = tableData.find(row => (row.isNew ? row.tempId : row.user_id) === id);
    if (!rowToDelete) return;

    if (rowToDelete.isNew) {
      setModifiedData({
        ...modifiedData,
        created: modifiedData.created.filter((user) => user.tempId !== id),
      });
    } else {
      setModifiedData({
        ...modifiedData,
        updated: modifiedData.updated.filter((user) => user.user_id !== id),
        deleted: [...modifiedData.deleted, id],
      });
    }

    setTableData(tableData.filter((user) => (user.isNew ? user.tempId : user.user_id) !== id));
  };

  const handleCopy = (row: EditableUserData) => {
    if (!tableData) return;
    const tempId = `new_${Date.now()}`;
    const newRow: EditableUserData = {
      ...row,
      user_id: '',
      isNew: true,
      tempId: tempId,
    };
    setTableData([...tableData, newRow]);
    setModifiedData({
      ...modifiedData,
      created: [...modifiedData.created, newRow],
    });
    setEditingRow(tempId);
  };

  const handleAdd = () => {
    if (!tableData) return;
    const tempId = `new_${Date.now()}`;
    const newRow: EditableUserData = {
      user_id: '',
      user_name: '',
      user_email: '',
      user_birth: '',
      user_employ: employOptions[0],
      lunar_yn: 'N',
      user_work_time: workTimeOptions[1].value,
      user_role: 'USER',
      isNew: true,
      tempId: tempId,
    };

    setTableData([...tableData, newRow]);
    setModifiedData({
      ...modifiedData,
      created: [...modifiedData.created, newRow],
    });
    setEditingRow(tempId);
  };

  const handleEdit = (id: string) => {
    setEditingRow(id);
  };

  const handleSave = () => {
    modifiedData.created.forEach(user => {
      const { isNew, tempId, ...userData } = user;
      postUser({...userData, user_pwd: ''});
    });

    modifiedData.updated.forEach(user => {
      putUser({...user});
    });

    modifiedData.deleted.forEach(user_id => {
      deleteUser(user_id);
    });

    setModifiedData({ created: [], updated: [], deleted: [] });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string, field: keyof UserData) => {
    if (!tableData) return;
    const newData = tableData.map((row) => {
      if ((row.isNew ? row.tempId : row.user_id) === id) {
        return { ...row, [field]: e.target.value };
      }
      return row;
    });
    setTableData(newData);

    const updatedUser = newData.find(user => (user.isNew ? user.tempId : user.user_id) === id);
    if (!updatedUser) return;

    if (updatedUser.isNew) {
      setModifiedData({
        ...modifiedData,
        created: modifiedData.created.map((user) =>
          user.tempId === id ? updatedUser : user
        ),
      });
    } else if (!modifiedData.updated.find((user) => user.user_id === id)) {
      setModifiedData({
        ...modifiedData,
        updated: [...modifiedData.updated, updatedUser],
      });
    } else {
      setModifiedData({
        ...modifiedData,
        updated: modifiedData.updated.map((user) =>
          user.user_id === id ? updatedUser : user
        ),
      });
    }
  };

  const handleSelectChange = (value: string, id: string, field: keyof UserData) => {
    if (!tableData) return;
    const newData = tableData.map((row) => {
      if ((row.isNew ? row.tempId : row.user_id) === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setTableData(newData);

    const updatedUser = newData.find(user => (user.isNew ? user.tempId : user.user_id) === id);
    if (!updatedUser) return;

    if (updatedUser.isNew) {
      setModifiedData({
        ...modifiedData,
        created: modifiedData.created.map((user) =>
          user.tempId === id ? updatedUser : user
        ),
      });
    } else if (!modifiedData.updated.find((user) => user.user_id === id)) {
      setModifiedData({
        ...modifiedData,
        updated: [...modifiedData.updated, updatedUser],
      });
    } else {
      setModifiedData({
        ...modifiedData,
        updated: modifiedData.updated.map((user) =>
          user.user_id === id ? updatedUser : user
        ),
      });
    }
  };

  if (usersLoading) {
    return <UserSkeleton />
  }

  return (
    <div className='p-4 sm:p-6 md:p-8'>
      <h1 className='text-3xl font-bold mb-6'>사용자 관리 대시보드</h1>

      {/* Summary Cards Section */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>총 사용자</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{10}</div>
            <p className='text-xs text-muted-foreground'>등록된 모든 사용자</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>관리자</CardTitle>
            <UserRoundCog className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{1}</div>
            <p className='text-xs text-muted-foreground'>관리자 권한 사용자</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>일반 사용자</CardTitle>
            <UserRound className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{9}</div>
            <p className='text-xs text-muted-foreground'>일반 사용자 권한</p>
          </CardContent>
        </Card>
      </div>

      {/* User List Table Section */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>사용자 목록</CardTitle>
          <div className='flex gap-2'>
            <Button className='text-sm h-8' variant='outline' onClick={handleAdd}>추가</Button>
            <Button className='text-sm h-8' variant='outline' onClick={handleSave}>저장</Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Input (Placeholder for future implementation) */}
          {/* <Input placeholder="Search users..." className="mb-4" /> */}

          {tableData && tableData.length > 0 ? (
            <div className='w-full overflow-auto'>
              <Table
                theme={theme}
                className='w-full !h-auto border overflow-hidden rounded-lg'
                data={{nodes: tableData}}
                layout={{ fixedHeader: true }}
              >
                {(tableList: EditableUserData[]) => (
                  <>
                    <Header>
                      <HeaderRow className='!bg-muted !text-foreground [&_th]:!p-2 [&_th]:!text-sm [&_th]:!h-10 [&_th]:!font-medium [&_div]:!pl-2'>
                        <HeaderCell>이름</HeaderCell>
                        <HeaderCell>ID</HeaderCell>
                        <HeaderCell>Email</HeaderCell>
                        <HeaderCell>생년월일</HeaderCell>
                        <HeaderCell>소속</HeaderCell>
                        <HeaderCell>음력여부</HeaderCell>
                        <HeaderCell>유연근무제</HeaderCell>
                        <HeaderCell>권한</HeaderCell>
                        <HeaderCell></HeaderCell>
                      </HeaderRow>
                    </Header>
                    <Body>
                      {tableList.map((row: EditableUserData, i: number) => {
                        const id = row.isNew ? row.tempId! : row.user_id;
                        const isEditing = editingRow === id;
                        return (
                          <Row
                            item={row}
                            className={cn(
                              'hover:!bg-muted/50 !bg-background !text-foreground [&_td]:!p-2 [&_td]:!text-sm [&_td>div]:!py-1 [&_td>div]:!pl-2',
                              i !== tableData?.length-1 ? '[&_td]:!border-b' : '[&_td]:!border-b-0'
                            )}
                            key={id}
                          >
                            <Cell>
                              {isEditing ? (
                                <Input
                                  value={row.user_name}
                                  onChange={(e) => handleInputChange(e, id, 'user_name')}
                                />
                              ) : (
                                <div className='flex flex-row items-center'>
                                  <Avatar className='h-8 w-8 mr-1.5'>
                                    <AvatarFallback>
                                      <UserRound className='w-5 h-5' />
                                    </AvatarFallback>
                                  </Avatar>
                                  {row.user_name}
                                </div>
                              )}
                            </Cell>
                            <Cell>
                              {isEditing ? (
                                <Input
                                  value={row.user_id}
                                  onChange={(e) => handleInputChange(e, id, 'user_id')}
                                  disabled={!row.isNew}
                                  placeholder="Enter new ID"
                                />
                              ) : (
                                row.user_id
                              )}
                            </Cell>
                            <Cell>
                              {isEditing ? (
                                <Input
                                  value={row.user_email}
                                  onChange={(e) => handleInputChange(e, id, 'user_email')}
                                />
                              ) : (
                                row.user_email
                              )}
                            </Cell>
                            <Cell>
                              {isEditing ? (
                                <Input
                                  value={row.user_birth}
                                  onChange={(e) => handleInputChange(e, id, 'user_birth')}
                                />
                              ) : (
                                row.user_birth && `${row.user_birth.substr(0, 4)}년 ${row.user_birth.substr(4, 2)}월 ${row.user_birth.substr(6, 2)}일`
                              )}
                            </Cell>
                            <Cell>
                              {isEditing ? (
                                <Select
                                  value={row.user_employ}
                                  onValueChange={(value) => handleSelectChange(value, id, 'user_employ')}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="소속 선택" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {employOptions.map(option => (
                                      <SelectItem key={option} value={option}>{option}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                row.user_employ
                              )}
                            </Cell>
                            <Cell>
                              {isEditing ? (
                                <Select
                                  value={row.lunar_yn}
                                  onValueChange={(value) => handleSelectChange(value, id, 'lunar_yn')}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="음력 여부" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {lunarOptions.map(option => (
                                      <SelectItem key={option} value={option}>{option}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                row.lunar_yn
                              )}
                            </Cell>
                            <Cell>
                              {isEditing ? (
                                <Select
                                  value={row.user_work_time}
                                  onValueChange={(value) => handleSelectChange(value, id, 'user_work_time')}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="유연근무제" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {workTimeOptions.map(option => (
                                      <SelectItem key={option.value} value={option.value} className={option.className}>
                                        {option.value}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Badge className={cn(
                                  {
                                    'bg-rose-500 dark:bg-rose-400': row.user_work_time === '8 ~ 5',
                                    'bg-sky-500 dark:bg-sky-400': row.user_work_time === '9 ~ 6',
                                    'bg-emerald-500 dark:bg-emerald-400': row.user_work_time === '10 ~ 7'
                                  }
                                )}>{row.user_work_time}</Badge>
                              )}
                            </Cell>
                            <Cell>
                              {isEditing ? (
                                <Select
                                  value={row.user_role}
                                  onValueChange={(value) => handleSelectChange(value, id, 'user_role')}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="권한" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {roleOptions.map(option => (
                                      <SelectItem key={option.value} value={option.value} className={option.className}>
                                        {option.value}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <div className={cn(
                                  'flex flex-row items-center text-sm gap-1',
                                  {
                                    'text-rose-500 dark:text-rose-400': row.user_role === 'ADMIN',
                                    'text-sky-500 dark:text-sky-400': row.user_role === 'USER'
                                  }
                                )}>
                                  {row.user_role === 'ADMIN' ? <UserRoundCog size={14}/> : <UserRound size={14}/>}{row.user_role}
                                </div>
                              )}
                            </Cell>
                            <Cell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                                    size="icon"
                                  >
                                    <EllipsisVertical />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-32">
                                  {isEditing ? (
                                    <DropdownMenuItem onClick={() => setEditingRow(null)}>저장</DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={() => handleEdit(id)}>수정</DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() => handleCopy(row)}
                                  >
                                    복사
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive hover:!bg-destructive/20"
                                    onClick={() => handleDelete(id)}
                                  >
                                    삭제
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </Cell>
                          </Row>
                        )
                      })}
                    </Body>
                  </>
                )}
              </Table>
            </div>
          ) : (
            <Empty />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
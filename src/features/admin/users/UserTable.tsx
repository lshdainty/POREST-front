import { GetUsersResp, usePostUser, usePutUser, useDeleteUser } from '@/api/user';
import { useTheme } from '@table-library/react-table-library/theme';
import { Table, Header, HeaderRow, Body, Row, HeaderCell, Cell } from '@table-library/react-table-library/table';
import UserEditDialog from '@/features/admin/users/UserEditDialog';
import UserDeleteDialog from '@/features/admin/users/UserDeleteDialog';
import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { Avatar, AvatarFallback } from '@/components/shadcn/avatar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shadcn/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/shadcn/dropdownMenu';
import { UserRoundCog, UserRound, EllipsisVertical, Pencil, Copy, Trash2 } from 'lucide-react';
import { Empty } from 'antd';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { companyOptions, departmentOptions } from '@/lib/constants';

interface UserTableProps {
  value: GetUsersResp[];
}

export default function UserTable({ value: users }: UserTableProps) {
  const { mutate: postUser } = usePostUser();
  const { mutate: putUser } = usePutUser();
  const { mutate: deleteUser } = useDeleteUser();

  const theme = useTheme([{
    Table: `--data-table-library_grid-template-columns: minmax(120px, 11%) minmax(100px, 11%) minmax(200px, 18%) minmax(150px, 14%) minmax(120px, 11%) minmax(120px, 11%) minmax(90px, 10%) minmax(100px, 11%) minmax(100px, 11%) minmax(60px, 4%) !important;`,
  }]);

  const handleCreateUser = (user: GetUsersResp) => {
    postUser({
      user_id: user.user_id,
      user_name: user.user_name,
      user_email: user.user_email,
      user_birth: dayjs(user.user_birth).format('YYYYMMDD'),
      user_company_type: user.user_company_type,
      user_department_type: user.user_department_type,
      user_work_time: user.user_work_time,
      lunar_yn: user.lunar_yn
    });
  };

  const handleUpdateUser = (user: GetUsersResp) => {
    putUser({
      user_id: user.user_id,
      user_name: user.user_name,
      user_email: user.user_email,
      user_birth: dayjs(user.user_birth).format('YYYYMMDD'),
      user_company_type: user.user_company_type,
      user_department_type: user.user_department_type,
      user_work_time: user.user_work_time,
      lunar_yn: user.lunar_yn
    });
  };

  const handleDeleteUser = (id: string) => {
    deleteUser(id);
  };

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>사용자 목록</CardTitle>
        <div className='flex gap-2'>
          <UserEditDialog
            user={{
                user_id: '',
                user_name: '',
                user_email: '',
                user_birth: dayjs().format('YYYY-MM-DD'),
                user_company_name: companyOptions[0].company_name,
                user_company_type: companyOptions[0].company_type,
                user_department_name: departmentOptions[0].department_name,
                user_department_type: departmentOptions[0].department_type,
                lunar_yn: 'N',
                user_work_time: '9 ~ 6',
                user_role_type: 'USER',
            }}
            onSave={handleCreateUser}
            trigger={<Button className='text-sm h-8' size='sm'>추가</Button>}
          />
        </div>
      </CardHeader>
      <CardContent>
        {users && users.length > 0 ? (
          <div className='w-full overflow-auto'>
            <Table
              theme={theme}
              className='w-full !h-auto border overflow-hidden rounded-lg'
              data={{nodes: users}}
              layout={{ fixedHeader: true }}
            >
              {(tableList: GetUsersResp[]) => (
                <>
                  <Header>
                    <HeaderRow className='!bg-muted !text-foreground [&_th]:!p-2 [&_th]:!text-sm [&_th]:!h-10 [&_th]:!font-medium [&_div]:!pl-2'>
                      <HeaderCell>이름</HeaderCell>
                      <HeaderCell>ID</HeaderCell>
                      <HeaderCell>Email</HeaderCell>
                      <HeaderCell>생년월일</HeaderCell>
                      <HeaderCell>회사</HeaderCell>
                      <HeaderCell>부서</HeaderCell>
                      <HeaderCell>음력여부</HeaderCell>
                      <HeaderCell>유연근무제</HeaderCell>
                      <HeaderCell>권한</HeaderCell>
                      <HeaderCell></HeaderCell>
                    </HeaderRow>
                  </Header>
                  <Body>
                    {tableList.map((row: GetUsersResp, i: number) => (
                      <Row
                        item={row}
                        className={cn(
                          'hover:!bg-muted/50 !bg-background !text-foreground [&_td]:!p-2 [&_td]:!text-sm [&_td>div]:!py-1 [&_td>div]:!pl-2',
                          i !== users?.length-1 ? '[&_td]:!border-b' : '[&_td]:!border-b-0'
                        )}
                        key={row.user_id}
                      >
                        <Cell>
                          <div className='flex flex-row items-center'>
                            <Avatar className='h-8 w-8 mr-1.5'>
                              <AvatarFallback>
                                <UserRound className='w-5 h-5' />
                              </AvatarFallback>
                            </Avatar>
                            {row.user_name}
                          </div>
                        </Cell>
                        <Cell>{row.user_id}</Cell>
                        <Cell>{row.user_email}</Cell>
                        <Cell>{row.user_birth && `${row.user_birth.substr(0, 4)}년 ${row.user_birth.substr(4, 2)}월 ${row.user_birth.substr(6, 2)}일`}</Cell>
                        <Cell>{row.user_company_name}</Cell>
                        <Cell>{row.user_department_name}</Cell>
                        <Cell>{row.lunar_yn}</Cell>
                        <Cell>
                          <Badge className={cn(
                            {
                              'bg-rose-500 dark:bg-rose-400': row.user_work_time === '8 ~ 5',
                              'bg-sky-500 dark:bg-sky-400': row.user_work_time === '9 ~ 6',
                              'bg-emerald-500 dark:bg-emerald-400': row.user_work_time === '10 ~ 7'
                            }
                          )}>{row.user_work_time}</Badge>
                        </Cell>
                        <Cell>
                          <div className={cn(
                            'flex flex-row items-center text-sm gap-1',
                            {
                              'text-rose-500 dark:text-rose-400': row.user_role_type === 'ADMIN',
                              'text-sky-500 dark:text-sky-400': row.user_role_type === 'USER'
                            }
                          )}>{row.user_role_type === 'ADMIN' ? <UserRoundCog size={14}/> : <UserRound size={14}/>}{row.user_role_type}
                          </div>
                        </Cell>
                        <Cell>
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant='ghost'
                                className='data-[state=open]:bg-muted text-muted-foreground flex size-8'
                                size='icon'
                              >
                                <EllipsisVertical />
                                <span className='sr-only'>Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='w-32'>
                              <UserEditDialog
                                user={row}
                                onSave={handleUpdateUser}
                                trigger={
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Pencil className="h-4 w-4" />
                                    <span>수정</span>
                                  </DropdownMenuItem>
                                }
                              />
                              <UserEditDialog
                                user={{...row, user_id: ''}}
                                onSave={handleCreateUser}
                                trigger={
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Copy className="h-4 w-4" />
                                    <span>복사</span>
                                  </DropdownMenuItem>
                                }
                              />
                              <DropdownMenuSeparator />
                              <UserDeleteDialog
                                user={row}
                                onDelete={handleDeleteUser}
                                trigger={
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className='text-destructive focus:text-destructive hover:!bg-destructive/20'
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span>삭제</span>
                                  </DropdownMenuItem>
                                }
                              />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </Cell>
                      </Row>
                    ))}
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
  )
}
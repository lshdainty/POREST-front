import UserEditDialog from '@/components/user/UserEditDialog';
import UserDeleteDialog from '@/components/user/UserDeleteDialog';
import { GetUsersResp, usePostUser, usePutUser, useDeleteUser } from '@/api/user';
import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { Avatar, AvatarFallback } from '@/components/shadcn/avatar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shadcn/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/shadcn/dropdownMenu';
import { UserRoundCog, UserRound, EllipsisVertical, Pencil, Copy, Trash2, Sun, Moon } from 'lucide-react';
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
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='min-w-[120px]'>이름</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className='min-w-[200px]'>Email</TableHead>
                  <TableHead className='min-w-[150px]'>생년월일</TableHead>
                  <TableHead>회사</TableHead>
                  <TableHead>부서</TableHead>
                  <TableHead>음력여부</TableHead>
                  <TableHead>유연근무제</TableHead>
                  <TableHead>권한</TableHead>
                  <TableHead>액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((row: GetUsersResp) => (
                  <TableRow key={row.user_id} className='hover:bg-gray-50'>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <Avatar className='w-8 h-8'>
                          <AvatarFallback>
                            {row.user_role_type === 'ADMIN' ? 
                              <UserRoundCog className='w-5 h-5' /> : 
                              <UserRound className='w-5 h-5' />
                            }
                          </AvatarFallback>
                        </Avatar>
                        <span className='font-medium'>{row.user_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{row.user_id}</TableCell>
                    <TableCell>{row.user_email}</TableCell>
                    <TableCell>
                      {row.user_birth && `${row.user_birth.substr(0, 4)}년 ${row.user_birth.substr(4, 2)}월 ${row.user_birth.substr(6, 2)}일`}
                    </TableCell>
                    <TableCell>
                      <span className='text-sm'>{row.user_company_name}</span>
                    </TableCell>
                    <TableCell>
                      <span className='text-sm'>{row.user_department_name}</span>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1'>
                        {row.lunar_yn === 'Y' ? 
                          <Moon className='w-4 h-4 text-blue-600' /> : 
                          <Sun className='w-4 h-4 text-yellow-600' />
                        }
                        <Badge className={cn(
                          row.lunar_yn === 'Y' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                        )}>
                          {row.lunar_yn === 'Y' ? '음력' : '양력'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        {
                          'bg-rose-500 text-white': row.user_work_time === '8 ~ 5',
                          'bg-sky-500 text-white': row.user_work_time === '9 ~ 6',
                          'bg-emerald-500 text-white': row.user_work_time === '10 ~ 7'
                        }
                      )}>
                        {row.user_work_time}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={cn(
                        'flex items-center gap-1 text-sm font-semibold',
                        {
                          'text-rose-500': row.user_role_type === 'ADMIN',
                          'text-sky-500': row.user_role_type === 'USER'
                        }
                      )}>
                        {row.user_role_type === 'ADMIN' ? 
                          <UserRoundCog size={14}/> : 
                          <UserRound size={14}/>
                        }
                        {row.user_role_type}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 w-8 p-0 data-[state=open]:bg-muted hover:bg-muted'
                          >
                            <EllipsisVertical className='w-4 h-4' />
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Empty />
        )}
      </CardContent>
    </Card>
  )
}

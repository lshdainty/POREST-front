import UserEditDialog from '@/components/user/UserEditDialog';
import UserDeleteDialog from '@/components/user/UserDeleteDialog';
import { usePostUser, usePutUser, useDeleteUser, type GetUsersResp, type PostUserReq, type PutUserReq } from '@/api/user';
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

  const handleCreateUser = (user: PostUserReq) => {
    postUser({
      user_id: user.user_id,
      user_name: user.user_name,
      user_email: user.user_email,
      user_birth: dayjs(user.user_birth).format('YYYYMMDD'),
      user_company_type: user.user_company_type,
      user_department_type: user.user_department_type,
      user_work_time: user.user_work_time,
      lunar_yn: user.lunar_yn,
      profile_url: user.profile_url,
      profile_uuid: user.profile_uuid
    });
  };

  const handleUpdateUser = (user: PutUserReq) => {
    putUser({
      user_id: user.user_id,
      user_name: user.user_name,
      user_email: user.user_email,
      user_birth: dayjs(user.user_birth).format('YYYYMMDD'),
      user_company_type: user.user_company_type,
      user_department_type: user.user_department_type,
      user_work_time: user.user_work_time,
      lunar_yn: user.lunar_yn,
      profile_url: user.profile_url,
      profile_uuid: user.profile_uuid
    });
  };

  const handleDeleteUser = (id: string) => {
    deleteUser(id);
  };

  return (
    <Card className='flex-1'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>사용자 목록</CardTitle>
          <div className='flex gap-2'>
            <UserEditDialog
              title='사용자 추가'
              user={{
                user_id: '', user_name: '', user_email: '', user_birth: '',
                user_company_name: '', user_company_type: '', user_department_name: '',
                user_department_type: '', lunar_yn: '', user_work_time: '',
                user_role_type: 'USER', profile_url: ''
              }}
              onSave={handleCreateUser}
              trigger={<Button className='text-sm h-8' size='sm'>추가</Button>}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {users && users.length > 0 ? (
          <div className='overflow-x-auto relative'>
            <Table className='min-w-[1200px]'>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className={cn(
                      'min-w-[180px] w-[180px] pl-4',
                      'sticky left-0 z-5 bg-card'
                    )}
                  >
                    이름
                  </TableHead>
                  <TableHead className='min-w-[120px]'>ID</TableHead>
                  <TableHead className='min-w-[220px]'>Email</TableHead>
                  <TableHead className='min-w-[150px]'>생년월일</TableHead>
                  <TableHead className='min-w-[120px]'>회사</TableHead>
                  <TableHead className='min-w-[120px]'>부서</TableHead>
                  <TableHead className='min-w-[120px]'>음력여부</TableHead>
                  <TableHead className='min-w-[130px]'>유연근무제</TableHead>
                  <TableHead className='min-w-[100px]'>권한</TableHead>
                  <TableHead className='min-w-[80px] pr-4'></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((row: GetUsersResp) => (
                  <TableRow
                    key={row.user_id}
                    className={cn(
                      'hover:bg-muted/50 hover:text-foreground',
                      'dark:hover:bg-muted/80 dark:hover:text-foreground'
                    )}
                  >
                    <TableCell 
                      className={cn(
                        'pl-4 w-[180px]',
                        'sticky left-0 z-5 bg-card'
                      )}
                    >
                      <div className='flex items-center gap-3'>
                        <Avatar className='w-8 h-8 flex-shrink-0'>
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
                          <Moon className='w-4 h-4 text-blue-600 flex-shrink-0' /> : 
                          <Sun className='w-4 h-4 text-yellow-600 flex-shrink-0' />
                        }
                        <Badge className={cn(
                          'text-xs whitespace-nowrap',
                          row.lunar_yn === 'Y' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                        )}>
                          {row.lunar_yn === 'Y' ? '음력' : '양력'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        'text-xs whitespace-nowrap',
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
                          <UserRoundCog size={14} className='flex-shrink-0'/> : 
                          <UserRound size={14} className='flex-shrink-0'/>
                        }
                        <span className='whitespace-nowrap'>{row.user_role_type}</span>
                      </div>
                    </TableCell>
                    <TableCell className='pr-4'>
                      <div className='flex justify-end'>
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
                              title='사용자 수정'
                              user={row}
                              onSave={handleUpdateUser}
                              trigger={
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Pencil className='h-4 w-4' />
                                  <span>수정</span>
                                </DropdownMenuItem>
                              }
                            />
                            <UserEditDialog
                              title='사용자 복사'
                              user={{...row, user_id: ''}}
                              onSave={handleCreateUser}
                              trigger={
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Copy className='h-4 w-4' />
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
                                  <Trash2 className='h-4 w-4' />
                                  <span>삭제</span>
                                </DropdownMenuItem>
                              }
                            />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
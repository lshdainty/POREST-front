import { useGetUsers } from '@/api/user';
import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell
} from '@table-library/react-table-library/table';
import { Button } from '@/components/shadcn/button';
import { Badge } from "@/components/shadcn/badge"
import { Avatar, AvatarFallback } from '@/components/shadcn/avatar';
import { UserRoundCog, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function User() {
  const {data: users, isLoading: usersLoading} = useGetUsers();

  if (usersLoading) {
    return (
      <div className='flex w-full h-full p-2.5'>
        <span>loading...</span>
      </div>
    );
  }

  if (!users) {
    return (
      <div className='flex w-full h-full p-2.5'>
        <span>no data</span>
      </div>
    );
  }

  return (
    <div className='w-full h-full flex flex-col justify-start gap-4 py-4'>
      <div className='flex justify-end w-full px-4 lg:px-6'>
        <Button className='text-sm h-8' variant='outline'>Save</Button>
      </div>
      <div className='w-full flex px-4 lg:px-6'>
        <Table
          className='w-full !h-auto border overflow-hidden rounded-lg'
          data={{nodes: users}}
          layout={{ fixedHeader: true }}
        >
          {(tableList: any) => (
            <>
              <Header>
                <HeaderRow className='!bg-muted !text-foreground [&_th]:!p-2 [&_th]:!text-sm [&_th]:!h-10 [&_th]:!font-medium [&_div]:!pl-2'>
                  <HeaderCell>이름</HeaderCell>
                  <HeaderCell>생년월일</HeaderCell>
                  <HeaderCell>email</HeaderCell>
                  <HeaderCell>소속</HeaderCell>
                  <HeaderCell>음력여부</HeaderCell>
                  <HeaderCell>유연근무제</HeaderCell>
                  <HeaderCell>권한</HeaderCell>
                </HeaderRow>
              </Header>
              <Body>
                {tableList.map((row: any, i: number) => (
                  <Row
                    item={row}
                    className={cn(
                      'hover:!bg-muted/50 !bg-background !text-foreground [&_td]:!p-2 [&_td]:!text-sm [&_td>div]:!py-1 [&_td>div]:!pl-2',
                      i !== users?.length-1 ? '[&_td]:!border-b' : '[&_td]:!border-b-0'
                    )}
                    key={row.user_no}
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
                    <Cell>{`${row.user_birth.substr(0, 4)}년 ${row.user_birth.substr(4, 2)}월 ${row.user_birth.substr(6, 2)}일`}</Cell>
                    <Cell>{row.user_email}</Cell>
                    <Cell>{row.user_employ}</Cell>
                    <Cell>{row.lunar_yn}</Cell>
                    <Cell>
                      <Badge className={`
                        ${row.user_work_time === '8 ~ 5' ? 'bg-rose-500 dark:bg-rose-400' : row.user_work_time === '9 ~ 6' ? 'bg-sky-500 dark:bg-sky-400' : 'bg-emerald-500 dark:bg-emerald-400'}
                      `}>{row.user_work_time}</Badge>
                    </Cell>
                    <Cell>
                      <div className={`flex flex-row items-center text-sm gap-1
                        ${row.user_role === 'ADMIN' ? 'text-rose-500 dark:text-rose-400' : 'text-sky-500 dark:text-sky-400'}
                      `}>
                        {row.user_role === 'ADMIN' ? <UserRoundCog size={14}/> : <UserRound size={14}/>}{row.user_role}
                      </div>
                    </Cell>
                  </Row>
                ))}
              </Body>
            </>
          )}
        </Table>
      </div>
    </div>
  );
}
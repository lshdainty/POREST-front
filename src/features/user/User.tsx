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
import { useTheme } from '@/components/shadcn/themeProvider';
import { UserRoundCog, UserRound } from 'lucide-react';
import insighton from '@/assets/img/insighton.svg';
import dtol from '@/assets/img/dtol.svg';
import skax from '@/assets/img/skax.svg';

export default function User() {
  const {data: users, isLoading: usersLoading} = useGetUsers();
  const { theme } = useTheme();

  // const theme = useTheme(getTheme());

  if (usersLoading) {
    return (
      <div className='flex w-full h-full p-2.5'>
        <span>loading...</span>
      </div>
    );
  }

  return (
    <div className='w-full h-full flex flex-col justify-start gap-4 py-4'>
      <div className='flex justify-end w-full px-4 lg:px-6'>
        <Button className='text-sm h-8' variant='secondary'>Save</Button>
      </div>
      <div className='w-full flex px-4 lg:px-6'>
        <Table
          className='w-full !h-auto border overflow-hidden rounded-lg'
          data={{nodes: users}}
          // theme={theme}
          layout={{ fixedHeader: true }}
        >
          {(tableList: any) => (
            <>
              <Header>
                <HeaderRow
                  className={`
                    ${theme === 'light'
                    ? '!bg-muted !text-foreground'
                    : 'dark:!bg-muted dark:!text-foreground'
                  }`}
                >
                  <HeaderCell className='!p-2'>이름</HeaderCell>
                  <HeaderCell className='!p-2'>생년월일</HeaderCell>
                  <HeaderCell className='!p-2'>유연근무제</HeaderCell>
                  <HeaderCell className='!p-2'>권한</HeaderCell>
                  <HeaderCell className='!p-2'>음력여부</HeaderCell>
                  <HeaderCell className='!p-2'>로고테스트</HeaderCell>
                  <HeaderCell className='!p-2'>로고테스트1</HeaderCell>
                  <HeaderCell className='!p-2'>로고테스트2</HeaderCell>
                </HeaderRow>
              </Header>
              <Body>
                {tableList.map((row: any) => (
                  <Row
                    className={`${theme === 'light'
                      ? '!bg-background !text-foreground'
                      : 'dark:!bg-background dark:!text-foreground dark:!border-b'
                    }`}
                    key={row.user_no}
                  >
                    <Cell className='!p-2 !border-b'>{row.user_name}</Cell>
                    <Cell className='!p-2 !border-b'>{`${row.user_birth.substr(0, 4)}년 ${row.user_birth.substr(4, 2)}월 ${row.user_birth.substr(6, 2)}일`}</Cell>
                    <Cell className='!p-2 !border-b'>
                      <Badge className={`
                        ${row.user_work_time === '8 ~ 5' ? 'bg-rose-500 dark:bg-rose-400' : row.user_work_time === '9 ~ 6' ? 'bg-sky-500 dark:bg-sky-400' : 'bg-emerald-500 dark:bg-emerald-400'}
                      `}>{row.user_work_time}</Badge>
                    </Cell>
                    <Cell className='!p-2 !border-b'>
                      <div className={`flex flex-row items-center text-sm gap-1
                        ${row.user_employ === 'ADMIN' ? 'text-rose-500 dark:text-rose-400' : 'text-sky-500 dark:text-sky-400'}
                      `}>
                        {row.user_employ === 'ADMIN' ? <UserRoundCog size={14}/> : <UserRound size={14}/>}{row.user_employ}
                      </div>
                    </Cell>
                    <Cell className='!p-2 !border-b'>{row.lunar_yn}</Cell>
                    <Cell className='!p-2 !border-b'>
                      <img src={skax} alt="아이콘" width="50" height="50" />
                    </Cell>
                    <Cell className='!p-2 !border-b'>
                      <img src={dtol} alt="아이콘" width="50" height="50" />
                    </Cell>
                    <Cell className='!p-2 !border-b'>
                      <img src={insighton} alt="아이콘" width="50" height="50" />
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
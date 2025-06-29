import { useGetUsers } from '@/api/user';
import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell,
} from '@table-library/react-table-library/table';
import { Button } from '@/components/shadcn/button';
// import { useTheme } from '@table-library/react-table-library/theme';
// import { getTheme } from '@table-library/react-table-library/baseline';
import { useTheme } from '@/components/shadcn/themeProvider';

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
                  <HeaderCell className='!p-2'>소속</HeaderCell>
                  <HeaderCell className='!p-2'>음력</HeaderCell>
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
                    <Cell className='!p-2 !border-b'>{row.user_birth}</Cell>
                    <Cell className='!p-2 !border-b'>{row.user_work_time}</Cell>
                    <Cell className='!p-2 !border-b'>{row.user_employ}</Cell>
                    <Cell className='!p-2 !border-b'>{row.lunar_yn}</Cell>
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
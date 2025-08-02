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
import { useGetYearDues } from '@/api/dues';
import { Button } from '@/components/shadcn/button';
import { Badge } from "@/components/shadcn/badge";
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';

export default function DuesTable() {
  const { data: yearDues, isLoading: yearDuesLoading } = useGetYearDues({year: dayjs().format('YYYY')});

  const tableTheme = useTheme([{
    Table: `--data-table-library_grid-template-columns: 15% 15% 30% 15% 10% 15% !important;`,
  }]);

  if(yearDuesLoading) {
    return <div>loading</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <div className='flex justify-between items-center'>
        <h2 className="text-2xl font-bold">입출금 내역</h2>
        <Button className='text-sm h-8' variant='outline'>내역 추가</Button>
      </div>
      <div className='w-full flex-grow'>
        <div className='w-full flex'>
          <Table
            theme={tableTheme}
            className='w-full !h-auto border overflow-hidden rounded-lg'
            data={{ nodes: yearDues || [] }}
            layout={{ fixedHeader: true }}
          >
            {(tableList: any[]) => (
              <>
                <Header> 
                  <HeaderRow className='!bg-muted !text-foreground [&_th]:!p-2 [&_th]:!text-sm [&_th]:!h-10 [&_th]:!font-medium [&_div]:!pl-2'>
                    <HeaderCell>날짜</HeaderCell>
                    <HeaderCell>이름</HeaderCell>
                    <HeaderCell>내용</HeaderCell>
                    <HeaderCell>금액</HeaderCell>
                    <HeaderCell>유형</HeaderCell>
                    <HeaderCell>총액</HeaderCell>
                  </HeaderRow>
                </Header>
                <Body>
                  {tableList.map((item, i) => (
                    <Row
                      key={item.dues_seq}
                      item={item}
                      className={cn(
                        'hover:!bg-muted/50 !bg-background !text-foreground [&_td]:!p-2 [&_td]:!text-sm [&_td>div]:!py-1 [&_td>div]:!pl-2',
                        i !== tableList.length - 1 ? '[&_td]:!border-b' : '[&_td]:!border-b-0'
                      )}
                    >
                      <Cell>{dayjs(item.dues_date).format('YYYY-MM-DD')}</Cell>
                      <Cell>{item.dues_user_name}</Cell>
                      <Cell>{item.dues_detail}</Cell>
                      <Cell className={cn(item.dues_calc === 'PLUS' ? 'text-blue-500' : 'text-red-500')}>
                        {Math.abs(item.dues_amount).toLocaleString('ko-KR')}원
                      </Cell>
                      <Cell>
                        <Badge variant={item.dues_calc === 'PLUS' ? 'default' : 'destructive'}>
                          {item.dues_calc === 'PLUS' ? '입금' : '출금'}
                        </Badge>
                      </Cell>
                      <Cell>{item.total_dues.toLocaleString('ko-KR')}원</Cell>
                    </Row>
                  ))}
                </Body>
              </>
            )}
          </Table>
        </div>
      </div>
    </div>
  )
}
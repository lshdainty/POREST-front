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
import { useGetYearOperationDues } from '@/api/dues';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card"
import { Button } from '@/components/shadcn/button';
import { Badge } from "@/components/shadcn/badge"
import { cn } from '@/lib/utils';
import { DollarSign, Users, CreditCard, Activity } from 'lucide-react';
import dayjs from 'dayjs';

// Mock Data
const summaryData = [
  { title: '전체 운영비', value: '₩12,345,000', icon: DollarSign },
  { title: '운영비 입금', value: '+ ₩1,230,000', icon: CreditCard },
  { title: '운영비 출금', value: '- ₩875,000', icon: Activity },
  { title: '07월 생일비', value: '₩300,000', icon: Users },
];

const birthdayPayments = [
  { name: '이정훈', payments: [50000, 50000, 50000, 50000, 50000, 50000, 0, 0, 0, 0, 0, 0] },
  { name: '홍길동', payments: [50000, 50000, 50000, 50000, 50000, 50000, 50000, 50000, 50000, 50000, 50000, 50000] },
  { name: '김영희', payments: [60000, 50000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { name: '박철수', payments: [50000, 50000, 50000, 50000, 50000, 50000, 50000, 0, 0, 0, 0, 0] },
  { name: '최미영', payments: [50000, 50000, 50000, 50000, 50000, 50000, 50000, 50000, 50000, 50000, 0, 0] },
];

const transactions = [
  { id: '1', date: '2025-07-15', description: '7월 생일비 지급', amount: -50000, type: '출금' },
  { id: '2', date: '2025-07-10', description: '운영비 입금', amount: 1000000, type: '입금' },
  { id: '3', date: '2025-07-05', description: '사무용품 구매', amount: -75000, type: '출금' },
  { id: '4', date: '2025-06-20', description: '6월 회식비', amount: -350000, type: '출금' },
  { id: '5', date: '2025-06-10', description: '운영비 입금', amount: 1000000, type: '입금' },
];

export default function Culture() {
  const { data: dues, isLoading: duesLoading} = useGetYearOperationDues({year: dayjs().format('YYYY')});

  const tableTheme = useTheme([{
    Table: `--data-table-library_grid-template-columns: 20% 50% 20% 10% !important;`,
  }]);

  if(duesLoading) {
    return <div>loading</div>
  } 

  console.log(dues);

  return (
    <div className="w-full h-full flex flex-col gap-6 p-4 lg:p-6">
      {/* Top Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* {summaryData.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={cn("text-2xl font-bold", item.title === '운영비 입금' && 'text-red-500', item.title === '운영비 출금' && 'text-blue-500')}>{item.value}</div>
            </CardContent>
          </Card>
        ))} */}
        <Card key="total">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 운영비</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold")}>{"1234"}</div>
          </CardContent>
        </Card>
        <Card key="1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">운영비 입금</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold text-red-500")}>{"12345"}</div>
          </CardContent>
        </Card>
        <Card key="2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">운영비 출금</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold text-blue-500")}>{"12345"}</div>
          </CardContent>
        </Card>
        <Card key="3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">07월 생일비</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold")}>{"12345"}</div>
          </CardContent>
        </Card>
      </div>

      {/* Birthday Payments Grid */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>월별 생일비 입금 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-13 gap-x-2 gap-y-2 text-center text-sm items-center">
              <div className="font-semibold"></div>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <div key={month} className="font-semibold">{month}월</div>
              ))}
              {birthdayPayments.map((user) => (
                <>
                  <div className="font-semibold text-left py-1">{user.name}</div>
                  {user.payments.map((status, index) => (
                    <div key={index} className="flex justify-center items-center">
                      <div className={cn(
                        "w-12 h-10 flex items-center justify-center rounded-md text-base",
                        status > 0 ? 'bg-green-200 dark:bg-green-800' : 'bg-gray-200 dark:bg-gray-700'
                      )}>
                        {status > 0 && (
                          <span className="font-semibold text-green-900 dark:text-green-100">
                            {(status / 10000).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Transactions Table */}
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
              data={{ nodes: transactions }}
              layout={{ fixedHeader: true }}
            >
              {(tableList: typeof transactions) => (
                <>
                  <Header>
                    <HeaderRow className='!bg-muted !text-foreground [&_th]:!p-2 [&_th]:!text-sm [&_th]:!h-10 [&_th]:!font-medium [&_div]:!pl-2'>
                      <HeaderCell>거래일</HeaderCell>
                      <HeaderCell>내용</HeaderCell>
                      <HeaderCell>금액</HeaderCell>
                      <HeaderCell>유형</HeaderCell>
                    </HeaderRow>
                  </Header>
                  <Body>
                    {tableList.map((item, i) => (
                      <Row
                        key={item.id}
                        item={item}
                        className={cn(
                          'hover:!bg-muted/50 !bg-background !text-foreground [&_td]:!p-2 [&_td]:!text-sm [&_td>div]:!py-1 [&_td>div]:!pl-2',
                          i !== transactions.length - 1 ? '[&_td]:!border-b' : '[&_td]:!border-b-0'
                        )}
                      >
                        <Cell>{item.date}</Cell>
                        <Cell>{item.description}</Cell>
                        <Cell className={cn(item.type === '입금' ? 'text-blue-500' : 'text-red-500')}>
                          {item.amount.toLocaleString('ko-KR')}원
                        </Cell>
                        <Cell>
                          <Badge variant={item.type === '입금' ? 'default' : 'destructive'}>
                            {item.type}
                          </Badge>
                        </Cell>
                      </Row>
                    ))}
                  </Body>
                </>
              )}
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
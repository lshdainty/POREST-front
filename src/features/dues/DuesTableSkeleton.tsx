import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell
} from '@table-library/react-table-library/table';
import { useTheme } from '@table-library/react-table-library/theme';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/card'
import { Skeleton } from '@/components/shadcn/skeleton'
import { cn } from '@/lib/utils';

export default function DuesTableSkeleton() {
  const tableTheme = useTheme([{
    Table: `--data-table-library_grid-template-columns: minmax(150px, 15%) minmax(120px, 15%) minmax(250px, 26%) minmax(120px, 15%) minmax(100px, 10%) minmax(120px, 15%) minmax(60px, 4%) !important;`,
  }]);

  const skeletonRows = Array.from({ length: 10 }, (_, i) => ({ id: i }));

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>
          <Skeleton className='h-6 w-32' />
        </CardTitle>
        <div className='flex gap-2'>
          <Skeleton className='h-8 w-16' />
          <Skeleton className='h-8 w-16' />
        </div>
      </CardHeader>
      <CardContent>
        <div className='w-full flex-grow overflow-auto'>
          <div className='rounded-lg border overflow-hidden'>
            <Table
              theme={tableTheme}
              className='w-full !h-auto'
              data={{ nodes: skeletonRows }}
              layout={{ fixedHeader: true }}
            >
              {(tableList: { id: number }[]) => (
                <>
                  <Header>
                    <HeaderRow className='!bg-muted !text-foreground [&_th]:!p-2 [&_th]:!text-sm [&_th]:!h-10 [&_th]:!font-medium [&_div]:!pl-2'>
                      <HeaderCell>날짜</HeaderCell>
                      <HeaderCell>이름</HeaderCell>
                      <HeaderCell>내용</HeaderCell>
                      <HeaderCell>금액</HeaderCell>
                      <HeaderCell>유형</HeaderCell>
                      <HeaderCell>총액</HeaderCell>
                      <HeaderCell></HeaderCell>
                    </HeaderRow>
                  </Header>
                  <Body>
                    {tableList.map((row, i) => (
                      <Row
                        key={row.id}
                        item={row}
                        className={cn(
                          'hover:!bg-muted/50 !bg-background !text-foreground [&_td]:!p-2 [&_td]:!text-sm [&_td>div]:!py-1 [&_td>div]:!pl-2',
                          i !== tableList.length - 1 ? '[&_td]:!border-b' : '[&_td]:!border-b-0'
                        )}
                      >
                        <Cell><Skeleton className='h-5 w-full' /></Cell>
                        <Cell><Skeleton className='h-5 w-full' /></Cell>
                        <Cell><Skeleton className='h-5 w-full' /></Cell>
                        <Cell><Skeleton className='h-5 w-full' /></Cell>
                        <Cell><Skeleton className='h-5 w-full' /></Cell>
                        <Cell><Skeleton className='h-5 w-full' /></Cell>
                        <Cell><Skeleton className='h-8 w-8' /></Cell>
                      </Row>
                    ))}
                  </Body>
                </>
              )}
            </Table>
          </div>
          <div className='flex items-center justify-between p-4'>
            <Skeleton className='h-5 w-20' />
            <div className='flex items-center space-x-6 lg:space-x-8'>
              <Skeleton className='h-5 w-24' />
              <div className='flex items-center space-x-2'>
                <Skeleton className='h-8 w-8' />
                <Skeleton className='h-8 w-8' />
                <Skeleton className='h-8 w-8' />
                <Skeleton className='h-8 w-8' />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
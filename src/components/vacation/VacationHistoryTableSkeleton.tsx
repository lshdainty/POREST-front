import { useTheme } from '@table-library/react-table-library/theme';
import { Table, Header, HeaderRow, Body, Row, HeaderCell, Cell } from '@table-library/react-table-library/table';
import { Skeleton } from '@/components/shadcn/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shadcn/card';

export default function VacationHistoryTableSkeleton() {
  const theme = useTheme([{
    Table: `--data-table-library_grid-template-columns: minmax(150px, 1fr) minmax(150px, 1fr) minmax(250px, 1fr) minmax(60px, auto) !important;`,
  }]);

  const skeletonData = Array(5).fill({});

  return (
    <Card className='h-full'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>
          <Skeleton className='h-6 w-24' />
        </CardTitle>
        <Skeleton className='h-8 w-16' />
      </CardHeader>
      <CardContent>
        <div className='w-full overflow-auto'>
          <Table
            theme={theme}
            className='w-full !h-auto border overflow-hidden rounded-lg'
            data={{ nodes: skeletonData }}
            layout={{ fixedHeader: true }}
          >
            {(tableList: any[]) => (
              <>
                <Header>
                  <HeaderRow className='!bg-muted !text-foreground [&_th]:!p-2 [&_th]:!text-sm [&_th]:!h-10 [&_th]:!font-medium [&_div]:!pl-2'>
                    <HeaderCell>날짜</HeaderCell>
                    <HeaderCell>종류</HeaderCell>
                    <HeaderCell>사유</HeaderCell>
                    <HeaderCell></HeaderCell>
                  </HeaderRow>
                </Header>
                <Body>
                  {tableList.map((_, i) => (
                    <Row
                      key={i}
                      item={_}
                      className={'hover:!bg-muted/50 !bg-background !text-foreground [&_td]:!p-2 [&_td]:!text-sm [&_td>div]:!py-1 [&_td>div]:!pl-2 [&_td]:!border-b'}
                    >
                      <Cell><Skeleton className='h-8 w-full' /></Cell>
                      <Cell><Skeleton className='h-8 w-full' /></Cell>
                      <Cell><Skeleton className='h-8 w-full' /></Cell>
                      <Cell><Skeleton className='h-8 w-8' /></Cell>
                    </Row>
                  ))}
                </Body>
              </>
            )}
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
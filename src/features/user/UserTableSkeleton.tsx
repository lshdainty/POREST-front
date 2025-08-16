import { useTheme } from '@table-library/react-table-library/theme';
import { Table, Header, HeaderRow, Body, Row, HeaderCell, Cell } from '@table-library/react-table-library/table';
import { Skeleton } from '@/components/shadcn/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shadcn/card';

export default function UserTableSkeleton() {
  const theme = useTheme([{
    Table: `--data-table-library_grid-template-columns: minmax(120px, 11%) minmax(100px, 11%) minmax(200px, 18%) minmax(150px, 14%) minmax(120px, 11%) minmax(90px, 10%) minmax(100px, 11%) minmax(100px, 11%) minmax(60px, 4%) !important;`,
  }]);

  const skeletonData = Array(6).fill({});

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>
          <Skeleton className="h-6 w-24" />
        </CardTitle>
        <div className='flex gap-2'>
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
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
                    <HeaderCell>이름</HeaderCell>
                    <HeaderCell>ID</HeaderCell>
                    <HeaderCell>Email</HeaderCell>
                    <HeaderCell>생년월일</HeaderCell>
                    <HeaderCell>소속</HeaderCell>
                    <HeaderCell>음력여부</HeaderCell>
                    <HeaderCell>유연근무제</HeaderCell>
                    <HeaderCell>권한</HeaderCell>
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
                      <Cell><Skeleton className="h-8 w-full" /></Cell>
                      <Cell><Skeleton className="h-8 w-full" /></Cell>
                      <Cell><Skeleton className="h-8 w-full" /></Cell>
                      <Cell><Skeleton className="h-8 w-full" /></Cell>
                      <Cell><Skeleton className="h-8 w-full" /></Cell>
                      <Cell><Skeleton className="h-8 w-full" /></Cell>
                      <Cell><Skeleton className="h-8 w-full" /></Cell>
                      <Cell><Skeleton className="h-8 w-full" /></Cell>
                      <Cell><Skeleton className="h-8 w-8" /></Cell>
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

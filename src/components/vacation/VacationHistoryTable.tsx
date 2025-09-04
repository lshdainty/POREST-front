import { useEffect, useState } from 'react';
import { useTheme } from '@table-library/react-table-library/theme';
import { Table, Header, HeaderRow, Body, Row, HeaderCell, Cell as TableCell } from '@table-library/react-table-library/table';
import { GetUserPeriodVacationUseHistoriesResp } from '@/api/vacation';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/shadcn/dropdownMenu';
import { EllipsisVertical, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VacationHistoryTableProps {
  value: GetUserPeriodVacationUseHistoriesResp[];
  canAdd?: boolean;
}

const formatDateTime = (dateTimeString: string) => {
  if (!dateTimeString) {
    return '';
  }
  const date = new Date(dateTimeString);
  if (isNaN(date.getTime())) {
    return dateTimeString;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}.${month}.${day} ${hours}:${minutes}`;
};

export default function VacationHistoryTable({ value: data, canAdd = false }: VacationHistoryTableProps) {
  const handleEdit = (id: string) => {
    // For now, we just log the action. A modal or inline editing would be needed for a real app.
    console.log(`Edit item with id: ${id}`);
  };

  const handleDelete = (id: string) => {
    // This should be handled by calling a function passed from the parent component.
    console.log(`Delete item with id: ${id}`);
  };

  const theme = useTheme([{
    Table: `--data-table-library_grid-template-columns: minmax(150px, 1fr) minmax(150px, 1fr) minmax(250px, 1fr) minmax(60px, auto) !important;`,
  }]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    const totalPages = Math.ceil(data.length / rowsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [data, currentPage, rowsPerPage]);

  const totalPages = data.length > 0 ? Math.ceil(data.length / rowsPerPage) : 1;
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <Card className='h-full'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>휴가 이력</CardTitle>
        {canAdd && <Button size='sm'>추가</Button>}
      </CardHeader>
      <CardContent className='flex flex-col h-full justify-between'>
        <div className='w-full overflow-auto'>
          <Table
            data={{ nodes: paginatedData }}
            theme={theme}
            layout={{ fixedHeader: true }}
            className='w-full !h-auto border overflow-hidden rounded-lg'
            // pagination={paginatedData}
          >
            {(tableList: any) => (
              <>
                <Header>
                  <HeaderRow className='!bg-muted !text-foreground [&_th]:!p-2 [&_th]:!text-sm [&_th]:!h-10 [&_th]:!font-medium [&_div]:!pl-2'>
                    <HeaderCell>날짜</HeaderCell>
                    <HeaderCell>휴가 종류</HeaderCell>
                    <HeaderCell>사유</HeaderCell>
                    <HeaderCell></HeaderCell>
                  </HeaderRow>
                </Header>
                <Body>
                  {tableList.map((item: any, i: number) => (
                    <Row key={item.vacation_history_id} item={item} className={cn(
                      'hover:!bg-muted/50 !bg-background !text-foreground [&_td]:!p-2 [&_td]:!text-sm [&_td>div]:!py-1 [&_td>div]:!pl-2',
                      i !== tableList.length - 1 ? '[&_td]:!border-b' : '[&_td]:!border-b-0'
                    )}>
                      <TableCell>{formatDateTime(item.start_date)}</TableCell>
                      <TableCell>{item.vacation_time_type_name}</TableCell>
                      <TableCell>{item.vacation_desc}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              className='data-[state=open]:bg-muted text-muted-foreground flex size-8'
                              size='icon'
                            >
                              <EllipsisVertical />
                              <span className='sr-only'>Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem onClick={() => handleEdit(item.vacation_history_id)}>수정</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className='text-destructive focus:text-destructive hover:!bg-destructive/20'
                              onClick={() => handleDelete(item.vacation_history_id)}
                            >
                              삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </Row>
                  ))}
                </Body>
              </>
            )}
          </Table>
        </div>
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-muted-foreground">
            {data.length} row(s)
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage <= 1}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
import { useState } from 'react';
import { useTheme } from '@table-library/react-table-library/theme';
import { Table, Header, HeaderRow, Body, Row, HeaderCell, Cell as TableCell } from '@table-library/react-table-library/table';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/shadcn/dropdownMenu';
import { EllipsisVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

const initialVacationHistory = [
  {
      id: '1',
      date: '2025-08-01',
      type: '연차',
      reason: '여름 휴가'
  },
  {
      id: '2',
      date: '2025-07-15',
      type: '반차',
      reason: '병원 방문'
  },
  {
      id: '3',
      date: '2025-08-05',
      type: '연차',
      reason: '가족 여행'
  },
  {
      id: '4',
      date: '2025-09-10',
      type: '연차',
      reason: '개인 사유'
  }
];

export default function VacationHistoryTable() {
  const [vacationHistory, setVacationHistory] = useState(initialVacationHistory);

  const handleAdd = () => {
    const newId = (Math.max(...vacationHistory.map(item => parseInt(item.id))) + 1).toString();
    const newVacation = {
      id: newId,
      date: new Date().toISOString().split('T')[0],
      type: '연차',
      reason: ''
    };
    setVacationHistory([...vacationHistory, newVacation]);
  };

  const handleEdit = (id: string) => {
    // For now, we just log the action. A modal or inline editing would be needed for a real app.
    console.log(`Edit item with id: ${id}`);
  };

  const handleDelete = (id: string) => {
    setVacationHistory(vacationHistory.filter(item => item.id !== id));
  };

  const theme = useTheme([{
    Table: `--data-table-library_grid-template-columns: minmax(150px, 1fr) minmax(150px, 1fr) minmax(250px, 1fr) minmax(60px, auto) !important;`,
  }]);

  return (
    <Card className='h-full'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>휴가 내역</CardTitle>
        <Button onClick={handleAdd} size='sm'>추가</Button>
      </CardHeader>
      <CardContent>
        <div className='w-full overflow-auto'>
          <Table data={{ nodes: vacationHistory }} theme={theme} layout={{ fixedHeader: true }} className='w-full !h-auto border overflow-hidden rounded-lg'>
            {(tableList: any) => (
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
                  {tableList.map((item: any, i: number) => (
                    <Row key={item.id} item={item} className={cn(
                      'hover:!bg-muted/50 !bg-background !text-foreground [&_td]:!p-2 [&_td]:!text-sm [&_td>div]:!py-1 [&_td>div]:!pl-2',
                      i !== vacationHistory?.length-1 ? '[&_td]:!border-b' : '[&_td]:!border-b-0'
                    )}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.reason}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleEdit(item.id)}>수정</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className='text-destructive focus:text-destructive hover:!bg-destructive/20'
                              onClick={() => handleDelete(item.id)}
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
      </CardContent>
    </Card>
  )
}
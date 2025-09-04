import { useEffect, useState } from 'react';
import { Table, Header, HeaderRow, Body, Row, HeaderCell, Cell } from '@table-library/react-table-library/table';
import { useTheme } from '@table-library/react-table-library/theme';
import { usePostDues, usePutDues, useDeleteDues, GetYearDuesResp } from '@/api/dues';
import { Badge } from '@/components/shadcn/badge';
import { Input } from '@/components/shadcn/input';
import { Button } from '@/components/shadcn/button';
import { InputDatePicker } from '@/components/shadcn/inputDatePicker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/shadcn/dropdownMenu';
import { EllipsisVertical, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Pencil, Copy, Trash2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';

type EditableDuesData = GetYearDuesResp & { id: string; isNew?: boolean; tempId?: string };
type UpdateDuesData = GetYearDuesResp & { id: string };

interface ModifiedData {
  created: EditableDuesData[];
  updated: UpdateDuesData[];
  deleted: number[];
}

interface DuesTableProps {
  yearDues?: GetYearDuesResp[];
}

export default function DuesTable({ yearDues = [] }: DuesTableProps) {
  const { mutate: postDues } = usePostDues();
  const { mutate: putDues } = usePutDues();
  const { mutate: deleteDues } = useDeleteDues();
  const [tableData, setTableData] = useState<EditableDuesData[]>([]);
  const [modifiedData, setModifiedData] = useState<ModifiedData>({
    created: [],
    updated: [],
    deleted: [],
  });
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    if (yearDues) {
      const formattedDues = yearDues.map((dues) => ({
        ...dues,
        id: dues.dues_seq.toString(),
      }));
      setTableData(formattedDues);
    }
  }, [yearDues]);

  useEffect(() => {
    const totalPages = Math.ceil(tableData.length / rowsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [tableData, currentPage, rowsPerPage]);

  const tableTheme = useTheme([{
    Table: `--data-table-library_grid-template-columns: minmax(150px, 15%) minmax(120px, 15%) minmax(250px, 26%) minmax(120px, 15%) minmax(100px, 10%) minmax(120px, 15%) minmax(60px, 4%) !important;`,
  }]);

  const handleDelete = (id: string) => {
    const rowToDelete = tableData.find(row => row.id === id);
    if (!rowToDelete) return;

    if (rowToDelete.isNew) {
      setModifiedData({
        ...modifiedData,
        created: modifiedData.created.filter((dues) => dues.id !== id),
      });
    } else {
      setModifiedData({
        ...modifiedData,
        updated: modifiedData.updated.filter((dues) => dues.id !== id),
        deleted: [...modifiedData.deleted, parseInt(id)],
      });
    }

    setTableData(tableData.filter((dues) => dues.id !== id));
  };

  const handleCopy = (row: EditableDuesData) => {
    const tempId = `new_${Date.now()}`;
    const newRow: EditableDuesData = {
      ...row,
      id: tempId,
      dues_seq: 0,
      isNew: true,
      tempId: tempId,
    };
    const newTableData = [...tableData, newRow];
    setTableData(newTableData);
    setModifiedData({
      ...modifiedData,
      created: [...modifiedData.created, newRow],
    });
    setEditingRow(tempId);
    setCurrentPage(Math.ceil(newTableData.length / rowsPerPage));
  };

  const handleAdd = () => {
    const tempId = `new_${Date.now()}`;
    const newRow: EditableDuesData = {
      id: tempId,
      dues_seq: 0,
      dues_date: dayjs().format('YYYYMMDD'),
      dues_user_name: '',
      dues_type: 'OPERATION',
      dues_detail: '',
      dues_amount: 0,
      dues_calc: 'PLUS',
      total_dues: 0,
      isNew: true,
      tempId: tempId,
    };

    const newTableData = [...tableData, newRow];
    setTableData(newTableData);
    setModifiedData({
      ...modifiedData,
      created: [...modifiedData.created, newRow],
    });
    setEditingRow(tempId);
    setCurrentPage(Math.ceil(newTableData.length / rowsPerPage));
  };

  const handleEdit = (id: string) => {
    setEditingRow(id);
  };

  const handleSave = () => {
    modifiedData.created.forEach(dues => {
      const { isNew, tempId, id, ...duesData } = dues;
      postDues(duesData);
    });

    modifiedData.updated.forEach(dues => {
      putDues(dues);
    });

    modifiedData.deleted.forEach(dues_seq => {
      deleteDues(dues_seq);
    });

    setModifiedData({ created: [], updated: [], deleted: [] });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string, field: keyof GetYearDuesResp) => {
    const newData = tableData.map((row) => {
      if (row.id === id) {
        return { ...row, [field]: e.target.value };
      }
      return row;
    });
    setTableData(newData);

    const updatedDues = newData.find(dues => dues.id === id);
    if (!updatedDues) return;

    if (updatedDues.isNew) {
      setModifiedData({
        ...modifiedData,
        created: modifiedData.created.map((dues) =>
          dues.id === id ? updatedDues : dues
        ),
      });
    } else if (!modifiedData.updated.find((dues) => dues.id === id)) {
      setModifiedData({
        ...modifiedData,
        updated: [...modifiedData.updated, updatedDues],
      });
    } else {
      setModifiedData({
        ...modifiedData,
        updated: modifiedData.updated.map((dues) =>
          dues.id === id ? updatedDues : dues
        ),
      });
    }
  };

  const handleSelectChange = (value: string, id: string, field: keyof GetYearDuesResp) => {
    const newData = tableData.map((row) => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setTableData(newData);

    const updatedDues = newData.find(dues => dues.id === id);
    if (!updatedDues) return;

    if (updatedDues.isNew) {
      setModifiedData({
        ...modifiedData,
        created: modifiedData.created.map((dues) =>
          dues.id === id ? updatedDues : dues
        ),
      });
    } else if (!modifiedData.updated.find((dues) => dues.id === id)) {
      setModifiedData({
        ...modifiedData,
        updated: [...modifiedData.updated, updatedDues],
      });
    } else {
      setModifiedData({
        ...modifiedData,
        updated: modifiedData.updated.map((dues) =>
          dues.id === id ? updatedDues : dues
        ),
      });
    }
  };

  const handleDateChange = (value: string | undefined, id: string) => {
    if (!value) return;
    const formattedDate = dayjs(value).format('YYYYMMDD');
    const newData = tableData.map((row) => {
      if (row.id === id) {
        return { ...row, dues_date: formattedDate };
      }
      return row;
    });
    setTableData(newData);

    const updatedDues = newData.find(dues => dues.id === id);
    if (!updatedDues) return;

    if (updatedDues.isNew) {
      setModifiedData({
        ...modifiedData,
        created: modifiedData.created.map((dues) =>
          dues.id === id ? updatedDues : dues
        ),
      });
    } else if (!modifiedData.updated.find((dues) => dues.id === id)) {
      setModifiedData({
        ...modifiedData,
        updated: [...modifiedData.updated, updatedDues],
      });
    } else {
      setModifiedData({
        ...modifiedData,
        updated: modifiedData.updated.map((dues) =>
          dues.id === id ? updatedDues : dues
        ),
      });
    }
  };

  const totalPages = tableData.length > 0 ? Math.ceil(tableData.length / rowsPerPage) : 1;
  const paginatedData = tableData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>입출금 내역</CardTitle>
        <div className='flex gap-2'>
          <Button className='text-sm h-8' onClick={handleAdd}>추가</Button>
          <Button className='text-sm h-8' variant='outline' onClick={handleSave}>저장</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className='w-full flex-grow overflow-auto'>
          <div className='rounded-lg border overflow-hidden'>
            <Table
              theme={tableTheme}
              className='w-full !h-auto'
              data={{ nodes: paginatedData }}
              layout={{ fixedHeader: true }}
            >
              {(tableList: EditableDuesData[]) => (
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
                    {tableList.map((row, i) => {
                      const isEditing = editingRow === row.id;
                      return (
                        <Row
                          key={row.id}
                          item={row}
                          className={cn(
                            'hover:!bg-muted/50 !bg-background !text-foreground [&_td]:!p-2 [&_td]:!text-sm [&_td>div]:!py-1 [&_td>div]:!pl-2',
                            i !== tableList.length - 1 ? '[&_td]:!border-b' : '[&_td]:!border-b-0'
                          )}
                        >
                          <Cell>
                            {isEditing ? (
                              <InputDatePicker
                                value={dayjs(row.dues_date).format('YYYY-MM-DD')}
                                onValueChange={(value) => handleDateChange(value, row.id)}
                              />
                            ) : (
                              dayjs(row.dues_date).format('YYYY-MM-DD')
                            )}
                          </Cell>
                          <Cell>
                            {isEditing ? (
                              <Input
                                value={row.dues_user_name}
                                onChange={(e) => handleInputChange(e, row.id, 'dues_user_name')}
                              />
                            ) : (
                              row.dues_user_name
                            )}
                          </Cell>
                          <Cell>
                            {isEditing ? (
                              <Input
                                value={row.dues_detail}
                                onChange={(e) => handleInputChange(e, row.id, 'dues_detail')}
                              />
                            ) : (
                              row.dues_detail
                            )}
                          </Cell>
                          <Cell className={cn(row.dues_calc === 'PLUS' ? 'text-blue-500' : 'text-red-500')}>
                            {isEditing ? (
                              <Input
                                type='number'
                                value={row.dues_amount}
                                onChange={(e) => handleInputChange(e, row.id, 'dues_amount')}
                              />
                            ) : (
                              `${Math.abs(row.dues_amount).toLocaleString('ko-KR')}원`
                            )}
                          </Cell>
                          <Cell>
                            {isEditing ? (
                              <Select
                                value={row.dues_calc}
                                onValueChange={(value) => handleSelectChange(value, row.id, 'dues_calc')}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder='유형' />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value='PLUS'>입금</SelectItem>
                                  <SelectItem value='MINUS'>출금</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge variant={row.dues_calc === 'PLUS' ? 'default' : 'destructive'}>
                                {row.dues_calc === 'PLUS' ? '입금' : '출금'}
                              </Badge>
                            )}
                          </Cell>
                          <Cell>{row.total_dues.toLocaleString('ko-KR')}원</Cell>
                          <Cell>
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
                              <DropdownMenuContent align='end' className='w-32'>
                                {isEditing ? (
                                  <DropdownMenuItem onClick={() => setEditingRow(null)}>
                                    <Save className='h-4 w-4' />
                                    <span>저장</span>
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleEdit(row.id)}>
                                    <Pencil className='h-4 w-4' />
                                    <span>수정</span>
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleCopy(row)}>
                                  <Copy className='h-4 w-4' />
                                  <span>복사</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className='text-destructive focus:text-destructive hover:!bg-destructive/20'
                                  onClick={() => handleDelete(row.id)}
                                >
                                  <Trash2 className='h-4 w-4' />
                                  <span>삭제</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </Cell>
                        </Row>
                      )
                    })}
                  </Body>
                </>
              )}
            </Table>
          </div>
          <div className='flex items-center justify-between p-4'>
            <div className='text-sm text-muted-foreground'>
              {tableData.length} row(s)
            </div>
            <div className='flex items-center space-x-6 lg:space-x-8'>
              <div className='flex items-center space-x-2'>
                <p className='text-sm font-medium'>
                  Page {currentPage} of {totalPages}
                </p>
              </div>
              <div className='flex items-center space-x-2'>
                <Button
                  variant='outline'
                  className='h-8 w-8 p-0'
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage <= 1}
                >
                  <span className='sr-only'>Go to first page</span>
                  <ChevronsLeft className='h-4 w-4' />
                </Button>
                <Button
                  variant='outline'
                  className='h-8 w-8 p-0'
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <span className='sr-only'>Go to previous page</span>
                  <ChevronLeft className='h-4 w-4' />
                </Button>
                <Button
                  variant='outline'
                  className='h-8 w-8 p-0'
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  <span className='sr-only'>Go to next page</span>
                  <ChevronRight className='h-4 w-4' />
                </Button>
                <Button
                  variant='outline'
                  className='h-8 w-8 p-0'
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage >= totalPages}
                >
                  <span className='sr-only'>Go to last page</span>
                  <ChevronsRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
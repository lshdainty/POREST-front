import { useEffect, useState } from 'react';
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
import { useGetYearDues, usePostDues, usePutDues, useDeleteDues } from '@/api/dues';
import { Button } from '@/components/shadcn/button';
import { Badge } from "@/components/shadcn/badge";
import { Input } from '@/components/shadcn/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/shadcn/dropdownMenu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { EllipsisVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';

interface DuesData {
  dues_seq: number;
  dues_date: string;
  dues_user_name: string;
  dues_type: 'OPERATION' | 'BIRTH' | 'FINE';
  dues_detail: string;
  dues_amount: number;
  dues_calc: 'PLUS' | 'MINUS';
  total_dues: number;
}

type EditableDuesData = DuesData & { isNew?: boolean; tempId?: string };

interface ModifiedData {
  created: EditableDuesData[];
  updated: DuesData[];
  deleted: number[];
}

export default function DuesTable() {
  const { data: yearDues, isLoading: yearDuesLoading } = useGetYearDues({year: dayjs().format('YYYY')});
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

  useEffect(() => {
    if (yearDues) {
      const formattedDues = yearDues.map((dues: any) => ({
        ...dues,
      }));
      setTableData(formattedDues);
    }
  }, [yearDues]);

  const tableTheme = useTheme([{
    Table: `--data-table-library_grid-template-columns: 15% 15% 26% 15% 10% 15% 4% !important;`,
  }]);

  const handleDelete = (id: string) => {
    if (!tableData) return;
    const rowToDelete = tableData.find(row => (row.isNew ? row.tempId : row.dues_seq.toString()) === id);
    if (!rowToDelete) return;

    if (rowToDelete.isNew) {
      setModifiedData({
        ...modifiedData,
        created: modifiedData.created.filter((dues) => dues.tempId !== id),
      });
    } else {
      setModifiedData({
        ...modifiedData,
        updated: modifiedData.updated.filter((dues) => dues.dues_seq.toString() !== id),
        deleted: [...modifiedData.deleted, parseInt(id)],
      });
    }

    setTableData(tableData.filter((dues) => (dues.isNew ? dues.tempId : dues.dues_seq.toString()) !== id));
  };

  const handleCopy = (row: EditableDuesData) => {
    if (!tableData) return;
    const tempId = `new_${Date.now()}`;
    const newRow: EditableDuesData = {
      ...row,
      dues_seq: 0,
      isNew: true,
      tempId: tempId,
    };
    setTableData([...tableData, newRow]);
    setModifiedData({
      ...modifiedData,
      created: [...modifiedData.created, newRow],
    });
    setEditingRow(tempId);
  };

  const handleAdd = () => {
    if (!tableData) return;
    const tempId = `new_${Date.now()}`;
    const newRow: EditableDuesData = {
      dues_seq: 0,
      dues_date: dayjs().format('YYYY-MM-DD'),
      dues_user_name: '',
      dues_type: 'OPERATION',
      dues_detail: '',
      dues_amount: 0,
      dues_calc: 'PLUS',
      total_dues: 0,
      isNew: true,
      tempId: tempId,
    };

    setTableData([...tableData, newRow]);
    setModifiedData({
      ...modifiedData,
      created: [...modifiedData.created, newRow],
    });
    setEditingRow(tempId);
  };

  const handleEdit = (id: string) => {
    setEditingRow(id);
  };

  const handleSave = () => {
    modifiedData.created.forEach(dues => {
      const { isNew, tempId, ...duesData } = dues;
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string, field: keyof DuesData) => {
    if (!tableData) return;
    const newData = tableData.map((row) => {
      if ((row.isNew ? row.tempId : row.dues_seq.toString()) === id) {
        return { ...row, [field]: e.target.value };
      }
      return row;
    });
    setTableData(newData);

    const updatedDues = newData.find(dues => (dues.isNew ? dues.tempId : dues.dues_seq.toString()) === id);
    if (!updatedDues) return;

    if (updatedDues.isNew) {
      setModifiedData({
        ...modifiedData,
        created: modifiedData.created.map((dues) =>
          dues.tempId === id ? updatedDues : dues
        ),
      });
    } else if (!modifiedData.updated.find((dues) => dues.dues_seq.toString() === id)) {
      setModifiedData({
        ...modifiedData,
        updated: [...modifiedData.updated, updatedDues],
      });
    } else {
      setModifiedData({
        ...modifiedData,
        updated: modifiedData.updated.map((dues) =>
          dues.dues_seq.toString() === id ? updatedDues : dues
        ),
      });
    }
  };

  const handleSelectChange = (value: string, id: string, field: keyof DuesData) => {
    if (!tableData) return;
    const newData = tableData.map((row) => {
      if ((row.isNew ? row.tempId : row.dues_seq.toString()) === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setTableData(newData);

    const updatedDues = newData.find(dues => (dues.isNew ? dues.tempId : dues.dues_seq.toString()) === id);
    if (!updatedDues) return;

    if (updatedDues.isNew) {
      setModifiedData({
        ...modifiedData,
        created: modifiedData.created.map((dues) =>
          dues.tempId === id ? updatedDues : dues
        ),
      });
    } else if (!modifiedData.updated.find((dues) => dues.dues_seq.toString() === id)) {
      setModifiedData({
        ...modifiedData,
        updated: [...modifiedData.updated, updatedDues],
      });
    } else {
      setModifiedData({
        ...modifiedData,
        updated: modifiedData.updated.map((dues) =>
          dues.dues_seq.toString() === id ? updatedDues : dues
        ),
      });
    }
  };

  if(yearDuesLoading) {
    return <div>loading</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <div className='flex justify-between items-center'>
        <h2 className="text-2xl font-bold">입출금 내역</h2>
        <div>
          <Button className='text-sm h-8 mr-2' variant='outline' onClick={handleAdd}>내역 추가</Button>
          <Button className='text-sm h-8' variant='outline' onClick={handleSave}>저장</Button>
        </div>
      </div>
      <div className='w-full flex-grow'>
        <div className='w-full flex'>
          <Table
            theme={tableTheme}
            className='w-full !h-auto border overflow-hidden rounded-lg'
            data={{ nodes: tableData }}
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
                    const id = row.isNew ? row.tempId! : row.dues_seq.toString();
                    const isEditing = editingRow === id;
                    return (
                      <Row
                        key={id}
                        item={row}
                        className={cn(
                          'hover:!bg-muted/50 !bg-background !text-foreground [&_td]:!p-2 [&_td]:!text-sm [&_td>div]:!py-1 [&_td>div]:!pl-2',
                          i !== tableList.length - 1 ? '[&_td]:!border-b' : '[&_td]:!border-b-0'
                        )}
                      >
                        <Cell>
                          {isEditing ? (
                            <Input
                              value={dayjs(row.dues_date).format('YYYY-MM-DD')}
                              onChange={(e) => handleInputChange(e, id, 'dues_date')}
                            />
                          ) : (
                            dayjs(row.dues_date).format('YYYY-MM-DD')
                          )}
                        </Cell>
                        <Cell>
                          {isEditing ? (
                            <Input
                              value={row.dues_user_name}
                              onChange={(e) => handleInputChange(e, id, 'dues_user_name')}
                            />
                          ) : (
                            row.dues_user_name
                          )}
                        </Cell>
                        <Cell>
                          {isEditing ? (
                            <Input
                              value={row.dues_detail}
                              onChange={(e) => handleInputChange(e, id, 'dues_detail')}
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
                              onChange={(e) => handleInputChange(e, id, 'dues_amount')}
                            />
                          ) : (
                            `${Math.abs(row.dues_amount).toLocaleString('ko-KR')}원`
                          )}
                        </Cell>
                        <Cell>
                          {isEditing ? (
                            <Select
                              value={row.dues_calc}
                              onValueChange={(value) => handleSelectChange(value, id, 'dues_calc')}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="유형" />
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
                                variant="ghost"
                                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                                size="icon"
                              >
                                <EllipsisVertical />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32">
                              {isEditing ? (
                                <DropdownMenuItem onClick={() => setEditingRow(null)}>Save</DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleEdit(id)}>Edit</DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleCopy(row)}
                              >
                                Copy
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive hover:!bg-destructive/20"
                                onClick={() => handleDelete(id)}
                              >
                                Delete
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
      </div>
    </div>
  )
}

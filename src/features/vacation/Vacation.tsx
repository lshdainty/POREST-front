import { useState, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Pie, PieChart, Cell, Label } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { Table, Header, HeaderRow, Body, Row, HeaderCell, Cell as TableCell } from '@table-library/react-table-library/table';
import { useTheme } from "@table-library/react-table-library/theme";
import { Button } from "@/components/shadcn/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/shadcn/dropdownMenu";
import { EllipsisVertical, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { Badge } from "@/components/shadcn/badge";

const user = {
  name: "홍길동",
  team: "개발팀",
  position: "팀장",
  avatar: "https://github.com/shadcn.png",
};

const vacationStats = [
  {
    title: "잔여 휴가",
    value: "5일",
    change: -1,
    changeType: "decrease",
    description: "지난 달 대비 1일 감소"
  },
  {
    title: "사용 휴가",
    value: "10일",
    change: 2,
    changeType: "increase",
    description: "지난 달 대비 2일 증가"
  },
  {
    title: "사용 예정 휴가",
    value: "2일",
    change: 0,
    changeType: ""
  },
];

const vacationTrends = [
  { name: '1월', value: 1 },
  { name: '2월', value: 0 },
  { name: '3월', value: 2 },
  { name: '4월', value: 1 },
  { name: '5월', value: 3 },
  { name: '6월', value: 0 },
  { name: '7월', value: 1 },
  { name: '8월', value: 2 },
  { name: '9월', value: 1 },
  { name: '10월', value: 2 },
  { name: '11월', value: 0 },
  { name: '12월', value: 4 },
];

const vacationTypes = [
  { name: '연차', value: 10, fill: 'var(--color-vacation-annual)' },
  { name: '반차', value: 5, fill: 'var(--color-vacation-half)' },
  { name: '병가', value: 2, fill: 'var(--color-vacation-sick)' },
  { name: '기타', value: 1, fill: 'var(--color-vacation-other)' },
];

const initialVacationHistory = [
    {
        id: "1",
        date: "2025-08-01",
        type: "연차",
        reason: "여름 휴가"
    },
    {
        id: "2",
        date: "2025-07-15",
        type: "반차",
        reason: "병원 방문"
    },
    {
        id: "3",
        date: "2025-08-05",
        type: "연차",
        reason: "가족 여행"
    },
    {
        id: "4",
        date: "2025-09-10",
        type: "연차",
        reason: "개인 사유"
    }
];

export default function Vacation() {
  const [vacationHistory, setVacationHistory] = useState(initialVacationHistory);

  const theme = useTheme([{
    Table: `--data-table-library_grid-template-columns: minmax(150px, 1fr) minmax(150px, 1fr) minmax(250px, 1fr) minmax(60px, auto) !important;`,
  }]);

  const totalVacationDays = useMemo(() => {
    return vacationTypes.reduce((total, item) => total + item.value, 0)
  }, []);

  const handleAdd = () => {
    const newId = (Math.max(...vacationHistory.map(item => parseInt(item.id))) + 1).toString();
    const newVacation = {
      id: newId,
      date: new Date().toISOString().split('T')[0],
      type: "연차",
      reason: ""
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

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <style>{`
        :root {
          --color-vacation-annual: #0088FE;
          --color-vacation-half: #00C49F;
          --color-vacation-sick: #FFBB28;
          --color-vacation-other: #FF8042;
        }
      `}</style>
      <h1 className="text-3xl font-bold mb-6">휴가 관리</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card className="flex-grow">
            <CardHeader>
              <CardTitle>사용자 정보</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <p className="text-xl font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.team} / {user.position}</p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid gap-6 md:grid-cols-3">
            {vacationStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  {stat.changeType && (
                    <Badge variant="outline" className={`text-xs ${stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.changeType === 'increase' ? (
                        <ArrowUpIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownIcon className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(stat.change)}일
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="py-0">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  {stat.description && (
                    <p className={`text-xs ${stat.changeType === 'increase' ? 'text-green-500' : stat.changeType === 'decrease' ? 'text-red-500' : 'text-gray-500'}`}>
                      {stat.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>월별 휴가 사용 추이</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={vacationTrends}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}일`}
                  />
                  <Tooltip
                    cursor={false}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="min-w-[8rem] rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
                                <span className="font-bold text-muted-foreground">{payload[0].value}일</span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 mt-6 lg:grid-cols-5">
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>휴가 유형</CardTitle>
            <CardDescription>올해 부여받은 휴가 유형</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Tooltip
                  cursor={false}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="min-w-[8rem] rounded-lg border bg-background p-2 shadow-sm">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: data.fill }}></div>
                            <span className="text-[0.85rem] text-muted-foreground">{data.name}</span>
                            <span className="ml-auto font-bold">{data.value}일</span>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Pie
                  data={vacationTypes}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  strokeWidth={2}
                >
                  {vacationTypes.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-center"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {totalVacationDays.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 20}
                              className="fill-muted-foreground text-sm"
                            >
                              총 휴가
                            </tspan>
                          </text>
                        )
                      }
                      return null;
                    }}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm pt-4">
            <div className="flex w-full items-center justify-center gap-4 text-muted-foreground">
              {vacationTypes.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </CardFooter>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>휴가 내역</CardTitle>
            <Button onClick={handleAdd} size="sm">추가</Button>
          </CardHeader>
          <CardContent>
            <Table data={{ nodes: vacationHistory }} theme={theme} layout={{ fixedHeader: true }}>
              {(tableList: any) => (
                <>
                  <Header>
                    <HeaderRow className='!bg-muted !text-foreground [&_th]:!p-2 [&_th]:!text-sm [&_th]:!h-10 [&_th]:!font-medium'>
                      <HeaderCell>날짜</HeaderCell>
                      <HeaderCell>종류</HeaderCell>
                      <HeaderCell>사유</HeaderCell>
                      <HeaderCell></HeaderCell>
                    </HeaderRow>
                  </Header>
                  <Body>
                    {tableList.map((item: any) => (
                      <Row key={item.id} item={item} className='hover:!bg-muted/50 !bg-background !text-foreground [&_td]:!p-2 [&_td]:!text-sm'>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.reason}</TableCell>
                        <TableCell>
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
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(item.id)}>수정</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive hover:!bg-destructive/20"
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
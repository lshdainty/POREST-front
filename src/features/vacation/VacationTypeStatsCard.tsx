import { useMemo } from 'react';
import { GetAvailableVacationsResp } from '@/api/vacation';
import { ResponsiveContainer, Tooltip, Pie, PieChart, Cell, Label } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card';
import { cn } from '@/lib/utils';

const renderChartColor = (type: string) => {
  switch (type) {
    case 'ANNUAL':
      return '#0088FE';
    case 'MATERNITY':
      return '#FFBB28';
    case 'WEDDING':
      return '#8884d8';
    case 'BEREAVEMENT':
      return '#FF8042';
    case 'OVERTIME':
      return '#00C49F';
  }
}

interface VacationTypeStatsCardProps {
  value: GetAvailableVacationsResp[]
  className: string | undefined;
}

export default function VacationTypeStatsCard({ value, className }: VacationTypeStatsCardProps) {
  const vacationTypes = useMemo(() => {
    if (value) {
      const formattedTypes = value.map((type: GetAvailableVacationsResp) => ({
        ...type,
        fill: renderChartColor(type.vacation_type)
      }));
      return formattedTypes;
    }
  }, [value]);
  
  const totalVacationDays = useMemo(() => {
    return vacationTypes?.reduce((total, item) => total + item.remain_time, 0)
  }, []);

  return (
    <Card className={cn(className)}>
      <CardHeader className='items-center pb-0'>
        <CardTitle>휴가 유형</CardTitle>
        <CardDescription>올해 부여받은 휴가 유형</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ResponsiveContainer width='100%' height={300}>
          <PieChart>
            <Tooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className='min-w-[8rem] rounded-lg border bg-background p-2 shadow-sm'>
                      <div className='flex items-center gap-2'>
                        <div className='h-3 w-3 rounded-full' style={{ backgroundColor: data.fill }}></div>
                        <span className='text-[0.85rem] text-muted-foreground'>{data.vacation_type_name}</span>
                        <span className='ml-auto font-bold'>{data.remain_time_str}</span>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Pie
              data={vacationTypes}
              dataKey='remain_time'
              nameKey='vacation_type'
              cx='50%'
              cy='50%'
              innerRadius={80}
              outerRadius={120}
              strokeWidth={2}
            >
              {vacationTypes?.map((entry) => (
                <Cell key={`cell-${entry.vacation_type_name}`} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                        className='text-center'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalVacationDays?.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className='fill-muted-foreground text-sm'
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
      <CardFooter className='flex-col gap-2 text-sm pt-4'>
        <div className='flex w-full items-center justify-center gap-4 text-muted-foreground'>
          {vacationTypes?.map((item) => (
            <div key={item.vacation_type} className='flex items-center gap-1.5'>
              <div className='h-2.5 w-2.5 rounded-full' style={{ backgroundColor: item.fill }} />
              <span>{item.vacation_type_name}</span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}
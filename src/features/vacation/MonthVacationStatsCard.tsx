import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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

export default function MonthVacationStatsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>월별 휴가 사용 추이</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={350}>
          <BarChart data={vacationTrends}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='name'
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke='#888888'
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
                    <div className='min-w-[8rem] rounded-lg border bg-background p-2 shadow-sm'>
                      <div className='flex items-center gap-2'>
                        <div className='h-3 w-3 rounded-full' style={{ backgroundColor: '#8884d8' }}></div>
                        <span className='text-[0.85rem] text-muted-foreground'>{label}</span>
                        <span className='ml-auto font-bold'>{payload[0].value}일</span>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey='value' fill='#8884d8' radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
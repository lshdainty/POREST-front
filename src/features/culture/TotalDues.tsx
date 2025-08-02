import {
  useGetYearOperationDues,
  useGetMonthBirthDues
} from '@/api/dues';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card"
import { DollarSign, Users, BanknoteArrowDown, BanknoteArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';

export default function TotalDues() {
  const { data: totalDues, isLoading: totalDuesLoading} = useGetYearOperationDues({year: dayjs().format('YYYY')});
  const { data: birthDues, isLoading: birthDuesLoading} = useGetMonthBirthDues({year: dayjs().format('YYYY'), month: dayjs().format('MM')});

  if(totalDuesLoading || birthDuesLoading) {
    return <div>loading</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card key="total">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">전체 운영비</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-bold")}>₩{(totalDues?.total_dues ?? 0).toLocaleString('ko-KR')}</div>
        </CardContent>
      </Card>
      <Card key="deposit">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">운영비 입금</CardTitle>
          <BanknoteArrowUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-bold text-blue-500")}>₩{(totalDues?.total_deposit ?? 0).toLocaleString('ko-KR')}</div>
        </CardContent>
      </Card>
      <Card key="withdrawal">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">운영비 출금</CardTitle>
          <BanknoteArrowDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-bold text-red-500")}>₩{Math.abs(totalDues?.total_withdrawal ?? 0).toLocaleString('ko-KR')}</div>
        </CardContent>
      </Card>
      <Card key="birth">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{dayjs().format('MM')}월 생일비</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-bold")}>₩{(birthDues?.birth_month_dues ?? 0).toLocaleString('ko-KR')}</div>
        </CardContent>
      </Card>
    </div>
  );
}